import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import BlogEditor from './BlogEditor';
import { BASE_URL } from '../../API/baseUrl';

export default function EditBlogPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await fetch(`${BASE_URL}/api/blogs/${id}`);
        const data = await res.json();
        setPost(data);
        setLoading(false);
      } catch (err) {
        console.error(err);
      }
    };
    fetchPost();
  }, [id]);

  if (loading) return <div className="loading-screen">Loading Post...</div>;

  return (
    <div className="edit-blog-page">
      <h2 style={{ textAlign: 'center' }}>Edit Post</h2>
      <BlogEditor 
        existingPost={post} 
        onSave={() => navigate(`/blog/${id}`)} 
      />
    </div>
  );
}