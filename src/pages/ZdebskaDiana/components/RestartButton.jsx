import { GAME_STATUS } from '../constants'
import styles from './RestartButton.module.css'

export default function RestartButton({ status, onRestart }) {
  const disabled = status === GAME_STATUS.PLAYING
  const label =
    status === GAME_STATUS.WON || status === GAME_STATUS.LOST ? 'Рестарт' : 'Старт'

  return (
    <button
      className={styles.button}
      type="button"
      onClick={onRestart}
      disabled={disabled}
      aria-label="Старт/Рестарт гри"
      title={disabled ? 'Під час гри рестарт вимкнено' : 'Старт/Рестарт'}
    >
      {label}
    </button>
  )
}

