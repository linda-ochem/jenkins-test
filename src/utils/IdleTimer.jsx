import React, { useState, useEffect } from "react";

const IdleTimeout = ({ timeout, warningTime, onTimeout }) => {
  const [idleTime, setIdleTime] = useState(0);
  const [showWarning, setShowWarning] = useState(false);

  const resetIdleTime = () => {
    setIdleTime(0);
    setShowWarning(false);
  };

  const handleUserActivity = () => {
    resetIdleTime();
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setIdleTime(idleTime + 1000);

      if (idleTime + 1000 === warningTime) {
        setShowWarning(true);
      }

      if (idleTime + 1000 === timeout) {
        onTimeout();
      }
    }, 1000);

    return () => clearTimeout(timeoutId);
  }, [idleTime, timeout, warningTime, onTimeout]);

  useEffect(() => {
    resetIdleTime();
    window.addEventListener("mousemove", handleUserActivity);
    window.addEventListener("keydown", handleUserActivity);

    return () => {
      window.removeEventListener("mousemove", handleUserActivity);
      window.removeEventListener("keydown", handleUserActivity);
    };
  }, []);

  useEffect(() => {
    if (showWarning) {
      alert(
        "Warning: You have been inactive for a while and will be logged out soon."
      );
    }
  }, []);

  return (
    <div>
      <div className="sr-only">Idle Time: {idleTime} milliseconds</div>
    </div>
  );
};

export default IdleTimeout;
