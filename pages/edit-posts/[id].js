import useSWR from 'swr';
import { useRouter } from 'next/router';
import { doc, getDoc } from 'firebase/firestore';

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

  if (error) return <div>Failed to load</div>;
  if (!data) return <div>loading...</div>;

  const onSubmit = (formValues) => {
    console.log(formValues);
  };

  const buttonJsx = (
    <div className='flex justify-between'>
      <button type='submit' className='bg-blue-500 primary-btn'>
        Save Draft
      </button>

      <button type='button' className='bg-red-500 primary-btn'>
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
