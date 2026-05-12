import React, { useState, useEffect } from 'react';
import Board from './Board';
import styles from './Minesweeper.module.css';
import { GAME_STATUS, CELL_STATE, CELL_CONTENT, GAME_SETTINGS } from './constants';
import { cloneBoard, initializeEmptyBoard, placeMinesAndCalculateNeighbors, revealCellsRecursively, revealAllMines, checkIsGameWon } from './utils';

export default function KlushynMaksymGame() {
    const [board, setBoard] = useState([]);
    const [status, setStatus] = useState(GAME_STATUS.PROCESS);
    const [flags, setFlags] = useState(GAME_SETTINGS.MINES);
    const [time, setTime] = useState(0);
    const [isFirstClick, setIsFirstClick] = useState(true);
    const [isRunning, setIsRunning] = useState(false);
    const [message, setMessage] = useState('');

    useEffect(() => {
        let timerId;
        if (isRunning) {
            timerId = setInterval(() => setTime(prevTime => prevTime + 1), 1000);
        }
        return () => clearInterval(timerId);
    }, [isRunning]);

    const initGame = () => {
        const emptyBoard = initializeEmptyBoard(GAME_SETTINGS.ROWS, GAME_SETTINGS.COLS);
        setBoard(emptyBoard);
        setStatus(GAME_STATUS.PROCESS);
        setFlags(GAME_SETTINGS.MINES);
        setTime(0);
        setIsFirstClick(true);
        setIsRunning(false);
        setMessage('');
    };

    useEffect(() => { initGame(); }, []);

    const handleCellClick = (clickedRow, clickedCol) => {
        if (status !== GAME_STATUS.PROCESS || board[clickedRow][clickedCol].state !== CELL_STATE.CLOSED) return;

        let currentBoard = cloneBoard(board);

        if (isFirstClick) {
            currentBoard = placeMinesAndCalculateNeighbors(currentBoard, clickedRow, clickedCol, GAME_SETTINGS.ROWS, GAME_SETTINGS.COLS, GAME_SETTINGS.MINES);
            setIsFirstClick(false);
            setIsRunning(true);
        }

        if (currentBoard[clickedRow][clickedCol].type === CELL_CONTENT.MINE) {
            revealAllMines(currentBoard, GAME_SETTINGS.ROWS, GAME_SETTINGS.COLS);
            currentBoard[clickedRow][clickedCol].state = CELL_STATE.OPENED;
            setStatus(GAME_STATUS.LOSE);
            setIsRunning(false);
            setMessage('Ви підірвалися на міні! Гра закінчена. 💥');
        } else {
            revealCellsRecursively(currentBoard, clickedRow, clickedCol, GAME_SETTINGS.ROWS, GAME_SETTINGS.COLS);
            
            const isWon = checkIsGameWon(currentBoard, GAME_SETTINGS.ROWS, GAME_SETTINGS.COLS, GAME_SETTINGS.MINES);
            if (isWon) {
                setStatus(GAME_STATUS.WIN);
                setIsRunning(false);
                setMessage('Вітаємо! Ви розмінували всі безпечні клітинки! 🎉');
            }
        }
        
        setBoard(currentBoard);
    };

    const handleRightClick = (event, clickedRow, clickedCol) => {
        event.preventDefault();
        if (status !== GAME_STATUS.PROCESS) return;
        
        const currentBoard = cloneBoard(board);
        const cell = currentBoard[clickedRow][clickedCol];

        if (cell.state === CELL_STATE.CLOSED && flags > 0) {
            cell.state = CELL_STATE.FLAGGED;
            setFlags(prevFlags => prevFlags - 1);
        } else if (cell.state === CELL_STATE.FLAGGED) {
            cell.state = CELL_STATE.CLOSED;
            setFlags(prevFlags => prevFlags + 1);
        }
        setBoard(currentBoard);
    };

    return (
        <div className={styles.minesweeperApp}>
            <header className={styles.gameHeader}>
                <div className={styles.counter}>🚩 {String(flags).padStart(3, '0')}</div>
                <button className={styles.btnRestart} onClick={initGame} title="Почати нову гру" aria-label="Почати нову гру">
                    {status === GAME_STATUS.LOSE ? '😵' : status === GAME_STATUS.WIN ? '😎' : '🙂'}
                </button>
                <div className={styles.counter} id="timer">⏱️ {String(time).padStart(3, '0')}</div>
            </header>

            <Board board={board} onCellClick={handleCellClick} onCellRightClick={handleRightClick} />

            <p className={styles.gameMessage} role="status" aria-live="polite">
                {message}
            </p>
        </div>
    );
}