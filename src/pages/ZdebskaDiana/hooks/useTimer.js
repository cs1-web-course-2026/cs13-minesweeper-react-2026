import { useEffect, useMemo, useState } from 'react'
import { GAME_STATUS } from '../constants'

export function useTimer(status, resetKey = 0) {
  const [time, setTime] = useState(0)

  useEffect(() => {
    setTime(0)
  }, [resetKey])

  useEffect(() => {
    if (status !== GAME_STATUS.PLAYING) return

    const id = setInterval(() => {
      setTime((t) => t + 1)
    }, 1000)

    return () => clearInterval(id)
  }, [status])

  const display = useMemo(() => {
    const capped = Math.min(time, 999)
    return String(capped).padStart(3, '0')
  }, [time])

  return { time, display }
}

