import styles from '../Minesweeper.module.css'

function GameStatus({ message }) {
  return (
    <p role="status" aria-live="polite" className={styles.statusMessage}>
      {message}
    </p>
  )
}

export default GameStatus
