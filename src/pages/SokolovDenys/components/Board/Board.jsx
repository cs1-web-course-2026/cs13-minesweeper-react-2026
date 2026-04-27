import React from 'react';
import Cell from '../Cell/Cell';
import styles from './Board.module.css';

const Board = ({ field, onCellClick, onCellFlag, rows, cols }) => {
  return (
    <div 
      className={styles.board} 
      role="grid"
      aria-label="Ігрове поле Сапера"
      style={{ 
        gridTemplateColumns: `repeat(${cols}, var(--cell-size, 60px))`,
        gridTemplateRows: `repeat(${rows}, var(--cell-size, 60px))` 
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