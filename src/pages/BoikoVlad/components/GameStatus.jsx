import styles from "../Minesweeper.module.css";

export default function GameStatus({ status }) {
  if (status === "win") {
    return <div className={styles.status}>You Win!</div>;
  }

  if (status === "lose") {
    return <div className={styles.status}>Game Over</div>;
  }

  return <div className={styles.status}></div>;
}