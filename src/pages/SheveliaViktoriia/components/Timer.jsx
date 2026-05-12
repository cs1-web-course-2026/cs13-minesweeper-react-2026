import { useState, useEffect } from 'react'
import { GAME_STATUS } from '../constants/gameStatus'
import styles from './Timer.module.css'

export default function Timer({ gameStatus, resetKey }) {
  const [seconds, setSeconds] = useState(0)

  useEffect(() => {
    setSeconds(0)
  }, [resetKey])

  useEffect(() => {
    if (gameStatus !== GAME_STATUS.PLAYING) return
    const id = setInterval(() => setSeconds((s) => s + 1), 1000)
    return () => clearInterval(id)
  }, [gameStatus, resetKey])

  return (
    <div className={styles.wrap}>
      <span className={styles.label}>Час</span>
      <span className={styles.value}>{seconds} с</span>
    </div>
  )
}
