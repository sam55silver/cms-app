import { addDoc } from 'firebase/firestore';
import { ref, uploadBytes } from 'firebase/storage';
import toast from 'react-hot-toast';
import ContentForm from '../components/contentForm';
import Link from 'next/link';
import { useRouter } from 'next/router';
import axios from 'axios';

const CreateNewPost = ({ colRef, fbStorage }) => {
  const router = useRouter();

  const onSubmit = ({ title, tags, desc }) => {
    const fetchData = axios({
      url: 'http://localhost:5001/cms-app-1a47d/us-central1/app/graphql',
      method: 'post',
      headers: {
        'content-type': 'application/json',
      },
      data: {
        'query': 'query {helloWorld}',
        'variables': {},
      },
    }).then(({ data }) => {
      console.log(data);
    });

    toast.promise(fetchData, {
      loading: 'Saving...',
      success: 'Saved Draft',
      error: 'Error when saving',
    });
  };

  const buttonJsx = (
    <div className='flex justify-between'>
      <button type='submit' className='bg-blue-500 primary-btn'>
        Create Draft
      </button>

      <Link href='/'>
        <button type='button' className='bg-gray-400 primary-btn'>
          Cancel
        </button>
      </Link>
    </div>
  );

  return (
    <ContentForm
      header='Create a new post'
      buttonJsx={buttonJsx}
      onSubmit={onSubmit}
    />
  );
};

export default CreateNewPost;
