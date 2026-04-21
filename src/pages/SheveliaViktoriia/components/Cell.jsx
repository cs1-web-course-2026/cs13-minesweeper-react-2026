import styles from './Cell.module.css'
import { GAME_STATUS } from '../constants/gameStatus'

function getNumberClass(count) {
  if (count < 1 || count > 3) return ''
  return styles[`number${count}`] ?? ''
}

export default function Cell({
  cell,
  rowIndex,
  colIndex,
  gameStatus,
  disabled,
  onReveal,
  onToggleFlag,
}) {
  const { isRevealed, isMine, isFlagged, isExploded, neighborCount } = cell

  const classNames = [styles.cell]
  if (isRevealed) {
    classNames.push(styles.revealed)
    if (isMine && isFlagged && gameStatus === GAME_STATUS.LOST) {
      classNames.push(styles.flaggedMine)
    } else if (isMine && isExploded) {
      classNames.push(styles.explodedMine)
    } else if (isMine) {
      classNames.push(styles.mine)
    } else if (neighborCount > 0) {
      classNames.push(getNumberClass(neighborCount))
    }
  } else {
    classNames.push(styles.hidden)
    if (isFlagged) classNames.push(styles.flagged)
  }

  let content = ''
  if (!isRevealed) {
    content = isFlagged ? '🚩' : ''
  } else if (isMine && isFlagged && gameStatus === GAME_STATUS.LOST) {
    content = '🚩'
  } else if (isMine) {
    content = '💣'
  } else if (neighborCount > 0) {
    content = String(neighborCount)
  }

  const stateDescription = isRevealed
    ? isMine
      ? 'mine'
      : `revealed ${neighborCount}`
    : isFlagged
      ? 'flagged'
      : 'hidden'

  const ariaLabel = `Row ${rowIndex + 1}, column ${colIndex + 1}, ${stateDescription}`

  return (
    <button
      type="button"
      aria-label={ariaLabel}
      className={classNames.filter(Boolean).join(' ')}
      disabled={disabled}
      onClick={onReveal}
      onContextMenu={onToggleFlag}
    >
      {content}
    </button>
  )
}
