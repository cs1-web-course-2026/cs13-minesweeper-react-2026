import React from 'react';
import Cell from './Cell';
import styles from './Minesweeper.module.css';

export default function Board({ board, onCellClick, onCellRightClick }) {
    if (!board || board.length === 0) return null;

    return (
        <main className={styles.gameBoard}>
            {board.map((row, rIdx) =>
                row.map((cell, cIdx) => (
                    <Cell
                        key={`${rIdx}-${cIdx}`}
                        cellData={cell}
                        rowIndex={rIdx}
                        colIndex={cIdx}
                        onClick={() => onCellClick(rIdx, cIdx)}
                        onRightClick={(e) => onCellRightClick(e, rIdx, cIdx)}
                    />
                ))
            )}
        </main>
    );
}