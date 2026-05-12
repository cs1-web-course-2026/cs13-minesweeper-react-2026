import { useCallback, useState } from 'react'
import { useMinesweeper } from './hooks/useMinesweeper'
import { GAME_STATUS } from './constants/gameStatus'
import Board from './components/Board'
import Timer from './components/Timer'
import FlagCounter from './components/FlagCounter'
import GameStatus from './components/GameStatus'
import RestartButton from './components/RestartButton'
import styles from './MinesweeperPage.module.css'

export default function StudentMinesweeperGame() {
  const {
    board,
    gameStatus,
    mineCount,
    flagCount,
    restart,
    handleCellClick,
    handleRightClick,
  } = useMinesweeper()

  const [timerResetKey, setTimerResetKey] = useState(0)

  const onRestart = useCallback(() => {
    restart()
    setTimerResetKey((k) => k + 1)
  }, [restart])

  const remainingFlags = mineCount - flagCount
  const flagsDisplay =
    remainingFlags >= 0 ? String(remainingFlags) : `0-${Math.abs(remainingFlags)}`

  const shellClassName = [
    styles.gameShell,
    gameStatus === GAME_STATUS.WON ? styles.gameShellWon : '',
    gameStatus === GAME_STATUS.LOST ? styles.gameShellLost : '',
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1 className={styles.title}>Minesweeper</h1>
      </header>

      <section className={shellClassName} aria-label="Поле сапера">
        <div className={styles.stats} aria-label="Інформація про гру">
          <GameStatus gameStatus={gameStatus} />
          <Timer gameStatus={gameStatus} resetKey={timerResetKey} />
          <FlagCounter label="Прапорці" value={flagsDisplay} />
        </div>

        <Board
          board={board}
          gameStatus={gameStatus}
          onCellClick={handleCellClick}
          onCellRightClick={handleRightClick}
        />
      </section>

      <div className={styles.controls}>
        <RestartButton onRestart={onRestart} />
      </div>

      <aside className={styles.instructions}>
        <p className={styles.instructionsTitle}>Як грати</p>
        <ul>
          <li>Лівий клік — відкрити клітинку</li>
          <li>Правий клік — прапорець</li>
          <li>Цифри показують кількість мін поруч</li>
          <li>Відкрийте всі клітинки без мін, щоб виграти</li>
        </ul>
      </aside>
    </div>
  )
}
