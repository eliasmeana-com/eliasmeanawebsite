import React, { useState } from 'react';
import '../../../styles/SchoolHome.css';

function ClassCard({ cls }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className={`class-card ${expanded ? 'expanded' : ''}`}>
      <div className="card-header" onClick={() => setExpanded(!expanded)}>
        <h2>{cls.name}</h2>
        <span className="toggle-icon">{expanded ? '−' : '+'}</span>
      </div>

      {expanded && (
        <div className="card-details">
          <p><strong>Code:</strong> {cls.class_code}</p>
          <p><strong>Type:</strong> {cls.type}</p>
          <p><strong>Start:</strong> {cls.start_date}</p>
          <p><strong>End:</strong> {cls.end_date}</p>
          <p><strong>Professor:</strong> {cls.professor}</p>

          <ClassLink label="Course Page" url={cls.course_page} />
          <ClassLink label="Syllabus" url={cls.syllabus} />
          <ClassLink label="Class Notes" url={`/#/latexpage/classnotes/${encodeURIComponent(cls.class_code)}`} />
          {cls.assignments?.length > 0 && (
            <ClassLink label="Assignments" url={`/#/assignments/${encodeURIComponent(cls.class_code)}`} />
          )}

          {cls.timeslots?.length > 0 && (
            <div>
              <strong>Timeslots:</strong>
              <ul>
                {cls.timeslots.map((slot, i) => (
                  <li key={i}>
                    {slot.days} {slot.start_time}–{slot.end_time} ({slot.timezone}) — {slot.location}, {slot.campus}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {cls.textbooks?.length > 0 && (
            <div>
              <strong>Textbooks:</strong>
              <ul>
                {cls.textbooks.map((book, i) => <li key={i}>{book}</li>)}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function ClassLink({ label, url }) {
  if (!url) return null;
  return (
    <p>
      <a href={url} target="_blank" rel="noreferrer">{label}</a>
    </p>
  );
}

export default ClassCard;
