import { useState } from 'react';
import toast from 'react-hot-toast';

const savedNotify = () => toast.success('Content Saved!');

export default function Home() {
  const [postTitle, setPostTitle] = useState('');
  const [tags, setTags] = useState('');
  const [desc, setDesc] = useState('');
  const [content, setContent] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    savedNotify();
  };

  return (
    <div className='container mx-auto my-5'>
      <form className='flex flex-col gap-5' onSubmit={handleSubmit}>
        <h1 className='text-2xl'>Create a new post</h1>

        <div>
          <label for='postTitle'>Title</label> <br />
          <input
            type='text'
            id='postTitle'
            name='postTitle'
            value={postTitle}
            onChange={(e) => setPostTitle(e.target.value)}
            className='border border-slate-500 rounded-md p-2 w-1/2'
          />
        </div>

        <div>
          <label for='tags'>Tags</label> <br />
          <input
            type='text'
            id='tags'
            name='tags'
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder='Separate tags with a comma (,)'
            className='border border-slate-500 rounded-md p-2 w-1/2'
          />
        </div>

        <div>
          <label for='desc'>Description</label> <br />
          <textarea
            type='text'
            id='desc'
            name='desc'
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
            className='border border-slate-500 rounded-md p-2 w-1/2'
          />
        </div>

        <div>
          <label for='content'>Content</label> <br />
          <textarea
            rows='30'
            type='text'
            id='content'
            name='content'
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className='border border-slate-500 rounded-md p-2 w-full'
          />
        </div>

        <div className='flex justify-between'>
          <button type='submit' className='bg-blue-500 primary-btn'>
            Save Changes
          </button>

          <div className='flex gap-2'>
            <button type='button' className='bg-green-500 primary-btn'>
              Publish
            </button>
            <button type='button' className='bg-red-500 primary-btn'>
              Delete
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
