// Firebase init
const functions = require('firebase-functions');
const { ApolloServer } = require('apollo-server-cloud-functions');

const { loadSchemaSync } = require('@graphql-tools/load');
const { GraphQLFileLoader } = require('@graphql-tools/graphql-file-loader');
const typeDefs = loadSchemaSync('schema.graphql', {
  loaders: [new GraphQLFileLoader()],
});

const admin = require('firebase-admin');
admin.initializeApp();

const db = admin.firestore().collection('posts');

class Post {
  constructor(id, { title, tags, desc }) {
    this.id = id;
    this.title = title;
    this.tags = tags;
    this.desc = desc;
  }
}

const resolver = {
  Query: {
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
  },

  Mutation: {
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
  },
};

const server = new ApolloServer({
  typeDefs,
  resolver,
  csrfPrevention: true,
  cache: 'bounded',
});

const handler = server.createHandler();
exports.app = functions.https.onRequest(handler);
