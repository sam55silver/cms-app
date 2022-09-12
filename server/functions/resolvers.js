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

  files.forEach((file) => {
    console.log(file.name);
  });
};

// Resolvers
module.exports = {
  // fetch a single post with ID
  getPost: async ({ id }) => {
    const docRef = db.doc(id);

    const doc = await docRef.get();

    if (doc.exists) {
      return new Post(id, doc.data());
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

      // For each doc create a new post class
      let posts = [];
      snapshot.forEach(async (post) => {
        console.log('getting post files');
        const files = await fetchFileURI(post.id);
        console.log('done getting post files');
        posts.push(new Post(post.id, post.data()));
      });

      return posts;
    } catch {
      throw new Error('Error retrieving posts');
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
      // If files exist in input, upload them
      input = await fileUpload(input);

      // Get and set the post pf ID
      await db.doc(id).set(input);
      // return post object
      return new Post(id, input);
    } catch {
      throw new Error('Error updating document');
    }
  },

  // Delete an existing post of ID
  deletePost: async ({ id }) => {
    try {
      // Get and delete post of ID
      await db.doc(id).delete();
      return 'Deleted document';
    } catch {
      throw new Error('Error deleting document');
    }
  },
};
