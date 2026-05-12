import { useMemo, useState } from 'react'
import { GAME_STATUS } from './constants'
import { useMinesweeper } from './hooks/useMinesweeper'
import { useTimer } from './hooks/useTimer'
import Board from './components/Board'
import GameStatus from './components/GameStatus'
import MineCounter from './components/MineCounter'
import RestartButton from './components/RestartButton'
import Timer from './components/Timer'
import styles from './MinesweeperPage.module.css'

export default function ZdebskaDianaGame() {
  const { board, cols, minesCount, remainingFlags, status, restart, handleCellClick, handleRightClick } =
    useMinesweeper()

  const [timerResetKey, setTimerResetKey] = useState(0)
  const { display } = useTimer(status, timerResetKey)

  const flagsDisplay = useMemo(() => {
    return String(Math.max(remainingFlags, 0)).padStart(3, '0')
  }, [remainingFlags])

  const onRestart = () => {
    if (status === GAME_STATUS.PLAYING) return
    restart()
    setTimerResetKey((k) => k + 1)
  }

  return (
    <main className={styles.page} aria-label="Гра Сапер (React)">
      <section className={styles.minesweeper} aria-label="Гра Сапер">
        <h1 className={styles.title}>Сапер</h1>

        <section className={styles.header} aria-label="Панель керування">
          <MineCounter value={flagsDisplay || String(minesCount).padStart(3, '0')} />
          <RestartButton status={status} onRestart={onRestart} />
          <Timer value={display} />
        </section>

        <GameStatus status={status} />

        <section className={styles.boardWrapper} aria-label="Ігрове поле">
          <Board
            board={board}
            cols={cols}
            onCellClick={handleCellClick}
            onCellRightClick={handleRightClick}
          />
        </section>
      </section>
    </main>
  )
}

