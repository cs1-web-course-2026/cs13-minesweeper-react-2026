import styles from '../Minesweeper.module.css'

function Timer({ value }) {
  return (
    <div className={styles.counter} aria-label={`Time: ${value}`}>
      {value}
    </div>
  )
}

export default Timer
