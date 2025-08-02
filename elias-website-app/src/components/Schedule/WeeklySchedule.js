import React from 'react';

const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const WeeklySchedule = ({ schedule, setSelectedDay, weekStartDate }) => {
    const formatDate = (date) => {
        return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
    };
    console.log(schedule)
    const formatTime = (timeString) => {
        if (!timeString) return '';
        const [hours, minutes] = timeString.split(':');
        const hourNum = parseInt(hours, 10);
        const ampm = hourNum >= 12 ? 'PM' : 'AM';
        const displayHour = hourNum % 12 || 12;
        return `${displayHour}:${minutes} ${ampm}`;
    };

    const sortByStartTime = (classes) => {
        return [...classes].sort((a, b) => a.startTime.localeCompare(b.startTime));
    };

    return (
        <div className="schedule-grid">
            {days.map((day, index) => {
                const dateForDay = new Date(weekStartDate);
                dateForDay.setDate(weekStartDate.getDate() + index);

                const daySchedule = schedule.find(item => item.day === day) || { classes: [] };
                const sortedClasses = sortByStartTime(daySchedule.classes);

                return (
                    <div
                        key={day}
                        className={`schedule-day ${sortedClasses.length ? 'has-classes' : 'no-classes'}`}
                        onClick={() => setSelectedDay(day)}
                    >
                        <h4>
                            {day} <span className="date-label">({formatDate(dateForDay)})</span>
                        </h4>
                        {sortedClasses.length > 0 ? (
                            <>
                                <ul>
                                    {sortedClasses.slice(0, 2).map((cls, idx) => (
                                        <li key={idx}>
                                            <span className="class-name">{cls.name}</span>
                                            <span className="class-time">
                                                {formatTime(cls.startTime)} - {formatTime(cls.endTime)}
                                            </span>
                                        </li>
                                    ))}
                                    {sortedClasses.length > 2 && (
                                        <li className="more-classes">+{sortedClasses.length - 2} more</li>
                                    )}
                                </ul>
                            </>
                        ) : (
                            <p>No classes scheduled</p>
                        )}
                    </div>
                );
            })}

        </div>
    );
};

export default WeeklySchedule;
