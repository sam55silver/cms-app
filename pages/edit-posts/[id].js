import useSWR from 'swr';
import { useRouter } from 'next/router';
import { doc, getDoc, setDoc, deleteDoc } from 'firebase/firestore';
import toast from 'react-hot-toast';

import ContentForm from '../../components/contentForm';

const fetcher = async ({ colRef, docID }) => {
  const docRef = doc(colRef, docID);
  const docSnap = await getDoc(docRef);

  return docSnap.data();
};

const Post = ({ colRef }) => {
  const router = useRouter();
  const id = router.query.id;

  const { data, error } = useSWR({ colRef: colRef, docID: id }, fetcher);

  // TO-DO: fix form from not reloading?

  if (error) return <div>Failed to load</div>;
  if (!data) {
    console.log('on loading');
    return <div>loading...</div>;
  }

  const onSubmit = (formValues) => {
    console.log('data', data, 'formValues', formValues);

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
      postData={postData}
    />
  );
};

export default Post;
