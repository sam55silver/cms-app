import '../styles/globals.css';
import { Toaster } from 'react-hot-toast';
import Navigation from '../components/navigation';

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Toaster />
      <div className='flex h-full'>
        <Navigation />
        <Component {...pageProps} />
      </div>
    </>
  );
}

export default MyApp;
