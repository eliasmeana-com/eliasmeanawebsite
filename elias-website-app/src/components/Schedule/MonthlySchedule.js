import React from 'react';

const MonthlySchedule = ({ schedule, currentDate, setSelectedDay }) => {
    const getMonthDays = () => {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();

        const firstDayOfMonth = new Date(year, month, 1);
        const lastDayOfMonth = new Date(year, month + 1, 0);

        const days = [];

        // Number of empty cells before first day (assuming Sunday start)
        const emptyDaysBefore = firstDayOfMonth.getDay(); // 0=Sun, 1=Mon, ..., 6=Sat

        // Add nulls for empty days before month starts
        for (let i = 0; i < emptyDaysBefore; i++) {
            days.push(null);
        }

        // Add all actual days of the month
        for (let dayNum = 1; dayNum <= lastDayOfMonth.getDate(); dayNum++) {
            days.push(new Date(year, month, dayNum));
        }

        // Add nulls at end to make total divisible by 7 (full weeks)
        while (days.length % 7 !== 0) {
            days.push(null);
        }

        return days;
    };

    const formatTime = (timeString) => {
        if (!timeString) return '';
        const [h, m] = timeString.split(':');
        const hour = parseInt(h);
        const ampm = hour >= 12 ? 'PM' : 'AM';
        const hour12 = hour % 12 || 12;
        return `${hour12}:${m} ${ampm}`;
    };

    const sortByStartTime = (classes) => {
        return [...classes].sort((a, b) => a.startTime.localeCompare(b.startTime));
    };

    const monthDays = getMonthDays();

    return (
        <div className="month-grid">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, i) => (
                <div key={i} className="month-day-header">{day}</div>
            ))}
            {monthDays.map((day, i) => {
                const dateKey = day ? day.toISOString().split('T')[0] : null;
                const dayClasses = day ? schedule[dateKey] || [] : [];
                const sortedClasses = sortByStartTime(dayClasses);

                return (
                    <div
                        key={i}
                        className={`month-cell ${day ? '' : 'empty'}`}
                        onClick={() => day && setSelectedDay(dateKey)}
                        style={{ cursor: day ? 'pointer' : 'default' }}
                    >
                        {day && (
                            <>
                                <div className="day-number">{day.getDate()}</div>
                                <ul className="mini-class-list">
                                    {sortedClasses.slice(0, 2).map((cls, idx) => (
                                        <li key={idx} className="mini-class-item">
                                            <span className="mini-class-name">{cls.name}</span>
                                            <span className="mini-class-time">{formatTime(cls.startTime)}</span>
                                        </li>
                                    ))}
                                    {sortedClasses.length > 2 && (
                                        <li className="more-classes">+{sortedClasses.length - 2} more</li>
                                    )}
                                </ul>
                            </>
                        )}
                    </div>
                );
            })}
        </div>
    );
};

export default MonthlySchedule;
