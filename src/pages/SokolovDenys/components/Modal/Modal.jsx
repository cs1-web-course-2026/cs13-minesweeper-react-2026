import React from 'react';
import { GAME_STATUS } from '../../utils/gameLogic';
import styles from './Modal.module.css';

const Modal = ({ isOpen, gameStatus, title, message, onRestart }) => {
  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <h2 className={gameStatus === GAME_STATUS.WON ? styles.statusWin : styles.statusLose}>
          {title}
        </h2>
        <p>{message}</p>
        <button type="button" className={styles.resetButton} onClick={onRestart}>
          Грати знову
        </button>
      </div>
    </div>
  );
};

export default Modal;