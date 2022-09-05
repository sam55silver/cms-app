const path = require('path');

const { loadSchemaSync } = require('@graphql-tools/load');
const { GraphQLFileLoader } = require('@graphql-tools/graphql-file-loader');

// Load typeDefs via schema file
const typeDefs = loadSchemaSync(path.join(__dirname, 'schema.graphql'), {
  loaders: [new GraphQLFileLoader()],
});

// Load resolvers via resolvers file
const resolvers = require(path.join(__dirname, 'resolvers.js'));

// Init Express with Cors
const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors({ origin: true }));

// Build graphql in express via http
const { graphqlHTTP } = require('express-graphql');
app.use(
  '/graphql',
  graphqlHTTP({ schema: typeDefs, rootValue: resolvers, graphiql: true })
);

// export express app to Firebase functions
const functions = require('firebase-functions');
exports.server = functions.https.onRequest(app);
