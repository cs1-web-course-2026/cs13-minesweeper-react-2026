import React from 'react';
import styles from './Scoreboard.module.css';

const GAME_STATUS = {
  LOST: 'lost',
  WON: 'won',
};
const Scoreboard = ({ timer, onReset, status, flagsLeft }) => {
  const resetButtonLabel =
    status === GAME_STATUS.LOST
      ? '😵'
      : status === GAME_STATUS.WON
        ? '😎'
        : 'Нова Гра';
  const resetButtonAriaLabel =
    status === GAME_STATUS.LOST
      ? 'Почати нову гру після програшу'
      : status === GAME_STATUS.WON
        ? 'Почати нову гру після перемоги'
        : 'Почати нову гру';
  return (
    <header className={styles.gameHeader}>
      <div className={styles.statusItem}>🚩 {flagsLeft}</div>
      <button
        type="button"
        className={styles.resetButton}
        onClick={onReset}
        aria-label={resetButtonAriaLabel}
      >
        {resetButtonLabel}
      </button>
      <div className={styles.statusItem}>⏱ {timer}</div>
    </header>
  );
};

export default Scoreboard;