import React from 'react';
import styles from './Scoreboard.module.css';

const Scoreboard = ({ timer, onReset, status, flagsLeft }) => {
  return (
    <header className={styles.gameHeader}>
      <div className={styles.statusItem}>🚩 {flagsLeft}</div>
      <button className={styles.resetButton} onClick={onReset}>
        {status === 'lost' ? '😵' : status === 'won' ? '😎' : 'Нова Гра'}
      </button>
      <div className={styles.statusItem}>⏱ {timer}</div>
    </header>
  );
};

export default Scoreboard;