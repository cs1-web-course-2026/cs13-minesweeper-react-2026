import styles from '../Minesweeper.module.css';

function RestartButton({ face, onClick }) {
  return (
    <button
      type="button"
      className={styles.startButton}
      aria-label="Start new game"
      onClick={onClick}
    >
      {face}
    </button>
  );
}

export default RestartButton;
