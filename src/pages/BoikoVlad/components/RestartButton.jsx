import styles from "../Minesweeper.module.css";

export default function RestartButton({ onRestart }) {
  return (
    <button
      type="button"
      className={styles.restart}
      aria-label="Restart game"
      onClick={onRestart}
    >
      😃
    </button>
  );
}