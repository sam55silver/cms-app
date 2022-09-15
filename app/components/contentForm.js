import { useEffect, useState } from 'react';
import { marked } from 'marked';
import parse, { Comment } from 'html-react-parser';
import Image from 'next/image';
import toast from 'react-hot-toast';

const ContentForm = (props) => {
  const [title, setTitle] = useState('');
  const [tags, setTags] = useState('');
  const [desc, setDesc] = useState('');
  const [cloudFiles, setCloudFiles] = useState([]);
  const [uploadedFiles, setUploadedFiles] = useState([]);

  useEffect(() => {
    if (props.postData) {
      const data = props.postData;

      setTitle(data.title);
      setTags(data.tags);
      setDesc(data.desc);
      setCloudFiles(data.files);
    }
  }, []);

  const onSubmit = (event) => {
    event.preventDefault();

    // Get rid of the extra stuff FileReader.readAsDataURL gives when encoding to base64
    const base64Files = uploadedFiles.map((file) => {
      const base64String = file.base64URL.split(',')[1];
      return { base64String, fileName: file.fileName, type: file.type };
    });

    const formValues = {
      title: title,
      tags: tags,
      desc: desc,
      files: base64Files,
    };

    props.onSubmit(formValues);
  };

  const uploadHandler = async (event) => {
    // Get all existing file names
    const fileNames = uploadedFiles
      .concat(cloudFiles)
      .map((file) => file.fileName);

    // Get array of uploaded files from input
    const files = Array.from(event.target.files)

      // Filter through each file checking if the file name already exists
      .filter((file) => {
        if (fileNames.includes(file.name)) {
          // Notify user of conflicting file names
          toast.error(`File name "${file.name}" already exists!`);
          return false;
        }
        return true;
      })

      // Map through the files with names that do not conflict
      .map((file) => {
        const reader = new FileReader();

        // Create a promise that resolves once the file is finished being read
        return new Promise((resolve) => {
          reader.onload = () => {
            const fileName = file.name;
            const type = file.type;
            resolve({ base64URL: reader.result, fileName, type });
          };

          // encode file to base64 for transfer of file over internet
          reader.readAsDataURL(file);
        });
      });

    // wait for all the files to be read then put the results to uploadedFiles
    Promise.all(files).then((result) =>
      setUploadedFiles([...uploadedFiles, ...result])
    );
  };

  const deleteFile = (event) => {
    const fileIndex = event.target.getAttribute('id');

    let newUploadedFiles = uploadedFiles;
    newUploadedFiles.splice(fileIndex, 1);

    setUploadedFiles([...newUploadedFiles]);
  };

  const readFiles = () => {
    let fileHeaders = [];
    let content = [];
    let renderedImages = [];

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

      if (file.type == 'text') {
        let page = parse(marked.parse(file.content));

        page.map((elem, index) => {
          if (elem.type == 'p' && elem.props.children.type == 'img') {
            const imgFileName = elem.props.children.props.src;

            let imgSrc = null;

            uploadedFiles.forEach((obj) => {
              if (obj.name == imgFileName) {
                renderedImages.push(obj.name);
                imgSrc = obj.content;
              }
            });

            if (imgSrc) {
              page[index] = <img src={imgSrc} />;
            }
          }
        });

        content.push({ elem: page });
      } else {
        const image = <Image src={file.content} width={50} height={50} />;
        const imageObj = { name: file.name, elem: image };
        content.push(imageObj);
      }

      fileHeaders.push(header);
    });

    return (
      <>
        <div className='flex flex-col gap-4'>
          {fileHeaders.map((header) => header)}
        </div>
        <h2 className='text-xl font-bold'>Preview</h2>
        <div>
          {content.map((page, index) => {
            if (!renderedImages.includes(page.name)) {
              return <div key={index}>{page.elem}</div>;
            }
          })}
        </div>
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

        {cloudFiles.map((file, index) => (
          <img key={index} src={file.uri} />
        ))}

        {props.buttonJsx}
      </form>
    </div>
  );
};

export default ContentForm;
