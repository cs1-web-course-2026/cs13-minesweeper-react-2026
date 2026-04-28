import styles from './GameStatus.module.css'

const LABELS = {
  playing: 'Граєте',
  won: 'Перемога',
  lost: 'Програш',
}

export default function GameStatus({ gameStatus }) {
  return (
    <div className={styles.wrap}>
      <span className={styles.label}>Статус</span>
      <span className={`${styles.value} ${styles[gameStatus] ?? ''}`}>
        {LABELS[gameStatus] ?? gameStatus}
      </span>
    </div>
  )
}
