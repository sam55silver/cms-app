import { addDoc } from 'firebase/firestore';
import toast from 'react-hot-toast';
import ContentForm from '../components/contentForm';
import Link from 'next/link';
import { useRouter } from 'next/router';

const CreateNewPost = ({ colRef }) => {
  const router = useRouter();

  const onSubmit = (formValues) => {
    const newDoc = addDoc(colRef, formValues).then((docRef) => {
      router.push('/view-posts');
    });

    toast.promise(newDoc, {
      loading: 'Saving...',
      success: 'Saved Draft',
      error: 'Error when saving',
    });
  };

  const buttonJsx = (
    <div className='flex justify-between'>
      <button type='submit' className='bg-blue-500 primary-btn'>
        Save Draft
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
