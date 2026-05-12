import styles from './MineCounter.module.css'

export default function MineCounter({ value }) {
  return (
    <div className={styles.infoBlock} aria-label="Доступні прапорці">
      <span className={styles.label}>Прапорці</span>
      <div className={[styles.value, styles.valueDanger].join(' ')}>
        <span className={styles.icon} aria-hidden="true">
          💣
        </span>
        <span>{value}</span>
      </div>
    </div>
  )
}

