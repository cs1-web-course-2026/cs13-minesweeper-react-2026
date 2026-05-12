import React from 'react';
import Cell from './Cell';
import styles from './Minesweeper.module.css';

export default function Board({ board, onCellClick, onCellRightClick }) {
    if (!board || board.length === 0) return null;

    const colsCount = board[0].length;

    return (
        <main 
            className={styles.gameBoard}
            style={{ gridTemplateColumns: `repeat(${colsCount}, 1fr)` }}
        >
            {board.map((row, rowIndex) =>
                row.map((cell, colIndex) => (
                    <Cell
                        key={`${rowIndex}-${colIndex}`}
                        cellData={cell}
                        rowIndex={rowIndex}
                        colIndex={colIndex}
                        onClick={() => onCellClick(rowIndex, colIndex)}
                        onRightClick={(event) => onCellRightClick(event, rowIndex, colIndex)}
                    />
                ))
            )}
        </main>
    );
}