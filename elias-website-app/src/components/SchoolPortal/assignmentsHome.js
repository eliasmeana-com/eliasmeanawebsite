// AssignmentPage.js
import React, { useEffect, useState, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import '../../styles/AssignmentsPage.css';

function AssignmentPage() {
  const { classCode } = useParams();
  const [assignments, setAssignments] = useState([]);
  const [filterName, setFilterName] = useState('');
  const [filterDue, setFilterDue] = useState('');
  const [className, setClassName] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [newName, setNewName] = useState('');
  const [newDueDate, setNewDueDate] = useState('');

  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        const response = await fetch(
          `https://eliasmeanawebsite.onrender.com/api/assignments/object/classCode/${encodeURIComponent(classCode)}`
        );
        if (!response.ok) throw new Error('Failed to fetch assignments');
        const data = await response.json();
        setAssignments(data);
      } catch (err) {
        console.error('Error fetching assignments:', err);
      }
    };

    const fetchClassName = async () => {
      try {
        const response = await fetch(
          `https://eliasmeanawebsite.onrender.com/api/schedule/object/classcode/${encodeURIComponent(classCode)}`
        );
        if (!response.ok) throw new Error('Failed to fetch class info');
        const data = await response.json();
        setClassName(data.name);
      } catch (err) {
        console.error('Error fetching class name:', err);
      }
    };

    if (classCode) {
      fetchAssignments();
      fetchClassName();
    }
  }, [classCode]);

  const createAssignment = async () => {
    try {
      const response = await fetch(
        `https://eliasmeanawebsite.onrender.com/api/assignments/object/create/${encodeURIComponent(classCode)}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            latexCode: 'Enter your code here',
            assignmentName: newName,
            dueDate: newDueDate
          })
        }
      );

      if (!response.ok) throw new Error('Failed to create assignment');
      const result = await response.json();
      setAssignments((prev) => [...prev, result.document]);
      setShowModal(false);
      setNewName('');
      setNewDueDate('');
    } catch (err) {
      console.error('Error creating assignment:', err);
    }
  };

  const deleteAssignment = async (id) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this assignment?');
    if (!confirmDelete) return;

    try {
      const response = await fetch(
        `https://eliasmeanawebsite.onrender.com/api/assignments/object/delete/${id}`,
        { method: 'DELETE' }
      );
      if (!response.ok) throw new Error('Failed to delete assignment');

      setAssignments((prev) => prev.filter((a) => a._id !== id));
    } catch (err) {
      console.error('Error deleting assignment:', err);
      alert('Error deleting assignment.');
    }
  };

  const filteredAssignments = useMemo(() => {
    return assignments.filter((a) => {
      if (filterName && !a.assignmentName.toLowerCase().includes(filterName.toLowerCase())) return false;
      if (filterDue && !a.dueDate.includes(filterDue)) return false;
      return true;
    });
  }, [assignments, filterName, filterDue]);

  return (
    <div className="assignment-page">
      <h1>Assignments for {className || `class ${classCode}`}</h1>

      <button className="new-assignment-button" onClick={() => setShowModal(true)}>
        + New Assignment
      </button>

      <div className="filter-bar">
        <input
          type="text"
          placeholder="Search by assignment name"
          value={filterName}
          onChange={(e) => setFilterName(e.target.value)}
        />
        <input
          type="text"
          placeholder="Filter by due date (e.g. 2025-09-10)"
          value={filterDue}
          onChange={(e) => setFilterDue(e.target.value)}
        />
      </div>

      {filteredAssignments.length === 0 ? (
        <p>No assignments match the filters.</p>
      ) : (
        <div className="card-grid">
          {filteredAssignments.map((a) => (
            <AssignmentCard key={a._id} assignment={a} onDelete={deleteAssignment} />
          ))}
        </div>
      )}

      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>New Assignment</h2>
            <div className="modal-body">
              <label>
                Assignment Name
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="Assignment Name"
                />
              </label>
              <label>
                Due Date
                <input
                  type="text"
                  value={newDueDate}
                  onChange={(e) => setNewDueDate(e.target.value)}
                  placeholder="YYYY-MM-DD"
                />
              </label>
            </div>
            <div className="modal-buttons">
              <button className="save" onClick={createAssignment}>Save</button>
              <button className="cancel" onClick={() => setShowModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function AssignmentCard({ assignment, onDelete }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className={`assignment-card ${expanded ? 'expanded' : ''}`}>
      <div className="card-header" onClick={() => setExpanded(!expanded)}>
        <h2>{assignment.assignmentName}</h2>
        <span className="toggle-icon">{expanded ? '−' : '+'}</span>
      </div>

      {expanded && (
        <div className="card-details">
          <p><strong>Due Date:</strong> {assignment.dueDate}</p>
          <p><strong>Class Code:</strong> {assignment.classCode}</p>
          <p>
            <a
              href={`/#/assignment/${assignment.classCode}/${assignment._id}`}
              target="_blank"
              rel="noreferrer"
            >
              Open LaTeX Page
            </a>
          </p>
          <button
            className="delete-assignment-button"
            onClick={() => onDelete(assignment._id)}
          >
            Delete Assignment
          </button>
        </div>
      )}
    </div>
  );
}

export default AssignmentPage;
