import { useEffect, useState } from 'react';

const ContentForm = (props) => {
  const [title, setTitle] = useState('');
  const [tags, setTags] = useState('');
  const [desc, setDesc] = useState('');
  const [content, setContent] = useState('');

  useEffect(() => {
    if (props.postData) {
      const data = props.postData;

      setTitle(data.postTitle);
      setTags(data.tags);
      setDesc(data.desc);
      setContent(data.content);
    }
  }, []);

  const onSubmit = (event) => {
    event.preventDefault();

    const formValues = {
      title: title,
      tags: tags,
      desc: desc,
      content: content,
    };

    props.onSubmit(formValues);
  };

  return (
    <div className='container mx-auto p-5'>
      <form onSubmit={onSubmit} className='flex flex-col gap-5'>
        <h1 className='text-2xl'>{props.header}</h1>

        <div>
          <label>Title</label> <br />
          <input
            type='text'
            id='title'
            name='title'
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className='border border-slate-500 rounded-md p-2 w-1/2'
          />
        </div>

        <div>
          <label>Tags</label> <br />
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
          <label>Description</label> <br />
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
          <label>Content</label> <br />
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

        {props.buttonJsx}
      </form>
    </div>
  );
};

export default ContentForm;
