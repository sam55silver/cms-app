import '../styles/globals.css';
import { Toaster } from 'react-hot-toast';
import Navigation from '../components/navigation';

import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client';

import { getFirestore, collection } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// init config
import { initializeApp } from 'firebase/app';

const firebaseConfig = {
  apiKey: 'AIzaSyCEORj7_l8J-gsWzYxomW67Wo1YPDvylgA',
  authDomain: 'cms-app-1a47d.firebaseapp.com',
  projectId: 'cms-app-1a47d',
  storageBucket: 'cms-app-1a47d.appspot.com',
  messagingSenderId: '858556728249',
  appId: '1:858556728249:web:07bbb8c92badf29e356c68',
};

initializeApp(firebaseConfig);

const db = getFirestore();
const fbStorage = getStorage();
const colRef = collection(db, 'posts');

// Init ApolloClient
const client = new ApolloClient({
  uri: 'http://localhost:5001/cms-app-1a47d/us-central1/app/graphql',
  cache: new InMemoryCache(),
});

function MyApp({ Component, pageProps }) {
  return (
    <ApolloProvider client={client}>
      <Toaster />
      <div className='flex h-full'>
        <Navigation />
        <Component colRef={colRef} fbStorage={fbStorage} {...pageProps} />
      </div>
    </ApolloProvider>
  );
}

export default MyApp;
