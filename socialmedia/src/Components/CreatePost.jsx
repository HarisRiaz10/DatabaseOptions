// src/components/CreatePost.js
// import React, { useState } from 'react';

// const CreatePost = ({ onCreate, onClose }) => {
//   const [title, setTitle] = useState('');
//   const [content, setContent] = useState('');
//   const [author, setAuthor] = useState('');

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     onCreate({ title, content, author });
//     setTitle('');
//     setContent('');
//     setAuthor('');
//     onClose(); // Close the form after submission
//   };

//   return (
//     <div className="border rounded p-4 mb-4 fixed bottom-12 left-1/2 transform -translate-x-1/2">
//       <h2 className="text-xl font-bold mb-4">Create a New Post</h2>
//       <form onSubmit={handleSubmit}>
//         <input
//           type="text"
//           placeholder="Title"
//           value={title}
//           onChange={(e) => setTitle(e.target.value)}
//           className="border p-2 mb-2 w-full"
//         />
//         <textarea
//           placeholder="Content"
//           value={content}
//           onChange={(e) => setContent(e.target.value)}
//           className="border p-2 mb-2 w-full"
//         />
//         <input
//           type="text"
//           placeholder="Author"
//           value={author}
//           onChange={(e) => setAuthor(e.target.value)}
//           className="border p-2 mb-2 w-full"
//         />
//         <button type="submit" className="bg-blue-500 text-white p-2 rounded mr-2">
//           Submit
//         </button>
//         <button type="button" onClick={onClose} className="bg-gray-500 text-white p-2 rounded">
//           Cancel
//         </button>
//       </form>
//     </div>
//   );
// };

// export default CreatePost;


//src/Components/CreatePost.js
import React, { useState } from 'react';
import imageCompression from 'browser-image-compression';
// { username, onCreate, onClose }
const CreatePost = ({ username, onCreate, onClose }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');


//   const handleSubmit = (e) => {
//     e.preventDefault();
//     onCreate({ title, content, author });
//     setTitle('');
//     setContent('');
//     setAuthor('');
//     onClose(); // Close the form after submission
//   };
  const [selectedFile, setSelectedFile] = useState(null);

  const handleContentChange = (e) => {
    setContent(e.target.value);
  };

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      try {
        const compressedFile = await compressFile(file);
        setSelectedFile(file);
        console.log('File compressed and selected:', compressedFile);
      } catch (error) {
        console.error('Error compressing file:', error);
      }
    }
  };

  const compressFile = async (file) => {
    const options = {
      maxSizeMB: 0.4,
      maxWidthOrHeight: 1920,
      useWebWorker: true,
    };
    try {
      const compressedFile = await imageCompression(file, options);
      return compressedFile;
    } catch (error) {
      console.error('Error during compression:', error);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const post = {
      title,
      content,
      username,
      ...(selectedFile && { media: selectedFile }),
    };
    onCreate(post);
    setTitle('');
    setContent('');
    onClose();
  };

  return (
    <div className=" p-4 rounded shadow-md fixed inset-0 bg-black opacity-50 flex justify-center items-center">
      <div className="border rounded top-0 left-0 right-0 bottom-0 bg-white p-4">  
      <form onSubmit={handleSubmit}>
        <p>{localStorage.getItem('name')}</p>
        <input
          type="text"
          placeholder="Title"
          onChange={(e) => setTitle(e.target.value)}
          className="border p-2 mb-2 w-full"
        />
        <textarea
          value={content}
          onChange={handleContentChange}
          placeholder="Write something..."
          className="w-full p-2 mb-4 border rounded"
        />

        <input type="file" accept="image/*" onChange={handleFileChange} className="mb-4" />
        {selectedFile && <p>File ready to upload: {selectedFile.name}</p>}

        <div className="flex justify-end">
          <button type="button" onClick={onClose} className="bg-gray-500 text-white p-2 rounded mr-2">
            Cancel
          </button>
          <button type="submit" className="bg-blue-500 text-white p-2 rounded">
            Create Post
          </button>
        </div>
      </form>
      </div>
   
    </div>
  );
};

export default CreatePost;
