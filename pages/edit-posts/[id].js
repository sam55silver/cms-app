import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { doc, setDoc, deleteDoc } from 'firebase/firestore';
import toast from 'react-hot-toast';

import ContentForm from '../../components/contentForm';
import FetchData from '../../helper/fetchData';

const query = `
query Post($id: ID!) {
  getPost(id: $id) {
    title
    tags
    desc
    id
  }
}
`;

const Post = ({ colRef }) => {
  const router = useRouter();
  const id = router.query.id;

  const [data, setData] = useState(null);

  useEffect(() => {
    console.log('fetching data. ID:', id);

    if (id) {
      FetchData(query, { id: id }).then((data) => {
        setData(data.getPost);
      });
    }
  }, [router]);

  if (!data) {
    return <div>loading...</div>;
  }

  const onSubmit = (formValues) => {
    const savingDoc = setDoc(doc(colRef, id), formValues).then(() => {
      router.push('/view-posts');
    });

    toast.promise(savingDoc, {
      loading: 'Saving...',
      success: 'Saved Draft',
      error: 'Error when saving',
    });
  };

  const deletePost = () => {
    const deletingPost = deleteDoc(doc(colRef, id)).then(() => {
      router.push('/view-posts');
    });

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
      postData={data}
    />
  );
};

export default Post;
