import '../styles/globals.css';

import { client } from '../lib/graphql';
import { SWRConfig } from 'swr';
import { Toaster } from 'react-hot-toast';
import Navigation from '../components/navigation';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import Cookies from 'js-cookie';

const fetcher = (query, variables) =>
  fetch('http://localhost:5001/cms-app-1a47d/us-central1/server/graphql', {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query: query, variables: variables }),
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.error) {
        useRouter().push('/login');
        console.log('The data from fetch', data);
      }
      return data.data;
    });

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
      <Toaster />
      <div className='flex h-screen'>
        <Navigation />
        <Component {...pageProps} />
      </div>
    </SWRConfig>
  );
}

export default MyApp;
