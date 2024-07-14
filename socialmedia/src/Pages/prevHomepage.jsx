// src/pages/MainPage.js
import React, { useState } from 'react';
import PostList from '../Components/postList';
import CreatePost from '../Components/CreatePost';

const MainPage = () => {
  const [posts, setPosts] = useState([]);
  const [showCreatePost, setShowCreatePost] = useState(false);

  const handleCreatePost = (post) => {
    setPosts([post, ...posts]);
  };

  const handleToggleCreatePost = () => {
    setShowCreatePost(!showCreatePost);
  };

  return (
    <div className="container mx-auto p-4 relative min-h-screen">
      <h1 className="text-3xl font-bold mb-4">Social Media Application</h1>
      <PostList posts={posts} />
      
      {showCreatePost && <CreatePost username="Haris Riaz" onCreate={handleCreatePost} onClose={handleToggleCreatePost} />}
      
      <button
        onClick={handleToggleCreatePost}
        className="bg-blue-500 text-white p-2 rounded fixed bottom-4 left-1/2 transform -translate-x-1/2"
      >
        {showCreatePost ? 'Close Form' : 'Create a Post'}
      </button>
    </div>
  );
};

export default MainPage;
