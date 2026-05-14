import styles from "../Minesweeper.module.css";

export default function Cell({
  cell,
  rowIndex,
  colIndex,
  onCellClick,
  onCellRightClick,
}) {
  const classNames = [styles.cell];

  if (cell.state === "closed") {
    classNames.push(styles.closed);
  }

  if (cell.state === "opened") {
    classNames.push(styles.opened);
  }

  if (cell.state === "flagged") {
    classNames.push(styles.flag);
  }

  if (
    cell.state === "opened" &&
    cell.type === "mine"
  ) {
    classNames.push(styles.mine);
  }

  if (
    cell.state === "opened" &&
    cell.type !== "mine" &&
    cell.neighborMines > 0
  ) {
    classNames.push(
      styles[`number${cell.neighborMines}`]
    );
  }

  function getCellContent() {
    if (cell.state === "flagged") {
      return "";
    }

    if (
      cell.state === "opened" &&
      cell.type === "mine"
    ) {
      return "";
    }

    if (
      cell.state === "opened" &&
      cell.type !== "mine" &&
      cell.neighborMines > 0
    ) {
      return cell.neighborMines;
    }

    return "";
  }

  function getAriaLabel() {
    const position = `Cell ${rowIndex + 1}-${colIndex + 1}`;

    if (cell.state === "closed") {
      return `${position}, closed`;
    }

    if (cell.state === "flagged") {
      return `${position}, flagged`;
    }

    if (
      cell.state === "opened" &&
      cell.type === "mine"
    ) {
      return `${position}, opened mine`;
    }

    if (
      cell.state === "opened" &&
      cell.neighborMines > 0
    ) {
      return `${position}, opened, ${cell.neighborMines} neighboring mines`;
    }

    return `${position}, opened empty`;
  }

  return (
    <button
      type="button"
      className={classNames.join(" ")}
      aria-label={getAriaLabel()}
      onClick={() =>
        onCellClick(rowIndex, colIndex)
      }
      onContextMenu={(event) =>
        onCellRightClick(
          event,
          rowIndex,
          colIndex
        )
      }
    >
      {getCellContent()}
    </button>
  );
}