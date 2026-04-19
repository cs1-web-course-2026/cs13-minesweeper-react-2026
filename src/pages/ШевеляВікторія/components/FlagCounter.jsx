import styles from './FlagCounter.module.css'

export default function FlagCounter({
  label = 'Прапорці',
  value,
}) {
  const displayValue = value ?? 0

  return (
    <div className={styles.wrap}>
      <span className={styles.label}>{label}</span>
      <span className={styles.value}>{displayValue}</span>
    </div>
  )
}
