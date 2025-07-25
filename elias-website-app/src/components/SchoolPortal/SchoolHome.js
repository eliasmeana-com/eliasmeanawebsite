import React, { useEffect, useState, useMemo } from 'react';
import '../../styles/SchoolHome.css';

const fetchSchedule = async () => {
  const response = await fetch('https://eliasmeanawebsite.onrender.com/api/schedule/object/active');
  return await response.json();
};

function SchoolHome() {
  const [schedule, setSchedule] = useState([]);
  const [filterOngoing, setFilterOngoing] = useState(false);
  const [filterName, setFilterName] = useState('');
  const [filterCode, setFilterCode] = useState('');

  useEffect(() => {
    const loadSchedule = async () => {
      try {
        const data = await fetchSchedule();
        setSchedule(data);
      } catch (error) {
        console.error('Error fetching schedule:', error);
      }
    };

    loadSchedule();
  }, []);

  const isOngoing = (cls) => {
    if (!cls.start_date || !cls.end_date) return false;
    const today = new Date();
    const start = new Date(cls.start_date);
    const end = new Date(cls.end_date);
    return today >= start && today <= end;
  };

  const filteredSchedule = useMemo(() => {
    return schedule.filter((cls) => {
      if (filterOngoing && !isOngoing(cls)) {
        return false;
      }
      if (filterName && !cls.name.toLowerCase().includes(filterName.toLowerCase())) {
        return false;
      }
      if (filterCode && !cls.class_code.toLowerCase().includes(filterCode.toLowerCase())) {
        return false;
      }
      return true;
    });
  }, [schedule, filterOngoing, filterName, filterCode]);

  return (
    <div className="school-home">
      <h1>Active Classes</h1>

      <div className="filter-bar">
        <label>
          <input
            type="checkbox"
            checked={filterOngoing}
            onChange={() => setFilterOngoing(!filterOngoing)}
          />
          Ongoing Only
        </label>

        <input
          type="text"
          placeholder="Search by class name"
          value={filterName}
          onChange={(e) => setFilterName(e.target.value)}
        />

        <input
          type="text"
          placeholder="Search by class code"
          value={filterCode}
          onChange={(e) => setFilterCode(e.target.value)}
        />
      </div>

      {filteredSchedule.length === 0 ? (
        <p>No classes match the filters.</p>
      ) : (
        <div className="card-grid">
          {filteredSchedule.map((cls) => (
            <ClassCard key={cls._id} cls={cls} />
          ))}
        </div>
      )}
    </div>
  );
}

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

          {cls.course_page && (
            <p><strong>Course Page:</strong> <a href={cls.course_page} target="_blank" rel="noreferrer">{cls.course_page}</a></p>
          )}
          {cls.syllabus && (
            <p><strong>Syllabus:</strong> <a href={cls.syllabus} target="_blank" rel="noreferrer">{cls.syllabus}</a></p>
          )}

          <p>
            <strong>Class Notes:</strong>{' '}
            <a
              href={`/#/latexpage/${encodeURIComponent(cls.class_code)}`}
              target="_blank"
              rel="noreferrer"
            >
              Open
            </a>
          </p>

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

          {cls.textbooks?.length > 0 && (
            <div>
              <strong>Textbooks:</strong>
              <ul>
                {cls.textbooks.map((book, i) => <li key={i}>{book}</li>)}
              </ul>
            </div>
          )}

          {cls.assignments?.length > 0 && (
            <div>
              <strong>Assignments:</strong>
              <ul>
                {cls.assignments.map((a) => (
                  <li key={a._id}><a href={a.link} target="_blank" rel="noreferrer">{a.name}</a></li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default SchoolHome;
