// Firebase init
const admin = require('firebase-admin');
admin.initializeApp();

// Store database ref
const db = admin.firestore().collection('posts');

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
};
