import styles from '../Minesweeper.module.css'
import { CELL_CONTENT, CELL_STATE } from '../constants/game'
import { getCellAriaLabel } from '../utils'

function Cell({
  cell,
  row,
  col,
  gameStatus,
  explodedCell,
  onReveal,
  onToggleFlag
}) {
  const isExploded =
    explodedCell &&
    explodedCell.row === row &&
    explodedCell.col === col

  const isGameLost = gameStatus === 'lose'
  const isOpened = cell.state === CELL_STATE.OPENED
  const isFlagged = cell.state === CELL_STATE.FLAGGED
  const isMine = cell.type === CELL_CONTENT.MINE

  let content = ''

  if (isOpened) {
    if (isMine) {
      content = '💣'
    } else if (cell.neighborMines > 0) {
      content = cell.neighborMines
    }
  } else if (isFlagged) {
    content = '🚩'
  } else if (isGameLost && isMine) {
    content = '💣'
  }

  const classNames = [styles.cell]

  if (isOpened) {
    classNames.push(styles.opened)
  }

  if (isFlagged) {
    classNames.push(styles.flagged)
  }

  if (isExploded) {
    classNames.push(styles.exploded)
  }

  function handleClick() {
    onReveal(row, col)
  }

  function handleContextMenu(event) {
    event.preventDefault()
    onToggleFlag(row, col)
  }

  return (
    <button
      type="button"
      className={classNames.join(' ')}
      onClick={handleClick}
      onContextMenu={handleContextMenu}
      aria-label={getCellAriaLabel(row, col, cell)}
    >
      {content}
    </button>
  )
}

export default Cell
