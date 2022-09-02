import toast from 'react-hot-toast';
import ContentForm from '../components/contentForm';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useMutation, gql } from '@apollo/client';

const CREATE_POST = gql`
  mutation CreateNewPost($input: PostInput) {
    createPost(input: $input) {
      id
    }
  }
`;

const CreateNewPost = (props) => {
  const router = useRouter();

  const [createPost, { data }] = useMutation(CREATE_POST);

  if (data) {
    props.client.clearStore();
    router.push('/view-posts');
  }

  const onSubmit = (formValues) => {
    const fetchData = createPost({ variables: { 'input': formValues } });

    toast.promise(
      fetchData,
      {
        loading: 'Saving...',
        success: 'Saved draft',
        error: 'Error when saving',
      },
      {
        style: {
          minWidth: '200px',
        },
      }
    );
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
