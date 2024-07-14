// src/components/PostList.js
import React from 'react';
import Post from './post';

const PostList = ({ posts }) => {
  return (
    <div>
      {posts.map((post, index) => (
        <Post key={index} post={post} />
      ))}
    </div>
  );
};

export default PostList;
