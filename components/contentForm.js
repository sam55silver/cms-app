import { useEffect, useState } from 'react';

const ContentForm = (props) => {
  const [title, setTitle] = useState('');
  const [tags, setTags] = useState('');
  const [desc, setDesc] = useState('');
  const [content, setContent] = useState([]);

  useEffect(() => {
    if (props.postData) {
      const data = props.postData;

      setTitle(data.title);
      setTags(data.tags);
      setDesc(data.desc);
      // setContent(data.content);
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

  const uploadHandler = (event) => {
    const files = Array.from(event.target.files);

    setContent([...content, ...files]);

    // const reader = new FileReader();
    // reader.onload = (e) => {
    //   const { result } = e.target;
    //   console.log(result);
    // };

    // for (let i = 0; i < files.length; i++) {
    //   const file = files[i];
    //   console.log(file);

    //   if (file.type.includes('text')) {
    //     reader.readAsText(file);
    //   } else if (file.type.includes('image')) {
    //     reader.readAsDataURL(file);
    //   }
    // }
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
          <input
            type='file'
            id='content'
            name='content'
            accept='image/png, image/jpeg, text/markdown'
            multiple
            onChange={uploadHandler}
          />
        </div>

        <div>
          {content && content.length != 0 ? (
            content.map((file, index) => <div key={index}>{file.name}</div>)
          ) : (
            <p>no files</p>
          )}
        </div>

        {props.buttonJsx}
      </form>
    </div>
  );
};

export default ContentForm;
