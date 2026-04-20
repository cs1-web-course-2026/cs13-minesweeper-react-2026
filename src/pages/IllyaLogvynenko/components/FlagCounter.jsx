import styles from '../Minesweeper.module.css';

function FlagCounter({ value }) {
  return <div className={styles.counter}>{value}</div>;
}

export default FlagCounter;
