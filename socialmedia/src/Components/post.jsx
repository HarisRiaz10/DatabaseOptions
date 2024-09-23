// src/components/Post.js
import React from 'react';

const Post = ({ post }) => {
  console.log(post)
  return (
    <div className="border-[2px] rounded-xl p-5 mb-4">
      <h2 className="text-xl font-bold">{post.title}</h2>
      <img src={post.media} alt="" />
      <p className="text-gray-700">{post.content}</p>
      <p className="text-gray-500 text-sm">Posted by {post['username']}</p>
      
    </div>
  );
};

export default Post;
