import React from 'react';

const Timer = ({ seconds }) => {
  return <p aria-live="polite">Час: {seconds}с</p>;
};

export default Timer;