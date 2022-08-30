import '../styles/globals.css';
import { Toaster } from 'react-hot-toast';
import Navigation from '../components/navigation';

import { getFirestore, collection } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

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

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Toaster />
      <div className='flex h-full'>
        <Navigation />
        <Component colRef={colRef} fbStorage={fbStorage} {...pageProps} />
      </div>
    </>
  );
}

export default MyApp;
