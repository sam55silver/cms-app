import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { doc, getDoc, setDoc, deleteDoc } from 'firebase/firestore';
import { ref, getDownloadURL, listAll } from 'firebase/storage';
import toast from 'react-hot-toast';

import ContentForm from '../../components/contentForm';

const Post = ({ colRef, fbStorage }) => {
  const router = useRouter();
  const id = router.query.id;

  const [data, setData] = useState(null);

  useEffect(() => {
    console.log('fetching data. ID:', id);

    if (id) {
      const fetchData = async () => {
        const docSnap = await getDoc(doc(colRef, id));

        const storageRef = ref(fbStorage, id);

        // To-do add in graphQL DB

        // const storageURL = await getDownloadURL(storageRef);

        // const xhr = new XMLHttpRequest();
        // xhr.responseType = 'file';
        // xhr.onload = (event) => {
        //   const file = xhr.response;
        //   console.log(event);
        //   console.log(file);
        // };
        // xhr.open('GET', storageURL);
        // await xhr.send();

        // return docSnap;

        // getDownloadURL(storageRef).then((url) => {
        //   fetch(url, { method: 'GET', credentials: 'include' }).then((res) =>
        //     console.log('result', res)
        //   );
        //   // const xhr = new XMLHttpRequest();
        //   // xhr.responseType = 'blob';
        //   // xhr.onload = (event) => {
        //   //   const blob = xhr.response;
        //   //   console.log('Here is a blob', blob);
        //   // };
        //   // xhr.open('GET', url);
        //   // xhr.send();
        // });
      };

      fetchData().then((docSnap) => {
        if (docSnap.exists()) {
          setData(docSnap.data());
        } else {
          setData({ error: 'Document DNE' });
        }
      });
    }
  }, [id]);

  if (!data) {
    return <div>loading...</div>;
  } else if (data.error) {
    return <div>{data.error}</div>;
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
