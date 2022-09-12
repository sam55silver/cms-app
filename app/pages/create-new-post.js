import toast from 'react-hot-toast';
import ContentForm from '../components/contentForm';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { client, createPost } from '../lib/graphql';

const CreateNewPost = () => {
  const router = useRouter();

  const onSubmit = (formValues) => {
    console.log('submitting form', formValues);
    const creatingPost = client
      .request(createPost, {
        'input': formValues,
      })
      .then(() => router.push('/view-posts'));

    toast.promise(creatingPost, {
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
