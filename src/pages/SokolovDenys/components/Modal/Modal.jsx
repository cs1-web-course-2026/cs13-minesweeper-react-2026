import React from 'react';
import { GAME_STATUS } from '../../utils/gameLogic';
import styles from './Modal.module.css';

const MODAL_TITLE_ID = 'game-modal-title';
const MODAL_DESCRIPTION_ID = 'game-modal-description';
const Modal = ({ isOpen, gameStatus, title, message, onRestart }) => {
  if (!isOpen) return null;
  return (
    <div className={styles.modalOverlay}>
      <div
        className={styles.modalContent}
        role="dialog"
        aria-modal="true"
        aria-labelledby={MODAL_TITLE_ID}
        aria-describedby={MODAL_DESCRIPTION_ID}
      >
        <h2
          id={MODAL_TITLE_ID}
          className={gameStatus === GAME_STATUS.WON ? styles.statusWin : styles.statusLose}
        >
          {title}
        </h2>
        <p id={MODAL_DESCRIPTION_ID}>{message}</p>
        <button type="button" className={styles.resetButton} onClick={onRestart}>
          Грати знову
        </button>
      </div>
    </div>
  );
};

export default Modal;