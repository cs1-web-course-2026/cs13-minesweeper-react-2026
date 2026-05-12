import React from 'react';
import styles from './Minesweeper.module.css';

const GameStatus = ({ text, kind }) => {
  if (!text) return null;
  return <p role="status" className={styles[kind]}>{text}</p>;
};

export default GameStatus;