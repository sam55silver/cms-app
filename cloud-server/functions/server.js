// Firebase init
const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

// GraphQL Express server init
const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const { buildSchema } = require('graphql');

const app = express();

const schema = buildSchema(`
  type Query {
    helloWorld: String!
  }
`);

const root = {
  helloWorld: () => {
    return 'Hello World!';
  },
};

app.use(
  '/graphql',
  graphqlHTTP({ schema: schema, rootValue: root, graphiql: true })
);

exports.app = functions.https.onRequest(app);
