// Firebase init
const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

const db = admin.firestore().collection('posts');

// GraphQL Express server init
const express = require('express');
const cors = require('cors');

const { graphqlHTTP } = require('express-graphql');
const { buildSchema } = require('graphql');

const app = express();

// Construct a schema, using GraphQL schema language
const schema = buildSchema(`
  input PostInput {
    title: String
    tags: String
    desc: String
  }

  type Post {
    id: ID!
    title: String
    tags: String
    desc: String
  }

  type Mutation {
    createPost(input: PostInput): Post
    updatePost(id: ID!, input: PostInput): Post
    deletePost(id: ID!): String
  }

  type Query {
    getPost(id: ID!): Post
    getPosts(amount: Int, orderBy: [String]): [Post]
  }
`);

class Post {
  constructor(id, { title, tags, desc }) {
    this.id = id;
    this.title = title;
    this.tags = tags;
    this.desc = desc;
  }
}

const root = {
  getPost: async ({ id }) => {
    const docRef = db.doc(id);

    const doc = await docRef.get();

    if (doc.exists) {
      return new Post(id, doc.data());
    } else {
      throw new Error('Post dne!');
    }
  },

  getPosts: async ({ amount, orderBy }) => {
    try {
      const docQuery = db
        .orderBy(...(orderBy || ['title', 'desc']))
        .limit(amount || 10);

      const snapshot = await docQuery.get();

      let posts = [];
      snapshot.forEach((post) => {
        posts.push(new Post(post.id, post.data()));
      });

      return posts;
    } catch {
      throw new Error('Error retrieving posts');
    }
  },

  createPost: async ({ input }) => {
    try {
      const docRef = await db.add(input);
      return new Post(docRef.id, input);
    } catch {
      throw new Error('Error adding document');
    }
  },

  updatePost: async ({ id, input }) => {
    try {
      await db.doc(id).set(input);
      return new Post(id, input);
    } catch {
      throw new Error('Error updating document');
    }
  },

  deletePost: async ({ id }) => {
    try {
      await db.doc(id).delete();
      return 'Deleted document';
    } catch {
      throw new Error('Error deleting document');
    }
  },
};

app.use(cors({ origin: true }));

app.use(
  '/graphql',
  graphqlHTTP({ schema: schema, rootValue: root, graphiql: true })
);

exports.app = functions.https.onRequest(app);
