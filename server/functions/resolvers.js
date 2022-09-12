// Firebase init
const admin = require('firebase-admin');
const { GraphQLUpload } = require('graphql-upload');

const serviceAccount = require('../serviceAccountKey.json');
admin.initializeApp({
  projectId: serviceAccount.project_id,
  credential: admin.credential.cert(serviceAccount),
  storageBucket: 'cms-app-1a47d.appspot.com',
});

// Store database ref
const db = admin.firestore().collection('posts');
// storage ref
const bucket = admin.storage().bucket();

// Post structure
class Post {
  constructor(id, { title, tags, desc }) {
    this.id = id;
    this.title = title;
    this.tags = tags;
    this.desc = desc;
  }
}

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
      snapshot.forEach((post) => {
        posts.push(new Post(post.id, post.data()));
      });

      return posts;
    } catch {
      throw new Error('Error retrieving posts');
    }
  },

  // Create a single post with input
  createPost: async ({ input }) => {
    try {
      // Create a new doc with input and return it as a post object
      const docRef = await db.add(input);
      return new Post(docRef.id, input);
    } catch {
      throw new Error('Error adding document');
    }
  },

  // Update an existing post of ID
  updatePost: async ({ id, input }) => {
    try {
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

  Upload: GraphQLUpload,

  singleFile: async (file) => {
    try {
      console.log(file);
      return 'file';
      // const sizeOfString = new TextEncoder().encode(file).length;
      // return `Size of file: ${sizeOfString} bytes`;

      // const fileRef = bucket.file(`photo.jpeg`);
      // const options = {
      //   resumable: false,
      //   metadata: { contentType: 'image/jpeg' },
      // };

      // await fileRef.save(file, options);
      // return 'file uploaded';
    } catch (err) {
      throw new Error('Error', err);
    }
  },
};
