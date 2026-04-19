import styles from './Cell.module.css'

function getNumberClass(count) {
  if (count < 1 || count > 3) return ''
  return styles[`number${count}`] ?? ''
}

export default function Cell({ cell, gameStatus, disabled, onReveal, onToggleFlag }) {
  const { isRevealed, isMine, isFlagged, isExploded, neighborCount } = cell

  const classNames = [styles.cell]
  if (isRevealed) {
    classNames.push(styles.revealed)
    if (isMine && isFlagged && gameStatus === 'lost') {
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
  } else if (isMine && isFlagged && gameStatus === 'lost') {
    content = '🚩'
  } else if (isMine) {
    content = '💣'
  } else if (neighborCount > 0) {
    content = String(neighborCount)
  }

  return (
    <button
      type="button"
      className={classNames.filter(Boolean).join(' ')}
      disabled={disabled}
      onClick={onReveal}
      onContextMenu={onToggleFlag}
    >
      {content}
    </button>
  )
}
