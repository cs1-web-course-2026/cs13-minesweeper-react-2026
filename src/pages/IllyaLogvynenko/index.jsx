import Board from './components/Board';
import FlagCounter from './components/FlagCounter';
import GameStatus from './components/GameStatus';
import RestartButton from './components/RestartButton';
import Timer from './components/Timer';
import useMinesweeper from './useMinesweeper';
import styles from './Minesweeper.module.css';

function StudentMinesweeperGame() {
  const {
    board,
    gameStatus,
    explodedCell,
    timerValue,
    flagsLeft,
    statusMessage,
    restartFace,
    handleReveal,
    handleToggleFlag,
    handleRestart
  } = useMinesweeper();

  return (
    <div className={styles.page}>
      <div className={styles.app}>
        <header className={styles.header}>
          <FlagCounter value={flagsLeft} />
          <RestartButton face={restartFace} onClick={handleRestart} />
          <Timer value={timerValue} />
        </header>

        <GameStatus message={statusMessage} />

        <Board
          board={board}
          gameStatus={gameStatus}
          explodedCell={explodedCell}
          onReveal={handleReveal}
          onToggleFlag={handleToggleFlag}
        />
      </div>
    </div>
  );
}

export default StudentMinesweeperGame;
