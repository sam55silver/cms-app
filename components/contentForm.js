import { useEffect, useState } from 'react';
import { marked } from 'marked';
import parse from 'html-react-parser';

const ContentForm = (props) => {
  const [title, setTitle] = useState('');
  const [tags, setTags] = useState('');
  const [desc, setDesc] = useState('');
  const [uploadedFiles, setUploadedFiles] = useState([]);

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
      // content: content,
    };

    props.onSubmit(formValues);
  };

  const uploadHandler = (event) => {
    const files = Array.from(event.target.files);
    setUploadedFiles([...uploadedFiles, ...files]);
  };

  const deleteFile = (event) => {
    const fileIndex = event.target.getAttribute('id');

    let newUploadedFiles = uploadedFiles;
    newUploadedFiles.splice(fileIndex, 1);

    setUploadedFiles([...newUploadedFiles]);
  };

  const readFiles = () => {
    const reader = new FileReader();

    let fileHeaders = [];
    let markdownPages = [];

    uploadedFiles.forEach((file, index) => {
      // Create file headers
      const header = (
        <div
          key={index}
          className='border-2 border-red-400 rounded-md p-2 w-1/2 flex justify-between items-center'
        >
          <span>{file.name}</span>
          <button
            id={index}
            type='button'
            onClick={deleteFile}
            className='primary-btn bg-red-500'
          >
            Delete
          </button>
        </div>
      );

      fileHeaders.push(header);

      if (file.name.includes('.md')) {
        console.log('Parsing', file);
        reader.readAsText(file);

        reader.onload = (e) => {
          const { result } = e.target;
          const html = marked.parse(result);

          const page = <div>{parse(html)}</div>;
          console.log(page);

          markdownPages.push(page);
        };
      }
    });

    return (
      <>
        <div className='flex flex-col gap-4'>
          {fileHeaders.map((header) => header)}
        </div>
        <div>{markdownPages.map((page) => page)}</div>
      </>
    );
  };

  return (
    <div className='container mx-auto p-5'>
      <form onSubmit={onSubmit} className='flex flex-col gap-5'>
        <h1 className='text-2xl font-bold'>{props.header}</h1>

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
            accept='image/png, image/jpeg, text/markdown,.md,.png,.jpeg'
            multiple
            onChange={uploadHandler}
          />
        </div>

        {uploadedFiles.length != 0 ? readFiles() : <span>No Files</span>}

        {props.buttonJsx}
      </form>
    </div>
  );
};

export default ContentForm;
