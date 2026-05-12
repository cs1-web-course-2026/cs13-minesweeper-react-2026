import Cell from './Cell'
import styles from './Board.module.css'

export default function Board({ board, cols, onCellClick, onCellRightClick }) {
  return (
    <div
      className={styles.board}
      style={{ '--cols': cols }}
      onContextMenu={(e) => e.preventDefault()}
      role="grid"
      aria-label="Ігрове поле"
    >
      {board.map((row, r) =>
        row.map((cell, c) => (
          <Cell
            key={`${r}-${c}`}
            cell={cell}
            row={r}
            col={c}
            onClick={() => onCellClick(r, c)}
            onRightClick={(e) => onCellRightClick(e, r, c)}
          />
        ))
      )}
    </div>
  )
}

