import { GAME_STATUS } from '../constants'
import styles from './GameStatus.module.css'

export default function GameStatus({ status }) {
  let text = 'Натисніть на клітинку, щоб почати гру.'
  let className = styles.status

  if (status === GAME_STATUS.WON) {
    text = 'Перемога! 🎉'
    className = [styles.status, styles.win].join(' ')
  } else if (status === GAME_STATUS.LOST) {
    text = 'Програш 💥'
    className = [styles.status, styles.lose].join(' ')
  } else if (status === GAME_STATUS.PLAYING) {
    text = 'Гра триває...'
  }

  return (
    <p className={className} role="status" aria-live="polite">
      {text}
    </p>
  )
}

