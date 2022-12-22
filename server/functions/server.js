const path = require('path');

// Firebase init
const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json');
admin.initializeApp({
  projectId: serviceAccount.project_id,
  credential: admin.credential.cert(serviceAccount),
});

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
const cookieParser = require('cookie-parser');

const app = express();
app.use(cors({ origin: true, credentials: true }));
app.use(cookieParser());

const webKey = require('./webKey.json').key;

app.post('/login', async (req, res) => {
  // if (req.cookies.idToken) {
  //   res.json({ 'Log': 'User is logged in' });
  // } else {
  //   console.log('User is logged in');
  //   throw new Error('User is not logged in');
  // }

  fetch(
    'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=' +
      webKey,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ ...req.body, returnSecureToken: true }),
    }
  )
    .then((response) => response.json())
    .then((data) => {
      console.log('The data from fetch', data);
      return res
        .cookie('idToken', data.idToken, {
          secure: true,
          sameSite: 'none',
          httpOnly: true,
          path: '/',
        })
        .json({ 'msg': 'User is logged in' });
    });
});

const { graphqlHTTP } = require('express-graphql');

app.use(async (req, res, next) => {
  // Authentication
  console.log('cookies', req.cookies);
  if (!req.cookies.idToken) {
    return res.status(400).json({ 'error': 'User is not logged in' });
    // throw new Error('User is not logged in');
  } else {
    admin
      .auth()
      .verifyIdToken(req.cookies.idToken)
      .then((decodedToken) => {
        const uid = decodedToken.uid;
        console.log('User is logged in', uid);
        next();
      })
      .catch((err) => {
        console.log('Could no verify JWT', err);
        return res.status(400).json({ 'error': 'User does not exist' });
      });
  }
});

// Authentication
// const validateFirebaseIDToken = (req, res, next) => {
//   console.log('Logging req', req);
//   res.send();
//   // next();
// };
// app.use(validateFirebaseIDToken);

// Build graphql in express via http
// const { graphqlHTTP } = require('express-graphql');

app.use(
  '/graphql',
  graphqlHTTP({ schema: typeDefs, rootValue: resolvers, graphiql: true })
);

// export express app to Firebase functions
const functions = require('firebase-functions');
exports.server = functions.https.onRequest(app);
