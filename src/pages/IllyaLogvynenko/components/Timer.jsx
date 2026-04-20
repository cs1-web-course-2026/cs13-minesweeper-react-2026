import styles from '../Minesweeper.module.css';

function Timer({ value }) {
  return <div className={styles.counter}>{value}</div>;
}

export default Timer;
