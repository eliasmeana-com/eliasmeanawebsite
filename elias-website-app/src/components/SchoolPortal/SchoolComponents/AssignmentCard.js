import React, { useState } from 'react';
// import { Link } from 'react-router-dom';
import '../../../styles/AssignmentsPage.css';

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

export default AssignmentCard;
