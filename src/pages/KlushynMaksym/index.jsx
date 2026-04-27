import React, { useState, useEffect } from 'react';
import Board from './Board';
import styles from './Minesweeper.module.css';

const ROWS = 9;
const COLS = 9;
const MINES = 15;
const DIRECTIONS = [[-1, -1], [-1, 0], [-1, 1], [0, -1], [0, 1], [1, -1], [1, 0], [1, 1]];

// Функція для глибокого копіювання поля (Вимога React)
const cloneBoard = (board) => board.map(row => row.map(cell => ({ ...cell })));

export default function KlushynMaksymGame() {
    const [board, setBoard] = useState([]);
    const [status, setStatus] = useState('process');
    const [flags, setFlags] = useState(MINES);
    const [time, setTime] = useState(0);
    const [isFirstClick, setIsFirstClick] = useState(true);
    const [isRunning, setIsRunning] = useState(false);
    const [message, setMessage] = useState('');

    // --- ТАЙМЕР ---
    useEffect(() => {
        let timerId;
        if (isRunning) {
            timerId = setInterval(() => setTime(t => t + 1), 1000);
        }
        return () => clearInterval(timerId); // Це твій stopTimer()
    }, [isRunning]);

    // --- ІНІЦІАЛІЗАЦІЯ ---
    const initGame = () => {
        const newBoard = [];
        for (let r = 0; r < ROWS; r++) {
            const row = [];
            for (let c = 0; c < COLS; c++) {
                row.push({ type: 'empty', state: 'closed', neighborMines: 0 });
            }
            newBoard.push(row);
        }
        setBoard(newBoard);
        setStatus('process');
        setFlags(MINES);
        setTime(0);
        setIsFirstClick(true);
        setIsRunning(false);
        setMessage('');
    };

    useEffect(() => { initGame(); }, []);

    // --- ЛОГІКА КЛІКІВ ---
    const handleCellClick = (r, c) => {
        if (status !== 'process' || board[r][c].state !== 'closed') return;

        let currentBoard = cloneBoard(board);

        // Генерація мін при першому кліці
        if (isFirstClick) {
            let placed = 0;
            while (placed < MINES) {
                const rr = Math.floor(Math.random() * ROWS);
                const cc = Math.floor(Math.random() * COLS);
                // Міна не ставиться туди, куди ми щойно клікнули
                if (currentBoard[rr][cc].type !== 'mine' && !(rr === r && cc === c)) {
                    currentBoard[rr][cc].type = 'mine';
                    placed++;
                }
            }
            // Підрахунок сусідів
            for (let i = 0; i < ROWS; i++) {
                for (let j = 0; j < COLS; j++) {
                    if (currentBoard[i][j].type === 'mine') continue;
                    let count = 0;
                    for (const [dr, dc] of DIRECTIONS) {
                        const nr = i + dr, nc = j + dc;
                        if (nr >= 0 && nr < ROWS && nc >= 0 && nc < COLS && currentBoard[nr][nc].type === 'mine') count++;
                    }
                    currentBoard[i][j].neighborMines = count;
                }
            }
            setIsFirstClick(false);
            setIsRunning(true); // Твій startTimer()
        }

        // Твоя рекурсія revealCell
        const recursiveReveal = (b, row, col) => {
            if (row < 0 || row >= ROWS || col < 0 || col >= COLS) return;
            const cell = b[row][col];
            if (cell.state !== 'closed') return;

            cell.state = 'opened';
            if (cell.neighborMines === 0) {
                for (const [dr, dc] of DIRECTIONS) recursiveReveal(b, row + dr, col + dc);
            }
        };

        // Перевірка на міну
        if (currentBoard[r][c].type === 'mine') {
            // Твій revealAllMines()
            for (let i = 0; i < ROWS; i++) {
                for (let j = 0; j < COLS; j++) {
                    if (currentBoard[i][j].type === 'mine') currentBoard[i][j].state = 'opened';
                }
            }
            currentBoard[r][c].state = 'opened'; // Окрема обробка підірваної міни
            setStatus('lose');
            setIsRunning(false);
            setMessage('Ви підірвалися на міні! Гра закінчена. 💥');
        } else {
            recursiveReveal(currentBoard, r, c);
            
            // Твоя checkWinCondition()
            let openedCount = 0;
            for (let i = 0; i < ROWS; i++) {
                for (let j = 0; j < COLS; j++) {
                    if (currentBoard[i][j].state === 'opened' && currentBoard[i][j].type !== 'mine') openedCount++;
                }
            }
            if (openedCount === ROWS * COLS - MINES) {
                setStatus('win');
                setIsRunning(false);
                setMessage('Вітаємо! Ви розмінували всі безпечні клітинки! 🎉');
            }
        }
        
        // Зберігаємо змінену дошку в React State
        setBoard(currentBoard);
    };

    const handleRightClick = (e, r, c) => {
        e.preventDefault();
        if (status !== 'process') return;
        const currentBoard = cloneBoard(board);
        const cell = currentBoard[r][c];

        if (cell.state === 'closed' && flags > 0) {
            cell.state = 'flagged';
            setFlags(f => f - 1);
        } else if (cell.state === 'flagged') {
            cell.state = 'closed';
            setFlags(f => f + 1);
        }
        setBoard(currentBoard);
    };

    return (
        <div className={styles.minesweeperApp}>
            <header className={styles.gameHeader}>
                <div className={styles.counter}>🚩 {String(flags).padStart(3, '0')}</div>
                <button className={styles.btnRestart} onClick={initGame} title="Почати нову гру" aria-label="Почати нову гру">
                    {status === 'lose' ? '😵' : status === 'win' ? '😎' : '🙂'}
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