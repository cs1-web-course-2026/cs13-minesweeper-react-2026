import { CELL_CONTENT, CELL_STATE } from '../constants'
import styles from './Cell.module.css'

function getAriaLabel(cell, row, col) {
  const position = `Ряд ${row + 1}, стовпець ${col + 1}`

  if (cell.wrongFlag) return `${position}, помилковий прапорець`

  if (cell.state === CELL_STATE.FLAGGED) return `${position}, прапорець`

  if (cell.state === CELL_STATE.CLOSED) return `${position}, закрита`

  if (cell.type === CELL_CONTENT.MINE) return `${position}, міна`

  if (cell.neighborMines === 0) return `${position}, відкрита, порожня`

  return `${position}, ${cell.neighborMines} сусідніх мін`
}

function getCellClassName(cell) {
  if (cell.wrongFlag) return [styles.cell, styles.flagWrong].join(' ')

  if (cell.state === CELL_STATE.FLAGGED)
    return [styles.cell, styles.closed, styles.flag].join(' ')

  if (cell.state === CELL_STATE.CLOSED) return [styles.cell, styles.closed].join(' ')

  if (cell.type === CELL_CONTENT.MINE) {
    return [
      styles.cell,
      cell.triggered ? styles.mineTriggered : styles.mine,
    ].join(' ')
  }

  const numberClass =
    cell.neighborMines === 0 ? styles.num0 : styles[`num${cell.neighborMines}`]

  return [styles.cell, styles.open, numberClass].filter(Boolean).join(' ')
}

export default function Cell({ cell, row, col, onClick, onRightClick }) {
  const content =
    cell.state === CELL_STATE.OPENED &&
    cell.type !== CELL_CONTENT.MINE &&
    cell.neighborMines > 0
      ? cell.neighborMines
      : ''

  return (
    <button
      type="button"
      className={getCellClassName(cell)}
      onClick={onClick}
      onContextMenu={onRightClick}
      aria-label={getAriaLabel(cell, row, col)}
    >
      {content}
    </button>
  )
}

