import { useState } from 'react';
import { addDoc } from 'firebase/firestore';

import ContentForm from '../components/contentForm';
import Link from 'next/link';

const CreateNewPost = () => {
  const onSubmit = (formValues) => {
    console.log(formValues);
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

// export default function Home({ colRef }) {
//   const [postTitle, setPostTitle] = useState('');
//   const [tags, setTags] = useState('');
//   const [desc, setDesc] = useState('');
//   const [content, setContent] = useState('');

//   const handleSubmit = (event) => {
//     event.preventDefault();

//     const newDoc = addDoc(colRef, { postTitle, tags, desc, content }).then(
//       (docRef) => {
//         console.log('ID: ' + docRef.id);
//       }
//     );

//     toast.promise(newDoc, {
//       loading: 'Saving...',
//       success: 'Saved data',
//       error: 'Error when saving',
//     });
//   };

//   return (
//     <div className='flex justify-between'>
//       <button type='submit' className='bg-blue-500 primary-btn'>
//         Save Changes
//       </button>

//       <div className='flex gap-2'>
//         <button type='button' className='bg-green-500 primary-btn'>
//           Publish
//         </button>
//         <button type='button' className='bg-red-500 primary-btn'>
//           Delete
//         </button>
//       </div>
//     </div>
//   );
// }
