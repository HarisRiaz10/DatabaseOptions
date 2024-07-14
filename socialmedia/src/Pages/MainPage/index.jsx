// src/pages/MainPage.js
import React, { useEffect, useState } from 'react';
import PostList from '../../Components/postList';
import CreatePost from '../../Components/CreatePost';
import imageCompression from 'browser-image-compression';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from '../axiosConfig';
const MainPage = () => {

  const [posts, setPosts] = useState([]);
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const navigate = useNavigate()
  const state = useLocation().state
  console.log(state)
  const getPosts = () => {
    axios.get('/get_posts')
    .then((response) => {
      console.log(response);
        console.log(response)
        if(response.status == 200)
        {
          console.log(response.data)
         setPosts(response.data)
        }
    }, (error) => {
      console.log(error);
    });
  }
  useEffect(() => {
    getPosts()
  },[])
  const handleCreatePost = (post) => {
    const formData = new FormData();
formData.append('title', post.title);
formData.append('content', post.content);
formData.append('media', post.media)
formData.append('name', localStorage.getItem('name'));
axios.post('/create_post', formData, {
  headers: {
    'Content-Type': 'multipart/form-data',
  },
})
.then((response) => {
    if (response.status === 200) {
      
    }
})
.catch((error) => {
  setLoading(false);
  navigate('/');
  console.log(error);
})
.finally(() => {
  getPosts();
});
  }

  useEffect(() => { 
    console.log(posts)
  }, [posts]);

  const handleToggleCreatePost = () => {
    setShowCreatePost(!showCreatePost);
  };
  const onlogout = (e) => {
    e.preventDefault();
    localStorage.removeItem('token')
    localStorage.removeItem('name')
    navigate('/') 
  }

  return (
    <div className="container mx-auto p-4 relative min-h-screen">

      <span className='w-full flex justify-between align-center mb-10'>
      <>.</>
      <h1 className="text-3xl font-bold">Social Media Application</h1>
      <button
          onClick={onlogout}
          className="bg-white hover:border-[1px] hover:border-blue-700 rounded flex justify-center items-center px-2"
        >
          Log Out
        </button>
      </span>
      <div className='w-full flex justify-center align-center mb-10'>
  
        <button
          onClick={handleToggleCreatePost}
          className="bg-blue-500 text-white p-2 rounded flex justify-center"
        >
          {showCreatePost ? 'Close Form' : ' + Create a Post'}
        </button>
      </div>

      <PostList posts={posts} />

      {showCreatePost && (
        <div>
          <CreatePost username="Haris Riaz" onCreate={handleCreatePost} onClose={handleToggleCreatePost} />
        </div>
      )}
    </div>
  );
};

export default MainPage;
