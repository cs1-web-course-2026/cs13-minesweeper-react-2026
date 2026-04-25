import { CELL_CONTENT, CELL_STATE, GAME_STATUS } from '../constants';
import { getCellAriaLabel } from '../gameUtils';
import styles from '../Minesweeper.module.css';

function Cell({
  cell,
  row,
  col,
  gameStatus,
  explodedCell,
  onReveal,
  onToggleFlag
}) {
  const shouldRevealBoard = gameStatus !== GAME_STATUS.PLAYING;
  const classNames = [styles.cell];
  let text = '';

  if (cell.state === CELL_STATE.OPENED) {
    classNames.push(styles.open);

    if (cell.type === CELL_CONTENT.MINE) {
      classNames.push(styles.mine);
    } else if (cell.neighborMines > 0) {
      classNames.push(styles[`value${cell.neighborMines}`]);
      text = String(cell.neighborMines);
    }
  } else if (cell.state === CELL_STATE.FLAGGED) {
    if (shouldRevealBoard && cell.type !== CELL_CONTENT.MINE) {
      classNames.push(styles.open, styles.flag, styles.falseFlag);
    } else {
      classNames.push(styles.closed, styles.flag);
    }
  } else if (shouldRevealBoard && cell.type === CELL_CONTENT.MINE) {
    classNames.push(styles.open, styles.mine);
  } else {
    classNames.push(styles.closed);
  }

  if (
    explodedCell !== null &&
    explodedCell.row === row &&
    explodedCell.col === col
  ) {
    classNames.push(styles.clicked);
  }

  const handleClick = () => {
    onReveal(row, col);
  };

  const handleContextMenu = (event) => {
    event.preventDefault();
    onToggleFlag(row, col);
  };

  return (
    <button
      type="button"
      className={classNames.join(' ')}
      aria-label={getCellAriaLabel(row, col, cell)}
      onClick={handleClick}
      onContextMenu={handleContextMenu}
    >
      {text}
    </button>
  );
}

export default Cell;
