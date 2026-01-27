import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom'; // Added useParams
import { BASE_URL } from '../../API/baseUrl';
import '../../styles/Blog.css';

export default function BlogList() {
  const { subject } = useParams(); // Detects 'politics', 'general', etc. from URL
  const [posts, setPosts] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    setIsLoggedIn(!!token);

    const fetchPosts = async () => {
      try {
        // If there is a subject in the URL, fetch by category. 
        // Otherwise, fetch ALL blogs.
        const url = subject 
          ? `${BASE_URL}/api/blogs/category/${subject}` 
          : `${BASE_URL}/api/blogs/all`;
          
        const res = await fetch(url);
        const data = await res.json();
        setPosts(data);
      } catch (err) {
        console.error("Fetch error:", err);
      }
    };
    fetchPosts();
  }, [subject]); // Re-fetch whenever the URL subject changes

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;
    const token = localStorage.getItem('authToken');
    try {
      const res = await fetch(`${BASE_URL}/api/blogs/delete/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        setPosts(posts.filter(post => post._id !== id));
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="blog-list-container">
      <div className="list-header">
        {/* Shows "POLITICS" or "JOURNAL" based on URL */}
        <h1>{subject ? subject.toUpperCase().replace('-', ' ') : 'Journal'}</h1>
        {isLoggedIn && (
          <Link to="/admin/create-blog" className="create-new-btn">
            + New Entry
          </Link>
        )}
      </div>

      <div className="blog-grid">
        {posts.length === 0 ? (
          <p>No posts found in this category.</p>
        ) : (
          posts.map(post => (
            <article key={post._id} className="blog-card">
              {post.coverImage && (
                <div className="card-image-wrapper">
                  <img src={post.coverImage} alt={post.title} className="card-img" />
                </div>
              )}
              <div className="blog-card-content">
                <h3>{post.title}</h3>
                <p>{post.summary}</p>
                
                <div className="blog-card-actions">
                  <Link to={`/blog/${post._id}`} className="read-more-btn">
                    Read More →
                  </Link>

                  {isLoggedIn && (
                    <div className="admin-controls">
                      <Link to={`/admin/edit/${post._id}`} className="edit-btn">
                        Edit
                      </Link>
                      <button onClick={() => handleDelete(post._id)} className="delete-btn">
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </article>
          ))
        )}
      </div>
    </div>
  );
}