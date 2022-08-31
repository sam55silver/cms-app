import { useRouter } from 'next/router';
import toast from 'react-hot-toast';
import ContentForm from '../../components/contentForm';
import { useQuery, gql, useMutation } from '@apollo/client';

const GET_POST = gql`
  query getPost($id: ID!) {
    getPost(id: $id) {
      title
      tags
      desc
    }
  }
`;

const UPDATE_POST = gql`
  mutation updatePost($id: ID!, $input: PostInput) {
    updatePost(id: $id, input: $input) {
      id
    }
  }
`;

const DELETE_POST = gql`
  mutation deletePost($id: ID!) {
    deletePost(id: $id)
  }
`;

const Post = () => {
  const router = useRouter();
  const { id } = router.query;

  const [updatePost, { updateData }] = useMutation(UPDATE_POST);
  const [deletePost, { deletePostData }] = useMutation(DELETE_POST);

  const { error, data } = useQuery(GET_POST, {
    variables: { id: id },
    skip: !id,
  });

  if (error) return <div>Error</div>;
  if (!data) return <div>Loading...</div>;

  const onSubmit = (formValues) => {
    const savingDoc = updatePost({
      variables: { 'id': id, 'input': formValues },
    }).then(() => {
      router.push('/view-posts');
    });

    toast.promise(savingDoc, {
      loading: 'Saving...',
      success: 'Saved Draft',
      error: 'Error when saving',
    });
  };

  const deletePostBtn = () => {
    const deletingPost = deletePost({ variables: { 'id': id } }).then(
      router.push('/view-posts')
    );

    toast.promise(deletingPost, {
      loading: 'Deleting...',
      success: 'Deleted Post',
      error: 'Error when deleting',
    });
  };

  const buttonJsx = (
    <div className='flex justify-between'>
      <button type='submit' className='bg-blue-500 primary-btn'>
        Save Draft
      </button>

      <button
        type='button'
        onClick={deletePostBtn}
        className='bg-red-500 primary-btn'
      >
        Delete
      </button>
    </div>
  );

  return (
    <ContentForm
      header='Edit post'
      buttonJsx={buttonJsx}
      onSubmit={onSubmit}
      postData={data.getPost}
    />
  );
};

export default Post;
