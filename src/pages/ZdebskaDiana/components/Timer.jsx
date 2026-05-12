import styles from './Timer.module.css'

export default function Timer({ value }) {
  return (
    <div className={styles.infoBlock} aria-label="Таймер">
      <span className={styles.label}>Час</span>
      <div className={styles.value}>
        <span className={styles.icon} aria-hidden="true">
          ⏱
        </span>
        <span>{value}</span>
      </div>
    </div>
  )
}

