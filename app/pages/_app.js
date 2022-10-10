import '../styles/globals.css';

import { client } from '../lib/graphql';
import { SWRConfig } from 'swr';
import { Toaster } from 'react-hot-toast';
import Navigation from '../components/navigation';
import { initializeApp } from 'firebase/app';
import { getAuth, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import firebaseConfig from '../firebaseConfig.json';

const fbApp = initializeApp(firebaseConfig);
const auth = getAuth(fbApp);
const provider = new GoogleAuthProvider();

const fetcher = (query, variables) => client.request(query, variables);

const checkAuth = () => {
  if (true) {
    signInWithPopup(auth, provider)
      .then((result) => {
        // This gives you a Google Access Token. You can use it to access the Google API.
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential.accessToken;
        // The signed-in user info.
        const user = result.user;
        // ...
      })
      .catch((error) => {
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
        // The email of the user's account used.
        const email = error.customData.email;
        // The AuthCredential type that was used.
        const credential = GoogleAuthProvider.credentialFromError(error);
        // ...
      });

    return <></>;
  } else {
    return (
      <>
        <Navigation />
        <Component {...pageProps} />
      </>
    );
  }
};

function MyApp({ Component, pageProps }) {
  return (
    <SWRConfig
      value={{
        fetcher,
        revalidateOnFocus: false,
      }}
    >
      <Toaster />
      <div className='flex h-screen'>
        <Navigation />
        <Component {...pageProps} />
      </div>
    </SWRConfig>
  );
}

export default MyApp;
