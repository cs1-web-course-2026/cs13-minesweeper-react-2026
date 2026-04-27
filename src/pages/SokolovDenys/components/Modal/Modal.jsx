import React from 'react';
import styles from './Modal.module.css';

const Modal = ({ isOpen, title, message, onRestart }) => {
  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <h2 className={title === '💥' ? styles.statusLose : styles.statusWin}>
          {title}
        </h2>
        <p>{message}</p>
        <button className={styles.resetButton} onClick={onRestart}>
          Грати знову
        </button>
      </div>
    </div>
  );
};

export default Modal;