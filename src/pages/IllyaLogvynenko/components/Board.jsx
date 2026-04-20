import Cell from './Cell';
import styles from '../Minesweeper.module.css';

function Board({ board, gameStatus, explodedCell, onReveal, onToggleFlag }) {
  const rows = board.length;
  const cols = rows > 0 ? board[0].length : 0;

  return (
    <main
      className={styles.grid}
      style={{
        '--grid-cols': cols,
        '--grid-rows': rows
      }}
    >
      {board.map((rowData, rowIndex) =>
        rowData.map((cell, colIndex) => (
          <Cell
            key={`${rowIndex}-${colIndex}`}
            cell={cell}
            row={rowIndex}
            col={colIndex}
            gameStatus={gameStatus}
            explodedCell={explodedCell}
            onReveal={onReveal}
            onToggleFlag={onToggleFlag}
          />
        ))
      )}
    </main>
  );
}

export default Board;
