import Cell from './Cell'
import styles from './Board.module.css'

export default function Board({
  board,
  gameStatus,
  onCellClick,
  onCellRightClick,
}) {
  const disabled = gameStatus !== 'playing'

  return (
    <div className={styles.board}>
      {board.map((row, rowIndex) => (
        <div key={rowIndex} className={styles.row}>
          {row.map((cell, colIndex) => (
            <Cell
              key={`${rowIndex}-${colIndex}`}
              cell={cell}
              gameStatus={gameStatus}
              disabled={disabled}
              onReveal={() => onCellClick(rowIndex, colIndex)}
              onToggleFlag={(e) => onCellRightClick(e, rowIndex, colIndex)}
            />
          ))}
        </div>
      ))}
    </div>
  )
}
