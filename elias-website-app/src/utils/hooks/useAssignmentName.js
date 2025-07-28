import { useState, useEffect } from 'react';
import { BASE_URL } from '../../API/baseUrl';

export default function useAssignmentName(assignmentCode) {
    const [assignmentName, setAssignmentName] = useState('');
    const [assignmentStatus, setAssignmentStatus] = useState('');

    useEffect(() => {
        if (!assignmentCode) return;

        const fetchAssignmentName = async () => {
            try {
                setAssignmentStatus('Loading assignment name...');
                const response = await fetch(
                    `${BASE_URL}/api/assignments/object/id/${encodeURIComponent(assignmentCode)}`
                );
                if (!response.ok) {
                    setAssignmentStatus('Failed to load assignment name');
                    setAssignmentName('');
                    return;
                }
                const data = await response.json();
                setAssignmentName(data.assignmentName || 'Untitled Assignment');
                setAssignmentStatus('');
            } catch (error) {
                console.error('Error fetching assignment name:', error);
                setAssignmentStatus('Error loading assignment name');
                setAssignmentName('');
            }
        };

        fetchAssignmentName();
    }, [assignmentCode]);

    return { assignmentName, assignmentStatus };
}
