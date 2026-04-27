import React from 'react';
import Cell from '../Cell/Cell';
import styles from './Board.module.css';

const Board = ({ field, onCellClick, onCellFlag, rows, cols }) => {
  return (
    <div 
      className={styles.board} 
      style={{ 
        gridTemplateColumns: `repeat(${cols}, 60px)`,
        gridTemplateRows: `repeat(${rows}, 60px)` 
      }}
    >
      {field.map((row, rowIndex) => 
        row.map((cell, colIndex) => (
          <Cell 
            key={`${rowIndex}-${colIndex}`} // Ключ для React (Reconciliation)
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