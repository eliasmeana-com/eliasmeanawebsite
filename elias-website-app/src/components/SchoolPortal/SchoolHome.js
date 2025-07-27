import React, { useEffect, useState, useMemo } from 'react';
import '../../styles/SchoolHome.css';
import {BASE_URL} from '../../API/baseUrl'
import ClassCard from './SchoolComponents/ClassCard';

const fetchSchedule = async () => {
  console.log(BASE_URL)
  const response = await fetch(`${BASE_URL}/api/schedule/object/active`);
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
      if (filterOngoing && !isOngoing(cls)) return false;
      if (filterName && !cls.name.toLowerCase().includes(filterName.toLowerCase())) return false;
      if (filterCode && !cls.class_code.toLowerCase().includes(filterCode.toLowerCase())) return false;
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

export default SchoolHome;
