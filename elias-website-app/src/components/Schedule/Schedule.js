import React, { useState, useEffect } from 'react';
import WeeklySchedule from './WeeklySchedule';
import MonthlySchedule from './MonthlySchedule';
import '../../styles/Schedule.css';

const getMonthViewRange = (date) => {
  const year = date.getFullYear();
  const month = date.getMonth();

  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);

  const start = new Date(firstDay);
  start.setDate(firstDay.getDate() - firstDay.getDay());

  const end = new Date(lastDay);
  end.setDate(lastDay.getDate() + (6 - lastDay.getDay()));

  return { start, end };
};

const fetchSchedule = async (targetDate, view) => {
  let start, end;

  if (view === 'week') {
    start = new Date(targetDate);
    start.setDate(start.getDate() - start.getDay());
    end = new Date(start);
    end.setDate(end.getDate() + 6);
  } else if (view === 'month') {
    ({ start, end } = getMonthViewRange(targetDate));
  }

  const startStr = start.toISOString().split('T')[0];
  const endStr = end.toISOString().split('T')[0];

  const response = await fetch(
    `https://eliasmeanawebsite.onrender.com/api/schedule/object/daterange?start=${startStr}&end=${endStr}`
  );
  const classData = await response.json();

  if (view === 'week') {
    const scheduleByDay = {};
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    classData.forEach((classItem) => {
      classItem.timeslots.forEach((slot) => {
        const dayLetters = slot.days.split('');
        dayLetters.forEach((letter) => {
          const dayMap = { S: 0, M: 1, T: 2, W: 3, R: 4, F: 5, A: 6 };
          const dayIndex = dayMap[letter];
          const day = days[dayIndex];
          if (!scheduleByDay[day]) scheduleByDay[day] = { day, classes: [] };

          scheduleByDay[day].classes.push({
            name: classItem.name,
            startTime: slot.start_time,
            endTime: slot.end_time,
            location: slot.location || '',
            campus: slot.campus || '',
            instructor: classItem.professor || '',
            description: '',
            courseHomePage: classItem.course_page || '',
          });
        });
      });
    });

    days.forEach((day) => {
      if (!scheduleByDay[day]) scheduleByDay[day] = { day, classes: [] };
    });

    return days.map((day) => scheduleByDay[day]);
  }

  // Month view
  const scheduleByDate = {};
  for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
    const dateKey = d.toISOString().split('T')[0];
    scheduleByDate[dateKey] = [];
  }

  classData.forEach((classItem) => {
    classItem.timeslots.forEach((slot) => {
      const dayLetters = slot.days.split('');
      const dayMap = { S: 0, M: 1, T: 2, W: 3, R: 4, F: 5, A: 6 };
      const validDays = dayLetters.map((l) => dayMap[l]);

      for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
        if (validDays.includes(d.getDay())) {
          const dateKey = new Date(d).toISOString().split('T')[0];
          scheduleByDate[dateKey].push({
            name: classItem.type,
            startTime: slot.start_time,
            endTime: slot.end_time,
            location: slot.location || 'TBD',
            campus: '',
            instructor: classItem.professor || 'TBD',
            description: '',
            courseHomePage: classItem.course_page || '',
          });
        }
      }
    });
  });

  return scheduleByDate;
};

const Schedule = () => {
  const [schedule, setSchedule] = useState([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState('week');
  const [selectedDay, setSelectedDay] = useState(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      if (view === 'week') setSchedule([]);
      else if (view === 'month') setSchedule({});

      const data = await fetchSchedule(currentDate, view);
      setSchedule(data);
      setLoading(false);
      setSelectedDay(null);
    };
    load();
  }, [currentDate, view]);

  const handleDateChange = (e) => {
    setCurrentDate(new Date(e.target.value));
  };

  const formatTime = (timeString) => {
    if (!timeString) return '';
    const [hours, minutes] = timeString.split(':');
    const hourNum = parseInt(hours, 10);
    const ampm = hourNum >= 12 ? 'PM' : 'AM';
    const displayHour = hourNum % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const renderModal = () => {
    if (!selectedDay) return null;

    let dayClasses = [];

    if (view === 'week') {
      const dayObj = schedule.find((item) => item.day === selectedDay);
      dayClasses = dayObj ? dayObj.classes : [];
    } else if (view === 'month') {
      dayClasses = schedule[selectedDay] || [];
    }

    return (
      <div className="day-modal" onClick={() => setSelectedDay(null)}>
        <div className="day-modal-content" onClick={(e) => e.stopPropagation()}>
          <button className="close-btn" onClick={() => setSelectedDay(null)}>
            X
          </button>
          <h3>{selectedDay}</h3>
          {dayClasses.length ? (
            <ul className="class-list">
              {dayClasses.map((cls, idx) => (
                <li key={idx} className="class-item">
                  <div className="class-header">
                    <span className="class-time">
                      {formatTime(cls.startTime)} - {formatTime(cls.endTime)}
                    </span>
                    <span className="class-location">{cls.location}</span>
                    <span className="class-location">{cls.campus}</span>
                  </div>
                  <h4 className="class-name">{cls.name}</h4>
                  <p className="class-instructor">Instructor: {cls.instructor}</p>
                  {cls.description && <p className="class-description">{cls.description}</p>}
                  {cls.courseHomePage && (
                    <p className="class-description">
                      <a href={cls.courseHomePage} target="_blank" rel="noopener noreferrer">
                        Website
                      </a>
                    </p>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <p>No classes scheduled for this day</p>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="schedule-container">
      <div className="schedule-header">
        <h2>Class Schedule</h2>
        <div className="schedule-controls">
          <select onChange={(e) => setView(e.target.value)} value={view}>
            <option value="week">Week View</option>
            <option value="month">Month View</option>
          </select>
          <input
            type="date"
            value={currentDate.toISOString().split('T')[0]}
            onChange={handleDateChange}
          />
        </div>
      </div>

      {loading ? (
        <div className="loading-container">Loading schedule...</div>
      ) : view === 'week' ? (
        <WeeklySchedule schedule={schedule} setSelectedDay={setSelectedDay} />
      ) : (
        <MonthlySchedule schedule={schedule} currentDate={currentDate} setSelectedDay={setSelectedDay} />
      )}

      {renderModal()}
    </div>
  );
};

export default Schedule;
