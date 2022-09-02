import '../styles/globals.css';
import { Toaster } from 'react-hot-toast';
import Navigation from '../components/navigation';

import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client';

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
        <Component client={client} {...pageProps} />
      </div>
    </ApolloProvider>
  );
}

export default MyApp;
