import React, { useEffect, useState } from 'react';

const fetchSchedule = async (targetDate,startStr,endStr) => {

  const response = await fetch(
    `https://eliasmeanawebsite.onrender.com/api/schedule/object/active`
  );
  const classData = await response.json();

  return classData;
};

function SchoolHome() {
  const [schedule, setSchedule] = useState(null);

  useEffect(() => {
    const loadSchedule = async () => {
      try {
        const data = await fetchSchedule(new Date(), 'week'); // Pass required args
        console.log(data);
        setSchedule(data);
      } catch (error) {
        console.error('Error fetching schedule:', error);
      }
    };

    loadSchedule();
  }, []);

  return (
    <div className="home">
      <h1>Hi, I'm Elias</h1>
    </div>
  );
}

export default SchoolHome;
