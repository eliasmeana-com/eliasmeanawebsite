import React from 'react';
import DOMPurify from 'dompurify';
import 'react-quill/dist/quill.snow.css';

export default function BlogPostViewer({ post }) {
  const cleanHTML = DOMPurify.sanitize(post.content, {
    FORCE_BODY: true,
    ADD_TAGS: ['style', 'img', 'iframe', 'video', 'h1', 'h2', 'h3', 'p', 'div', 'span', 'ul', 'li'],
    ADD_ATTR: ['src', 'style', 'class', 'allow', 'allowfullscreen', 'frameborder', 'scrolling', 'width', 'height']
  });

  return (
    <div className="blog-container">
      <h1 className="viewer-title">{post.title}</h1>
      {post.coverImage && <img src={post.coverImage} className="viewer-cover" alt="Cover" />}
      <div className="ql-snow">
        <div 
          className="blog-content-display ql-editor"
          dangerouslySetInnerHTML={{ __html: cleanHTML }} 
        />
      </div>
    </div>
  );
}