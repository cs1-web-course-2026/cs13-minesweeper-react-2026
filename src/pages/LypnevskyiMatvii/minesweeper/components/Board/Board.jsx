import Cell from '../Cell/Cell'

import styles from './Board.module.css'

export default function Board({ field, hitCellKey, isInteractive, onCellOpen, onCellToggleFlag }) {
  const cols = field[0]?.length ?? 0

  return (
    <div className={styles.board} style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}>
      {field.flatMap((rowCells, row) =>
        rowCells.map((cell, col) => (
          <Cell
            key={`${row}:${col}`}
            cell={cell}
            row={row}
            col={col}
            isHit={hitCellKey === `${row}:${col}`}
            isInteractive={isInteractive}
            onOpen={() => onCellOpen(row, col)}
            onToggleFlag={() => onCellToggleFlag(row, col)}
          />
        ))
      )}
    </div>
  )
}

