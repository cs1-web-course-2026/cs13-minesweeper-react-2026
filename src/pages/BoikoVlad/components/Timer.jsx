import styles from "../Minesweeper.module.css";

export default function Timer({ time }) {
  return <div className={styles.timer}>{time}</div>;
}