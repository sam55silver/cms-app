import { addDoc } from 'firebase/firestore';
import { ref, uploadBytes } from 'firebase/storage';
import toast from 'react-hot-toast';
import ContentForm from '../components/contentForm';
import Link from 'next/link';
import { useRouter } from 'next/router';

const CreateNewPost = ({ colRef, fbStorage }) => {
  const router = useRouter();

  const onSubmit = (formValues) => {
    const { title, tags, desc } = formValues;

    const newDoc = addDoc(colRef, {
      title: title,
      tags: tags,
      desc: desc,
    }).then((docRef) => {
      formValues.content.map((file) => {
        const path = `${docRef.id}/${file.name}`;
        const storageRef = ref(fbStorage, path);

        uploadBytes(storageRef, file.file).then((snapshot) => {
          console.log('Uploaded file!', snapshot);
          router.push('/view-posts');
        });
      });
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
