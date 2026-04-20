import React, { useState, useEffect } from 'react';
import styles from './Minesweeper.module.css';
import Board from './Board';

// Константи з 3-ї лаби
const GAME_STATUS = { PLAYING: 'playing', WIN: 'win', LOST: 'lost' };
const CELL_STATE = { CLOSED: 'closed', OPEN: 'open', FLAGGED: 'flagged' };
const CELL_CONTENT = { EMPTY: 'empty', MINE: 'mine' };
const DIRECTIONS = [[-1, -1], [-1, 0], [-1, 1], [0, -1], [0, 1], [1, -1], [1, 0], [1, 1]];

export default function MinesweeperGame() {
  // Стан гри
  const [rows, setRows] = useState(8);
  const [cols, setCols] = useState(8);
  const [minesCount, setMinesCount] = useState(10);
  const [field, setField] = useState([]);
  const [status, setStatus] = useState(GAME_STATUS.PLAYING);
  const [flagsPlaced, setFlagsPlaced] = useState(0);
  const [time, setTime] = useState(0);
  const [timerActive, setTimerActive] = useState(false);

  // useEffect - функція, яка автоматично викликається при старті гри
  useEffect(() => {
    generateField(rows, cols, minesCount);
  }, [rows, cols, minesCount]);

  // Таймер 
  useEffect(() => {
    let interval;
    if (timerActive && status === GAME_STATUS.PLAYING) {
      interval = setInterval(() => setTime((t) => t + 1), 1000);
    }
    return () => clearInterval(interval);
  }, [timerActive, status]);

  // Генерація поля
  const generateField = (r, c, m) => {
    setStatus(GAME_STATUS.PLAYING);
    setFlagsPlaced(0);
    setTime(0);
    setTimerActive(false);

    let newField = [];
    for (let i = 0; i < r; i++) {
      let row = [];
      for (let j = 0; j < c; j++) {
        row.push({ type: CELL_CONTENT.EMPTY, neighborMines: 0, state: CELL_STATE.CLOSED });
      }
      newField.push(row);
    }

    let minesPlaced = 0;
    while (minesPlaced < m) {
      let randRow = Math.floor(Math.random() * r);
      let randCol = Math.floor(Math.random() * c);
      if (newField[randRow][randCol].type !== CELL_CONTENT.MINE) {
        newField[randRow][randCol].type = CELL_CONTENT.MINE;
        minesPlaced++;
      }
    }

    // Підрахунок сусідніх мін
    for (let i = 0; i < r; i++) {
      for (let j = 0; j < c; j++) {
        if (newField[i][j].type === CELL_CONTENT.MINE) continue;
        let count = 0;
        for (let [dx, dy] of DIRECTIONS) {
          let nr = i + dx, nc = j + dy;
          if (nr >= 0 && nr < r && nc >= 0 && nc < c && newField[nr][nc].type === CELL_CONTENT.MINE) {
            count++;
          }
        }
        newField[i][j].neighborMines = count;
      }
    }
    setField(newField);
  };

  // Функція для відкриття клітинки(лівий клік)
  const handleCellClick = (row, col) => {
    if (status !== GAME_STATUS.PLAYING) return;
    if (!timerActive) setTimerActive(true);

    // Копія перед змінами
    let newField = field.map(r => [...r]);
    let cell = newField[row][col];

    if (cell.state === CELL_STATE.OPEN || cell.state === CELL_STATE.FLAGGED) return;

    // Функція рекурсивного відкриття
    const openRecursive = (r, c) => {
      if (r < 0 || r >= rows || c < 0 || c >= cols) return;
      let currentCell = newField[r][c];
      if (currentCell.state === CELL_STATE.OPEN || currentCell.state === CELL_STATE.FLAGGED) return;

      currentCell.state = CELL_STATE.OPEN;
      if (currentCell.neighborMines === 0 && currentCell.type !== CELL_CONTENT.MINE) {
        for (let [dr, dc] of DIRECTIONS) {
          openRecursive(r + dr, c + dc);
        }
      }
    };

    if (cell.type === CELL_CONTENT.MINE) {
      cell.state = CELL_STATE.OPEN;
      setStatus(GAME_STATUS.LOST);
      setTimerActive(false);
    } else {
      openRecursive(row, col);
      checkWin(newField);
    }
    setField(newField); // Кажемо React оновити екран
  };

  // Функція для встановлення/зняття прапорця (правий клік)
  const handleRightClick = (row, col) => {
    if (status !== GAME_STATUS.PLAYING) return;
    if (!timerActive) setTimerActive(true);

    let newField = field.map(r => [...r]);
    let cell = newField[row][col];

    if (cell.state === CELL_STATE.OPEN) return;

    if (cell.state === CELL_STATE.CLOSED) {
      cell.state = CELL_STATE.FLAGGED;
      setFlagsPlaced(flagsPlaced + 1);
    } else {
      cell.state = CELL_STATE.CLOSED;
      setFlagsPlaced(flagsPlaced - 1);
    }
    setField(newField);
  };

  // Функція для перевірки виграшу
  const checkWin = (currentField) => {
    let unrevealedSafe = 0;
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        if (currentField[i][j].type === CELL_CONTENT.EMPTY && currentField[i][j].state !== CELL_STATE.OPEN) {
          unrevealedSafe++;
        }
      }
    }
    if (unrevealedSafe === 0) {
      setStatus(GAME_STATUS.WIN);
      setTimerActive(false);
    }
  };

  return (
    <div className={styles.gameContainer}>
      <h1>🎮 Сапер (React) 🎮</h1>
      
      <div className={styles.infoPanel}>
        <div className={styles.infoItem}><span>Мін:</span><span>{minesCount - flagsPlaced}</span></div>
        <div className={styles.infoItem}><span>Прапори:</span><span>{flagsPlaced}</span></div>
        <div className={styles.infoItem}><span>Час:</span><span>{time} s</span></div>
      </div>

      <div className={styles.difficultyButtons}>
        <button className={styles.difficultyBtn} onClick={() => { setRows(8); setCols(8); setMinesCount(10); }}>Легко</button>
        <button className={styles.difficultyBtn} onClick={() => { setRows(12); setCols(12); setMinesCount(20); }}>Середньо</button>
        <button className={styles.difficultyBtn} onClick={() => { setRows(16); setCols(16); setMinesCount(40); }}>Важко</button>
      </div>

      <button className={styles.newGameBtn} onClick={() => generateField(rows, cols, minesCount)}>
        🔄 Нова гра
      </button>

      {/* Передаємо поле і функції в компонент Board */}
      <Board
        field = {field}
        cols = {cols}
        onCellClick = {handleCellClick}
        onCellRightClick = {handleRightClick}
      />

      {status === GAME_STATUS.WIN && <div className={`${styles.gameMessage} ${styles.win}`}>🏆 ПЕРЕМОГА!</div>}
      {status === GAME_STATUS.LOST && <div className={`${styles.gameMessage} ${styles.lost}`}>💥 БУМ! ВИ ПРОГРАЛИ!</div>}
    </div>
  );
}
