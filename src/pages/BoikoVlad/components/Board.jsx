import Cell from "./Cell";
import styles from "../Minesweeper.module.css";

export default function Board({ field, onCellClick, onCellRightClick }) {
  return (
    <div className={styles.field}>
      {field.map((row, rowIndex) =>
        row.map((cell, colIndex) => (
          <Cell
            key={`${rowIndex}-${colIndex}`}
            cell={cell}
            rowIndex={rowIndex}
            colIndex={colIndex}
            onCellClick={onCellClick}
            onCellRightClick={onCellRightClick}
          />
        ))
      )}
    </div>
  );
}