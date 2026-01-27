import React, { useState, useMemo, useRef } from 'react';
import ReactQuill, { Quill } from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import ImageResize from 'quill-image-resize-module-react';
import '../../styles/Blog.css';
import { uploadToCloudinary } from '../../API/cloudinary.js';
import { BASE_URL } from '../../API/baseUrl.js';

window.Quill = Quill;
Quill.register('modules/imageResize', ImageResize);

const AlignStyle = Quill.import('attributors/style/align');
const BackgroundStyle = Quill.import('attributors/style/background');
const ColorStyle = Quill.import('attributors/style/color');
const FontStyle = Quill.import('attributors/style/font');
const SizeStyle = Quill.import('attributors/style/size');

Quill.register(AlignStyle, true);
Quill.register(BackgroundStyle, true);
Quill.register(ColorStyle, true);
Quill.register(FontStyle, true);
Quill.register(SizeStyle, true);

export default function BlogEditor({ onSave, existingPost }) {
  const [title, setTitle] = useState(existingPost?.title || '');
  const [summary, setSummary] = useState(existingPost?.summary || '');
  const [content, setContent] = useState(existingPost?.content || '');
  const [category, setCategory] = useState(existingPost?.category || 'general'); // New State
  const [coverImage, setCoverImage] = useState(existingPost?.coverImage || '');
  const [isCodeView, setIsCodeView] = useState(false);
  const [status, setStatus] = useState({ type: '', message: '' });
  const quillRef = useRef(null);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => setContent(event.target.result);
    reader.readAsText(file);
  };

  const handleCoverImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    setStatus({ type: 'loading', message: 'Uploading cover photo...' });
    try {
      const url = await uploadToCloudinary(file);
      setCoverImage(url);
      setStatus({ type: 'success', message: 'Cover photo uploaded!' });
    } catch (error) {
      setStatus({ type: 'error', message: 'Cover upload failed.' });
    }
  };

  const imageHandler = () => {
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.setAttribute('accept', 'image/*');
    input.click();
    input.onchange = async () => {
      const file = input.files[0];
      if (file) {
        setStatus({ type: 'loading', message: 'Uploading image...' });
        try {
          const url = await uploadToCloudinary(file);
          const quill = quillRef.current.getEditor();
          const range = quill.getSelection();
          quill.insertEmbed(range.index, 'image', url);
          setStatus({ type: 'success', message: 'Image uploaded!' });
        } catch (error) {
          setStatus({ type: 'error', message: 'Image upload failed.' });
        }
      }
    };
  };

  const modules = useMemo(() => ({
    toolbar: {
      container: [
        [{ 'font': [] }, { 'size': [] }],
        ['bold', 'italic', 'underline', 'strike'],
        [{ 'color': [] }, { 'background': [] }],
        [{ 'header': '1' }, { 'header': '2' }, 'blockquote', 'code-block'],
        [{ 'list': 'ordered' }, { 'list': 'bullet' }, { 'indent': '-1' }, { 'indent': '+1' }],
        [{ 'align': [] }],
        ['link', 'image', 'video'],
        ['clean']
      ],
      handlers: { image: imageHandler },
    },
    imageResize: {
      parchment: Quill.import('parchment'),
      modules: ['Resize', 'DisplaySize']
    }
  }), []);

  const formats = [
    'header', 'font', 'size',
    'bold', 'italic', 'underline', 'strike', 'blockquote',
    'list', 'bullet', 'indent', 'align',
    'link', 'image', 'video', 'color', 'background', 'code-block',
    'width', 'height'
  ];

  const handleSubmit = async () => {
    if (!title || !content) {
      setStatus({ type: 'error', message: 'Title and Content are required.' });
      return;
    }
    setStatus({ type: 'loading', message: 'Saving...' });
    // Added category to postData
    const postData = { title, summary, content, coverImage, category }; 
    const token = localStorage.getItem('authToken');
    const url = existingPost 
      ? `${BASE_URL}/api/blogs/update/${existingPost._id}` 
      : `${BASE_URL}/api/blogs/create`;
    const method = existingPost ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(postData)
      });
      if (res.ok) {
        setStatus({ type: 'success', message: 'Saved successfully!' });
        if (onSave) onSave();
      } else {
        const errData = await res.json();
        throw new Error(errData.error || 'Failed to save');
      }
    } catch (error) {
      setStatus({ type: 'error', message: error.message });
    }
  };

  return (
    <div className="blog-editor-container">
      {status.message && (
        <div className={`status-message ${status.type}`}>
          {status.message}
        </div>
      )}

      <input type="text" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
      
      {/* Category Dropdown */}
      <select 
        value={category} 
        onChange={(e) => setCategory(e.target.value)}
        className="category-select"
        style={{ width: '100%', padding: '14px', marginBottom: '12px', borderRadius: '8px', border: '1px solid var(--border)' }}
      >
        <option value="general">General</option>
        <option value="politics">Politics</option>
        <option value="current-events">Current Events</option>
        <option value="math">Math</option>
      </select>

      <input type="text" placeholder="Summary" value={summary} onChange={(e) => setSummary(e.target.value)} />
      
      <div className="cover-upload-wrapper" style={{ margin: '20px 0', padding: '20px', border: '1px solid var(--border)', borderRadius: '12px' }}>
        <label style={{ display: 'block', marginBottom: '10px', fontWeight: '600' }}>Cover Photo</label>
        <input type="file" accept="image/*" onChange={handleCoverImageUpload} />
        {coverImage && (
          <div style={{ marginTop: '15px' }}>
            <img src={coverImage} alt="Preview" style={{ width: '200px', borderRadius: '8px', border: '1px solid var(--border)' }} />
            <button 
                onClick={() => setCoverImage('')} 
                style={{ display: 'block', color: 'var(--error)', background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.8rem', padding: '5px 0' }}
            >
                Remove Photo
            </button>
          </div>
        )}
      </div>

      <div className="editor-controls">
        <label>Import Template: </label>
        <input type="file" accept=".html" onChange={handleFileUpload} />
        <button type="button" onClick={() => setIsCodeView(!isCodeView)} className="toggle-code-btn">
            {isCodeView ? 'Visual Editor' : 'HTML Code'}
        </button>
      </div>

      {isCodeView ? (
        <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="raw-html-area"
        />
      ) : (
        <ReactQuill 
          ref={quillRef} 
          theme="snow" 
          value={content} 
          onChange={setContent} 
          modules={modules}
          formats={formats}
        />
      )}

      <button onClick={handleSubmit} className="save-btn" disabled={status.type === 'loading'} style={{ marginTop: '20px' }}>
        {status.type === 'loading' ? 'Saving...' : 'Publish / Update Blog'}
      </button>
    </div>
  );
}