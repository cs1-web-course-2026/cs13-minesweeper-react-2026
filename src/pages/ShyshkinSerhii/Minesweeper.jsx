import React, { useState, useEffect, useCallback, useMemo } from 'react';
import Board from './Board';
import Timer from './Timer';
import GameStatus from './GameStatus';
import styles from './Minesweeper.module.css';

const ROWS = 10, COLS = 10, MINES_COUNT = 10;
const GAME_STATUS = { READY: 'ready', RUNNING: 'running', WON: 'won', LOST: 'lost' };

const Minesweeper = () => {
  const [board, setBoard] = useState([]);
  const [status, setStatus] = useState(GAME_STATUS.READY);
  const [seconds, setSeconds] = useState(0);
  const [message, setMessage] = useState({ text: '', kind: 'info' });

  const flagsAvailable = useMemo(() => MINES_COUNT - board.filter(c => c.isFlagged).length, [board]);

  const neighborsOf = useCallback((index) => {
    const row = Math.floor(index / COLS), col = index % COLS, res = [];
    for (let dR = -1; dR <= 1; dR++) {
      for (let dC = -1; dC <= 1; dC++) {
        if (dR === 0 && dC === 0) continue;
        const nR = row + dR, nC = col + dC;
        if (nR >= 0 && nR < ROWS && nC >= 0 && nC < COLS) res.push(nR * COLS + nC);
      }
    }
    return res;
  }, []);

  const initBoard = useCallback(() => {
    const newBoard = Array.from({ length: ROWS * COLS }, (_, i) => ({
      index: i, isMine: false, isOpen: false, isFlagged: false, adjacentMines: 0
    }));
    setBoard(newBoard);
    setStatus(GAME_STATUS.READY);
    setSeconds(0);
    setMessage({ text: '', kind: 'info' });
  }, []);

  useEffect(() => { initBoard(); }, [initBoard]);

  useEffect(() => {
    let interval;
    if (status === GAME_STATUS.RUNNING) interval = setInterval(() => setSeconds(s => s + 1), 1000);
    return () => clearInterval(interval);
  }, [status]);

  const handleCellClick = (index) => {
    if (status === GAME_STATUS.WON || status === GAME_STATUS.LOST) return;
    let currentBoard = [...board];
    if (status === GAME_STATUS.READY) {
      const indices = Array.from({ length: ROWS * COLS }, (_, i) => i).filter(i => i !== index).sort(() => Math.random() - 0.5);
      const mineSet = new Set(indices.slice(0, MINES_COUNT));
      currentBoard = currentBoard.map((c, i) => ({ ...c, isMine: mineSet.has(i) }));
      currentBoard = currentBoard.map((c, i) => ({ ...c, adjacentMines: neighborsOf(i).reduce((acc, ni) => acc + (currentBoard[ni].isMine ? 1 : 0), 0) }));
      setStatus(GAME_STATUS.RUNNING);
    }
    if (currentBoard[index].isMine) {
      setBoard(currentBoard.map(c => c.isMine ? { ...c, isOpen: true } : c));
      setStatus(GAME_STATUS.LOST);
      setMessage({ text: 'Поразка!', kind: 'lose' });
      return;
    }
    const queue = [index], nextBoard = [...currentBoard];
    while (queue.length) {
      const idx = queue.shift();
      if (nextBoard[idx].isOpen || nextBoard[idx].isFlagged) continue;
      nextBoard[idx] = { ...nextBoard[idx], isOpen: true };
      if (nextBoard[idx].adjacentMines === 0) neighborsOf(idx).forEach(n => queue.push(n));
    }
    setBoard(nextBoard);
    if (nextBoard.filter(c => c.isOpen && !c.isMine).length === (ROWS * COLS - MINES_COUNT)) {
      setStatus(GAME_STATUS.WON);
      setMessage({ text: 'Перемога!', kind: 'win' });
    }
  };

  return (
    <div className={styles.container}>
      <Timer seconds={seconds} />
      <div>🚩: {flagsAvailable}</div>
      <button type="button" onClick={initBoard}>Рестарт</button>
      <GameStatus text={message.text} kind={message.kind} />
      <Board board={board} cols={COLS} onCellClick={handleCellClick} onContextMenu={(e, i) => {
        e.preventDefault();
        const nb = [...board];
        nb[i] = { ...nb[i], isFlagged: !nb[i].isFlagged };
        setBoard(nb);
      }} />
    </div>
  );
};

export default Minesweeper;