// utils/hooks/useClassName.js
import { useState, useEffect } from 'react';
import { BASE_URL } from '../../API/baseUrl';

export default function useClassName(classCode) {
  const [className, setClassName] = useState('');
  const [status, setStatus] = useState('');

  useEffect(() => {
    if (!classCode) return;

    const fetchClassName = async () => {
      try {
        setStatus('Loading class name...');
        const res = await fetch(
          `${BASE_URL}/api/schedule/object/classcode/${encodeURIComponent(classCode)}`
        );
        if (!res.ok) throw new Error('Failed');
        const data = await res.json();
        setClassName(data.name || 'Unnamed Class');
        setStatus('');
      } catch (err) {
        console.error(err);
        setClassName('');
        setStatus('Error loading class name');
      }
    };

    fetchClassName();
  }, [classCode]);

  return { className, status };
}
