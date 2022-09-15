// Firebase init
const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json');
admin.initializeApp({
  projectId: serviceAccount.project_id,
  credential: admin.credential.cert(serviceAccount),
});

const stream = require('stream');

// Firestore database ref
const db = admin.firestore().collection('posts');

// Storage bucket ref
const { Storage } = require('@google-cloud/storage');
const storage = new Storage();

const bucket = storage.bucket('cms-app-1a47d.appspot.com'); // TO-DO: make private

// Post structure
class Post {
  constructor(id, { title, tags, desc, files }) {
    this.id = id;
    this.title = title;
    this.tags = tags;
    this.desc = desc;
    this.files = files;
  }
}

// File structure
class File {
  constructor(fileName, uri, type) {
    this.fileName = fileName;
    this.uri = uri;
    this.type = type;
  }
}

// Decode base64 strings into files and upload to google bucket
const fileUpload = async (files, postID) => {
  // Check if input has files
  if (files) {
    console.log('Uploading files');

    const uploadFiles = files.map(async (file) => {
      // Decode base64 string to get files bytes
      const filesBytes = Buffer.from(file.base64String, 'base64');

      // Set files bytes into a stream to insert into bucket
      const bufferStream = new stream.PassThrough();
      bufferStream.end(filesBytes);

      // Get ref of File
      const fileRef = bucket.file(postID + '/' + file.fileName);

      return new Promise((resolve, reject) => {
        // stream bytes to google bucket
        bufferStream
          .pipe(
            fileRef
              .createWriteStream({
                metadata: {
                  contentType: file.type,
                  metadata: {
                    custom: 'metadata',
                  },
                },
                public: false,
                validation: 'md5',
              })
              .on('error', (err) => {
                reject(err);
              })
          )
          .on('error', (err) => {
            reject(err);
          })
          .on('finish', () => {
            // Create temp download URI
            fileRef
              .getSignedUrl({
                action: 'read',
                expires: Date.now() + 24 * 60 * 60 * 1000, // Keep URI live for a day
              })
              .then((uri) => {
                resolve(new File(file.fileName, uri[0], file.type));
              })
              .catch((err) => {
                reject(err);
              });
          });
      });
    });

    // Wait for all files to be uploaded and get signedURIs, then return files
    const res = await Promise.all(uploadFiles);
    return res;
  } else {
    return null;
  }
};

const fetchFileURI = async (postID) => {
  const options = {
    prefix: postID + '/',
  };

  const [files] = await bucket.getFiles(options);

  const fileObjs = files.map((file) => {
    return new Promise((resolve, reject) => {
      try {
        const fileName = file.metadata.name.split('/').at(-1);
        const type = file.metadata.contentType;

        file
          .getSignedUrl({
            action: 'read',
            expires: Date.now() + 24 * 60 * 60 * 1000, // Keep URI live for a day
          })
          .then((uri) => resolve(new File(fileName, uri[0], type)));
      } catch (err) {
        reject(err);
      }
    });
  });

  const res = await Promise.all(fileObjs);
  return res;
};

// Resolvers
module.exports = {
  // fetch a single post with ID
  getPost: async ({ id }) => {
    const docRef = db.doc(id);

    const doc = await docRef.get();

    if (doc.exists) {
      const files = await fetchFileURI(doc.id);
      const input = { ...doc.data(), files: files };
      return new Post(id, input);
    } else {
      throw new Error('Post dne!');
    }
  },

  // Fetch multiple posts
  getPosts: async ({ amount, orderBy }) => {
    try {
      const docQuery = db
        // If no orderby, default to title
        .orderBy(...(orderBy || ['title', 'desc']))
        // If no amount, default to 10
        .limit(amount || 10);

      // get posts' docs
      const snapshot = await docQuery.get();

      // Get each posts data
      let posts = [];
      // let postObjs = [];
      snapshot.forEach((post) => {
        // postObjs.push({ id: post.id, input: post.data() });
        posts.push(new Post(post.id, post.data()));
      });

      // Uncomment to get files in getPosts call
      // For each post create a new post class
      // for (var postIndex in postObjs) {
      //   const post = postObjs[postIndex];

      //   post.input['files'] = await fetchFileURI(post.id);

      //   posts.push(new Post(post.id, post.input));
      // }

      return posts;
    } catch (err) {
      throw new Error(err);
    }
  },

  // Create a single post with input and upload files
  createPost: async ({ input }) => {
    try {
      // Create a new doc with input and return it as a post object
      const docRef = await db.add({
        title: input.title,
        tags: input.tags,
        desc: input.desc,
      });

      // If files exist in input, upload them
      input.files = await fileUpload(input.files, docRef.id);

      return new Post(docRef.id, input);
    } catch (err) {
      throw new Error(err);
    }
  },

  // Update an existing post of ID
  updatePost: async ({ id, input }) => {
    try {
      // Get and set the post of ID
      await db.doc(id).set({
        title: input.title,
        tags: input.tags,
        desc: input.desc,
      });

      // If files exist in input, upload them
      input.files = await fileUpload(input.files, id);

      // return post object
      return new Post(id, input);
    } catch (err) {
      throw new Error(err);
    }
  },

  // Delete an existing post of ID
  deletePost: async ({ id }) => {
    try {
      // delete files
      await bucket.deleteFiles({ prefix: id + '/' });

      // Get and delete post of ID
      await db.doc(id).delete();
      return 'Deleted document';
    } catch (err) {
      throw new Error(err);
    }
  },
};
