import React, { useEffect } from 'react';
import styles from './Minesweeper.module.css';
import Board from './components/Board';
import { useGameState } from './hooks/useGameState';
import { useTimer } from './hooks/useTimer';

export default function MinesweeperGame() {
  const { field, rows, cols, mineCount, status, flagsPlaced, timerActive, resetKey, openCell, toggleFlag, initGame } = useGameState(8, 8, 10);
  const time = useTimer(timerActive, resetKey);

  // 🔴 ОСЬ ФІКС: Порожній масив [] гарантує, що це виконається лише раз!
  useEffect(() => { 
    initGame(8, 8, 10); 
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className={styles.gameContainer}>
      
      <h2>🎮 Сапер (React) 🎮</h2>
      
      <div className={styles.infoPanel}>
        <div className={styles.infoItem}>Мін: {mineCount}</div>
        <div className={styles.infoItem}>Прапори: {flagsPlaced}</div>
        <div className={styles.infoItem}>Час: {time} с</div>
      </div>

      <div className={styles.difficultyButtons}>
        <button className={styles.difficultyBtn} onClick={() => initGame(8, 8, 10)}>Легко</button>
        <button className={styles.difficultyBtn} onClick={() => initGame(12, 12, 20)}>Середньо</button>
        <button className={styles.difficultyBtn} onClick={() => initGame(16, 16, 40)}>Важко</button>
      </div>

      {/* 🔴 ФІКС: Тепер "Нова гра" пам'ятає обрану складність (rows, cols), а не скидає на 8x8 */}
      <button className={styles.newGameBtn} onClick={() => initGame(rows, cols, mineCount)}>
        🔄 Нова гра
      </button>

      <main>
        <Board 
          field={field} 
          cols={cols} 
          gameStatus={status} 
          onCellClick={openCell} 
          onCellRightClick={toggleFlag} 
        />
      </main>

      {status === 'win' && (
        <div className={`${styles.gameMessage} ${styles.win}`}>🏆 ПЕРЕМОГА!</div>
      )}
      {status === 'lost' && (
        <div className={`${styles.gameMessage} ${styles.lost}`}>💥 БУМ!</div>
      )}

    </div>
  );
}