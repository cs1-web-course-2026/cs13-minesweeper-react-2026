import styles from '../Minesweeper.module.css';

function GameStatus({ message }) {
  return <div className={styles.statusMessage}>{message}</div>;
}

export default GameStatus;
