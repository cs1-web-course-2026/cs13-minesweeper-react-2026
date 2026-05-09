import React from 'react';
import Cell from '../Cell/Cell';
import styles from './Board.module.css';

const BOARD_CELL_SIZE = '60px';
const Board = ({ field, onCellClick, onCellFlag, rows, cols }) => {
  return (
    <div
      className={styles.board}
      role="grid"
      aria-label="Minesweeper board"
      style={{
        gridTemplateColumns: `repeat(${cols}, ${BOARD_CELL_SIZE})`,
        gridTemplateRows: `repeat(${rows}, ${BOARD_CELL_SIZE})`
      }}
    >
      {field.map((row, rowIndex) =>
        row.map((cell, colIndex) => (
          <Cell 
            key={`${rowIndex}-${colIndex}`}
            row={rowIndex}
            col={colIndex}
            data={cell}
            onOpen={() => onCellClick(rowIndex, colIndex)}
            onFlag={() => onCellFlag(rowIndex, colIndex)}
          />
        ))
      )}
    </div>
  );
};

export default Board;