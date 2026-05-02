import React from 'react';
import Cell from './Cell';
import styles from '../Minesweeper.module.css';

const Board = ({ field, rows, cols, onOpenCell, onToggleFlag, status }) => {
    return (
        <main
            className={styles.gameBoard}
            style={{
                gridTemplateColumns: `repeat(${cols}, var(--cell-size))`,
                gridTemplateRows: `repeat(${rows}, var(--cell-size))`
            }}
        >
            {field.map((row, rIdx) =>
                row.map((cellData, cIdx) => (
                    <Cell
                        key={`${rIdx}-${cIdx}`}
                        row={rIdx}
                        col={cIdx}
                        data={cellData}
                        onOpen={onOpenCell}
                        onFlag={onToggleFlag}
                        gameStatus={status}
                    />
                ))
            )}
        </main>
    );
};

export default Board;