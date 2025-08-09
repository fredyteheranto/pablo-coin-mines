import React, { useState, useEffect } from "react";

function CountdownTimerLock({ targetUnix }) {
  const [countdown, setCountdown] = useState({});

  useEffect(() => {
    const targetDate = new Date(targetUnix * 1000);
    targetDate.setDate(targetDate.getDate() + 21); // Sumar 21 días

    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [targetUnix]);

  const updateCountdown = () => {
    const now = new Date().getTime();
    const endDate = new Date(targetUnix * 1000);
    endDate.setDate(endDate.getDate()); // Sumar 21 días
    const startDate = new Date(now);

    const timeRemaining = endDate - startDate;

    if (timeRemaining <= 0) {
      setCountdown({ days: 0, hours: 0, minutes: 0, seconds: 0 });
    } else {
      const days = Math.floor(timeRemaining / (1000 * 60 * 60 * 24));
      const hours = Math.floor((timeRemaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((timeRemaining % (1000 * 60)) / 1000);

      setCountdown({ days, hours, minutes, seconds });
    }
  };

  return (
    <div>
      <p>
        {countdown.days} D, {countdown.hours} H, {countdown.minutes} M, {countdown.seconds} S
      </p>
    </div>
  );
}

export default CountdownTimerLock;
