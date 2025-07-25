const dayMap = { S: 0, M: 1, T: 2, W: 3, R: 4, F: 5, A: 6 };
const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export const formatWeekSchedule = (classData) => {
  const scheduleByDay = {};

  classData.forEach((classItem) => {
    classItem.timeslots.forEach((slot) => {
      slot.days.split('').forEach((letter) => {
        const dayIndex = dayMap[letter];
        const day = daysOfWeek[dayIndex];
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

  daysOfWeek.forEach((day) => {
    if (!scheduleByDay[day]) scheduleByDay[day] = { day, classes: [] };
  });

  return daysOfWeek.map((day) => scheduleByDay[day]);
};

export const formatMonthSchedule = (classData, start, end) => {
  const scheduleByDate = {};
  for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
    const dateKey = new Date(d).toISOString().split('T')[0];
    scheduleByDate[dateKey] = [];
  }

  classData.forEach((classItem) => {
    classItem.timeslots.forEach((slot) => {
      const validDays = slot.days.split('').map((l) => dayMap[l]);

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
