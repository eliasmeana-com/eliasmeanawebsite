import { useState, useEffect } from 'react';
import {BASE_URL} from '../../API/baseUrl';

export default function useLatexDocument(routeInfo) {
    // routeInfo can be:
    // { type: 'classnotes', pageCode }
    // or { type: 'assignment', classCode, assignmentCode }

    const [latexScript, setLatexScript] = useState('');
    const [inputValue, setInputValue] = useState('');
    const [status, setStatus] = useState('');
    const [documentId, setDocumentId] = useState(null);
    const [editMode, setEditMode] = useState(false);
    const [docExists, setDocExists] = useState(true);
    // Helper to build URLs dynamically:
    const buildUrls = () => {
        if (routeInfo.type === 'classnotes' && routeInfo.pageCode) {
            const pc = encodeURIComponent(routeInfo.pageCode);
            return {
                fetchUrl: `{BASE_URL}/api/classnotes/object/pageCode/${pc}`,
                updateUrl: (id) => `{BASE_URL}/api/classnotes/object/update/${id}`,
                createUrl: `{BASE_URL}/api/classnotes/object/create/${pc}`,
            };
        }
        if (routeInfo.type === 'assignment' && routeInfo.classCode && routeInfo.assignmentCode) {
            // Replace these with your real assignment endpoints
            const cc = encodeURIComponent(routeInfo.classCode);
            const ac = encodeURIComponent(routeInfo.assignmentCode);
            return {
                fetchUrl: `{BASE_URL}/api/assignments/object/id/${ac}`,
                updateUrl: (id) => `{BASE_URL}/api/assignments/object/update/${id}`,
                createUrl: `{BASE_URL}/api/assignments/object/create/${cc}`,
            };
        }
        return {};
    };

    const { fetchUrl, updateUrl, createUrl } = buildUrls();

    useEffect(() => {
        if (!fetchUrl) {
            setStatus('Invalid route info.');
            return;
        }

        const fetchLatex = async () => {
            try {
                const response = await fetch(fetchUrl);

                if (response.status === 404) {
                    setStatus('Document does not exist yet.');
                    setDocExists(false);
                    setLatexScript('');
                    setInputValue('');
                    return;
                }

                if (!response.ok) throw new Error('Failed to fetch LaTeX document');

                const data = await response.json();
                setLatexScript(data.latexCode);
                setInputValue(data.latexCode);
                setDocumentId(data._id);
                setDocExists(true);
                setStatus('');
            } catch (error) {
                console.error('Failed to fetch LaTeX:', error);
                setLatexScript('Error loading LaTeX document.');
                setInputValue('');
                setStatus('Error loading document.');
            }
        };

        fetchLatex();
    }, [fetchUrl]);

    const saveLatex = async () => {
        setStatus('Saving...');

        try {
            let response;

            if (docExists && documentId) {
                response = await fetch(updateUrl(documentId), {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ latexCode: inputValue }),
                });
            } else {
                response = await fetch(createUrl, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ latexCode: inputValue }),
                });
            }

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to save LaTeX');
            }

            const result = await response.json();

            setStatus('Saved successfully!');
            setLatexScript(result.latexCode || inputValue);
            setEditMode(false);

            if (!docExists) {
                setDocExists(true);
                setDocumentId(result.document?._id ?? null);
            }
        } catch (error) {
            console.error(error);
            setStatus('Error saving LaTeX');
        }
    };

    return {
        latexScript,
        inputValue,
        setInputValue,
        status,
        editMode,
        setEditMode,
        saveLatex,
    };
}
