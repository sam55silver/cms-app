import { useRouter } from 'next/router';
import toast from 'react-hot-toast';
import ContentForm from '../../components/contentForm';
import useSWR, { mutate } from 'swr';
import { client, getPost, getPosts, updatePost } from '../../lib/graphql';

const Post = () => {
  const router = useRouter();
  const id = router.query.id;

  const { data, error } = useSWR(() => (id ? [getPost, { 'id': id }] : null));

  if (error) return <span>Error loading post!</span>;
  if (!data) return <span>Loading...</span>;

  const onSubmit = (formValues) => {
    const savingPost = client
      .request(updatePost, {
        'id': id,
        'input': formValues,
      })
      .then((returnedData) =>
        mutate([getPost, { 'id': id }], returnedData.updatePosts, {
          optimisticData: returnedData.updatePosts,
        })
      );

    toast.promise(savingPost, {
      loading: 'Saving...',
      success: 'Saved Draft',
      error: 'Error when saving',
    });
  };

  const deletePost = () => {
    const deletingPost = FetchData(deletePostQuery, { 'id': id });

    toast.promise(deletingPost, {
      loading: 'deleting...',
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
        onClick={deletePost}
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
