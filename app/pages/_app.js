import '../styles/globals.css';

import { client } from '../lib/graphql';
import { SWRConfig } from 'swr';
import { Toaster } from 'react-hot-toast';
import Navigation from '../components/navigation';
import LogInForm from '../components/logInForm';
import { useState, useEffect } from 'react';
import Cookies from 'js-cookie';

const fetcher = (query, variables) => client.request(query, variables);

function MyApp({ Component, pageProps }) {
  // const [userUID, setUserUID] = useState(Cookies.get('userUID'));
  // console.log('UID', userUID);

  return (
    <SWRConfig
      value={{
        fetcher,
        revalidateOnFocus: false,
      }}
    >
      {/* {userUID ? (
        <>
          <Toaster />
          <div className='flex h-screen'>
            <Navigation />
            <Component {...pageProps} />
          </div>
        </>
      ) : (
        <LogInForm />
      )} */}
      <LogInForm />
    </SWRConfig>
  );
}

export default MyApp;
