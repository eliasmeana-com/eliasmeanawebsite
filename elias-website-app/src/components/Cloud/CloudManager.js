import React, { useState, useEffect, useRef, useCallback } from 'react';
import { BASE_URL } from '../../API/baseUrl';
import '../../styles/Cloud.css';
import FileViewer from './FileViewer';

// --- ICONS ---
const FolderIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="icon-folder">
    <path d="M20 6h-8l-2-2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm0 12H4V8h16v10z"/>
  </svg>
);
const FileIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="icon-file">
    <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"/>
  </svg>
);
const TrashIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon-trash">
      <polyline points="3 6 5 6 21 6"></polyline>
      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
    </svg>
);
const DownloadIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon-download">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
      <polyline points="7 10 12 15 17 10"></polyline>
      <line x1="12" y1="15" x2="12" y2="3"></line>
    </svg>
);

export default function CloudManager() {
  const [files, setFiles] = useState([]);
  const [currentPath, setCurrentPath] = useState('root'); 
  const [dragActive, setDragActive] = useState(false);
  const [uploadName, setUploadName] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [tempName, setTempName] = useState('');
  
  // Progress State
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadingFile, setUploadingFile] = useState(null); 
  
  // Viewer State
  const [viewingFile, setViewingFile] = useState(null);

  const fileInputRef = useRef(null);
  const dragCounter = useRef(0);

  useEffect(() => {
    fetchFiles();
    const preventDefault = (e) => { e.preventDefault(); e.stopPropagation(); };
    window.addEventListener('dragover', preventDefault);
    window.addEventListener('drop', preventDefault);
    return () => {
        window.removeEventListener('dragover', preventDefault);
        window.removeEventListener('drop', preventDefault);
    };
  }, []);
 
  const fetchFiles = async () => {
    const token = localStorage.getItem('authToken');
    try {
      const res = await fetch(`${BASE_URL}/api/cloud/files`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setFiles(Array.isArray(data) ? data : []);
      }
    } catch (err) {
      console.error(err);
      setFiles([]);
    }
  };

  // --- API HELPERS ---
  const uploadFile = useCallback((fileObj, targetFolder = null) => {
      return new Promise((resolve, reject) => {
        const folderToUse = targetFolder || currentPath;
        const formData = new FormData();
        formData.append('folder', folderToUse);
        if (uploadName && !targetFolder) formData.append('customName', uploadName);
        formData.append('file', fileObj);

        setUploadingFile(fileObj.name);
        setUploadProgress(0);

        const token = localStorage.getItem('authToken');
        const xhr = new XMLHttpRequest();
        xhr.open('POST', `${BASE_URL}/api/cloud/upload`);
        xhr.setRequestHeader('Authorization', `Bearer ${token}`);

        xhr.upload.onprogress = (event) => {
            if (event.lengthComputable) {
                const percent = Math.round((event.loaded / event.total) * 100);
                setUploadProgress(percent);
            }
        };

        xhr.onload = () => {
            if (xhr.status === 201) {
                setUploadProgress(100);
                setTimeout(() => {
                    setUploadingFile(null); 
                    setUploadProgress(0);
                }, 1000);
                resolve(xhr.response);
            } else {
                setUploadingFile(null);
                reject(xhr.response);
            }
        };

        xhr.onerror = () => {
            setUploadingFile(null);
            reject(new Error("Network Error"));
        };

        xhr.send(formData);
      });
  }, [currentPath, uploadName]);

  const createFolderSilent = useCallback(async (fullPath) => {
    const blob = new Blob(["placeholder"], { type: "text/plain" });
    const dummyFile = new File([blob], ".keep", { type: "text/plain" });
    const formData = new FormData();
    formData.append('folder', fullPath);
    formData.append('file', dummyFile);
    const token = localStorage.getItem('authToken');
    try {
        await fetch(`${BASE_URL}/api/cloud/upload`, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${token}` },
            body: formData
        });
    } catch(err) { console.error("Folder creation failed", err); }
  }, []);

  const traverseFileTree = useCallback((item, path) => {
      const currentDir = path || "";
      if (item.isFile) {
          item.file(async (file) => {
              await uploadFile(file, currentDir);
              fetchFiles();
          });
      } else if (item.isDirectory) {
          const dirReader = item.createReader();
          const newPath = currentDir ? `${currentDir}/${item.name}` : item.name;
          createFolderSilent(newPath).then(() => {
              dirReader.readEntries((entries) => {
                  for (let i = 0; i < entries.length; i++) {
                      traverseFileTree(entries[i], newPath);
                  }
              });
          });
      }
  }, [uploadFile, createFolderSilent]);

  // --- ACTIONS ---
  const handleCreateFolder = async () => {
    const name = prompt("New folder name:");
    if (!name || name.includes('/')) return;
    const fullPath = `${currentPath}/${name}`;
    await createFolderSilent(fullPath);
    fetchFiles();
  };

  const handleMoveFile = async (fileId, targetFolder) => {
      const token = localStorage.getItem('authToken');
      try {
        await fetch(`${BASE_URL}/api/cloud/move/${fileId}`, {
            method: 'PUT',
            headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
            body: JSON.stringify({ folder: targetFolder })
        });
        fetchFiles();
      } catch (err) { console.error(err); }
  };

  const handleDelete = async (e, id) => {
    e.stopPropagation();
    if (!window.confirm("Delete this file?")) return;
    const token = localStorage.getItem('authToken');
    await fetch(`${BASE_URL}/api/cloud/delete/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    setFiles(prev => prev.filter(f => f._id !== id));
    if (viewingFile && viewingFile._id === id) setViewingFile(null); 
  };

  const handleDeleteFolder = async (e, folderName) => {
    e.stopPropagation();
    if (!window.confirm(`Delete folder "${folderName}" and ALL contents?`)) return;
    const fullFolderPath = `${currentPath}/${folderName}`;
    const token = localStorage.getItem('authToken');
    try {
        await fetch(`${BASE_URL}/api/cloud/folder`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
            body: JSON.stringify({ folderName: fullFolderPath })
        });
        fetchFiles();
    } catch (err) { console.error(err); }
  };

  const handleGlobalDrop = async (e) => {
    e.preventDefault(); e.stopPropagation();
    setDragActive(false); dragCounter.current = 0;
    const items = e.dataTransfer.items;
    if (items) {
        for (let i = 0; i < items.length; i++) {
            const item = items[i].webkitGetAsEntry ? items[i].webkitGetAsEntry() : null;
            if (item) {
                traverseFileTree(item, currentPath);
            } else {
                 const file = items[i].getAsFile();
                 if (file) { await uploadFile(file); fetchFiles(); }
            }
        }
    }
  };

  const onDropOnFolder = (e, folderName) => {
      e.preventDefault(); e.stopPropagation();
      setDragActive(false); dragCounter.current = 0;
      const internalId = e.dataTransfer.getData("fileId");
      const targetPath = `${currentPath}/${folderName}`;
      if (internalId) {
          handleMoveFile(internalId, targetPath);
      } else {
          const items = e.dataTransfer.items;
          if (items) {
            for (let i = 0; i < items.length; i++) {
                const item = items[i].webkitGetAsEntry ? items[i].webkitGetAsEntry() : null;
                if (item) traverseFileTree(item, targetPath);
            }
          }
      }
  };

  // --- VIEW LOGIC ---
  const handleFileClick = (file) => {
      // UPDATED: Now includes heic and mov
      const supported = /\.(jpg|jpeg|png|gif|pdf|mp4|webm|mov|heic|mp3|wav|txt|html|css|js)$/i.test(file.filename);
      if (supported) {
          setViewingFile(file);
      } else {
          window.open(`${BASE_URL}/api/cloud/file/${file.filename}`, '_blank');
      }
  };

  const visibleFolders = Array.from(new Set(
    files
      .filter(f => {
        const fFolder = f.metadata?.folder || 'root';
        return fFolder.startsWith(currentPath + '/');
      })
      .map(f => {
          const fFolder = f.metadata?.folder;
          const relative = fFolder.slice(currentPath.length + 1);
          return relative.split('/')[0];
      })
      .filter(Boolean)
  ));

  const filteredFiles = files.filter(f => {
    if (f.filename === '.keep') return false; 
    const fFolder = f.metadata?.folder || 'root';
    return fFolder === currentPath;
  });

  return (
    <div className="drive-container" 
        onDragEnter={(e) => { e.preventDefault(); dragCounter.current++; setDragActive(true); }} 
        onDragLeave={(e) => { e.preventDefault(); dragCounter.current--; if(dragCounter.current === 0) setDragActive(false); }} 
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleGlobalDrop}
    >
      {dragActive && (
        <div className="drive-drag-overlay">
            <div className="drag-content"><h3>Drop to upload</h3></div>
        </div>
      )}

      {viewingFile && (
          <FileViewer 
            file={viewingFile} 
            onClose={() => setViewingFile(null)} 
          />
      )}

      {uploadingFile && (
          <div className="upload-toast">
              <div className="toast-header">
                  <span>Uploading {uploadingFile}...</span>
                  <span>{uploadProgress}%</span>
              </div>
              <div className="progress-track">
                  <div className="progress-fill" style={{ width: `${uploadProgress}%` }}></div>
              </div>
          </div>
      )}

      <div className="drive-sidebar">
        <button className="drive-new-btn" onClick={() => fileInputRef.current.click()}>
          <span className="plus">+</span> New File
        </button>
        <button className="drive-new-btn secondary" onClick={handleCreateFolder}>
            <span className="plus">+</span> New Folder
        </button>
        <div className="drive-nav">
          <div className="nav-item active" onClick={() => setCurrentPath('root')}>My Cloud</div>
        </div>
        <div className="storage-info">
            <p>Storage Used</p>
            <div className="storage-bar"><div className="storage-fill"></div></div>
            <small>{(files.reduce((acc, f) => acc + f.length, 0) / 1024 / 1024).toFixed(2)} MB</small>
        </div>
      </div>

      <div className="drive-main">
        <div className="drive-toolbar">
            <div className="breadcrumbs">
                {currentPath.split('/').map((part, index) => (
                    <span key={index} className="bread-wrapper">
                        {index > 0 && <span className="separator"> › </span>}
                        <span 
                            className={`bread-link ${index === currentPath.split('/').length - 1 ? 'current' : ''}`}
                            onClick={() => {
                                const parts = currentPath.split('/');
                                setCurrentPath(parts.slice(0, index + 1).join('/'));
                            }}
                        >
                            {part === 'root' ? 'Home' : part}
                        </span>
                    </span>
                ))}
            </div>
            
            <div className="upload-controls">
                <input type="file" hidden ref={fileInputRef} onChange={(e) => {
                    if(e.target.files[0]) {
                        uploadFile(e.target.files[0]).then(fetchFiles);
                        setUploadName('');
                    }
                }} />
            </div>
        </div>

        <div className="drive-content-area">
            {currentPath !== 'root' && (
                <div className="drive-card folder back-btn-card" onClick={() => {
                     const parts = currentPath.split('/');
                     parts.pop();
                     setCurrentPath(parts.join('/'));
                }}>
                    <div className="card-icon">↩</div>
                    <div className="card-name">...</div>
                </div>
            )}

            {visibleFolders.length > 0 && (
                <>
                    <h4 className="section-title">Folders</h4>
                    <div className="drive-grid">
                        {visibleFolders.map(folderName => (
                            <div 
                                key={folderName} 
                                className="drive-card folder" 
                                onClick={() => setCurrentPath(`${currentPath}/${folderName}`)}
                                onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); }}
                                onDrop={(e) => onDropOnFolder(e, folderName)}
                            >
                                <div className="folder-left">
                                    <div className="card-icon"><FolderIcon /></div>
                                    <div className="card-name">{folderName}</div>
                                </div>
                                <button 
                                    className="folder-del-btn" 
                                    onClick={(e) => handleDeleteFolder(e, folderName)}
                                    title="Delete Folder"
                                >×</button>
                            </div>
                        ))}
                    </div>
                </>
            )}

            <h4 className="section-title">Files</h4>
            <div className="drive-grid">
                {filteredFiles.map(file => {
                    const isImage = file.filename.match(/\.(jpeg|jpg|gif|png|heic)$/i);
                    const fileUrl = `${BASE_URL}/api/cloud/file/${file.filename}`;
                    
                    return (
                        <div 
                            key={file._id} 
                            className="drive-card file"
                            draggable
                            onDragStart={(e) => e.dataTransfer.setData("fileId", file._id)}
                            onClick={() => handleFileClick(file)}
                        >
                            <div className="card-preview">
                                {isImage && !file.filename.toLowerCase().endsWith('.heic') ? (
                                    <img src={fileUrl} alt={file.filename} loading="lazy" />
                                ) : (
                                    <div className="generic-icon"><FileIcon /></div>
                                )}
                            </div>
                            
                            <div className="card-details">
                                <div className="card-header">
                                    {editingId === file._id ? (
                                        <input 
                                            autoFocus
                                            value={tempName}
                                            onChange={(e) => setTempName(e.target.value)}
                                            onBlur={async () => {
                                                if(!editingId) return;
                                                const token = localStorage.getItem('authToken');
                                                await fetch(`${BASE_URL}/api/cloud/rename/${editingId}`, {
                                                    method: 'PUT',
                                                    headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
                                                    body: JSON.stringify({ newName: tempName })
                                                });
                                                setEditingId(null); fetchFiles();
                                            }}
                                            onKeyDown={(e) => { if(e.key === 'Enter') e.target.blur(); }}
                                            onClick={(e) => e.stopPropagation()}
                                            className="rename-input"
                                        />
                                    ) : (
                                        <span className="filename" title={file.filename}>{file.filename}</span>
                                    )}
                                </div>
                                <div className="card-actions">
                                    <button onClick={(e) => { e.stopPropagation(); setEditingId(file._id); setTempName(file.filename); }}>✎</button>
                                    <a href={fileUrl} target="_blank" rel="noreferrer" onClick={(e) => e.stopPropagation()}><DownloadIcon /></a>
                                    <button onClick={(e) => handleDelete(e, file._id)} className="del-btn"><TrashIcon /></button>
                                </div>
                            </div>
                        </div>
                    );
                })}
                {filteredFiles.length === 0 && <p className="empty-msg">This folder is empty.</p>}
            </div>
        </div>
      </div>
      
      <div className="mobile-fab-container">
          <button className="fab-btn secondary" onClick={handleCreateFolder}>+ 📁</button>
          <button className="fab-btn primary" onClick={() => fileInputRef.current.click()}>+ 📄</button>
      </div>
    </div>
  );
}