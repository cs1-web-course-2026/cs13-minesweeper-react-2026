import styles from '../Minesweeper.module.css'

function FlagCounter({ value }) {
  return (
    <div className={styles.counter} aria-label={`Flags remaining: ${value}`}>
      {value}
    </div>
  )
}

export default FlagCounter
