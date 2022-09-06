import '../styles/globals.css';

import { client } from '../lib/graphql';
import { SWRConfig } from 'swr';
import { Toaster } from 'react-hot-toast';
import Navigation from '../components/navigation';

const fetcher = (query, variables) => client.request(query, variables);

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
