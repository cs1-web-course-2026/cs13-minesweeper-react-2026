import { useEffect, useMemo, useState } from "react";

const ROWS = 10;
const COLS = 10;
const MINES_COUNT = 15;

function createEmptyCell() {
  return {
    type: "empty",
    state: "closed",
    neighborMines: 0,
  };
}

function createEmptyField(rows, cols) {
  return Array.from({ length: rows }, () =>
    Array.from({ length: cols }, () => createEmptyCell())
  );
}

function isInsideField(row, col, rows, cols) {
  return row >= 0 && row < rows && col >= 0 && col < cols;
}

function getNeighbors(row, col, rows, cols) {
  const neighbors = [];

  for (let dRow = -1; dRow <= 1; dRow++) {
    for (let dCol = -1; dCol <= 1; dCol++) {
      if (dRow === 0 && dCol === 0) continue;

      const newRow = row + dRow;
      const newCol = col + dCol;

      if (isInsideField(newRow, newCol, rows, cols)) {
        neighbors.push([newRow, newCol]);
      }
    }
  }

  return neighbors;
}

function generateField(rows, cols, minesCount) {
  const newField = createEmptyField(rows, cols);
  let placedMines = 0;

  while (placedMines < minesCount) {
    const row = Math.floor(Math.random() * rows);
    const col = Math.floor(Math.random() * cols);

    if (newField[row][col].type === "mine") continue;

    newField[row][col].type = "mine";
    placedMines++;
  }

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      if (newField[row][col].type === "mine") continue;

      const neighbors = getNeighbors(row, col, rows, cols);
      let minesAround = 0;

      for (const [nRow, nCol] of neighbors) {
        if (newField[nRow][nCol].type === "mine") {
          minesAround++;
        }
      }

      newField[row][col].neighborMines = minesAround;
    }
  }

  return newField;
}

function cloneField(field) {
  return field.map((row) => row.map((cell) => ({ ...cell })));
}

function openEmptyArea(field, startRow, startCol, rows, cols) {
  const queue = [[startRow, startCol]];

  while (queue.length > 0) {
    const [row, col] = queue.shift();
    const cell = field[row][col];

    if (cell.state === "opened" || cell.state === "flagged") continue;

    cell.state = "opened";

    if (cell.neighborMines !== 0) continue;

    const neighbors = getNeighbors(row, col, rows, cols);

    for (const [nRow, nCol] of neighbors) {
      const neighborCell = field[nRow][nCol];

      if (neighborCell.state === "closed" && neighborCell.type !== "mine") {
        queue.push([nRow, nCol]);
      }
    }
  }
}

function openAllMines(field) {
  for (const row of field) {
    for (const cell of row) {
      if (cell.type === "mine") {
        cell.state = "opened";
      }
    }
  }
}

function countFlags(field) {
  let total = 0;

  for (const row of field) {
    for (const cell of row) {
      if (cell.state === "flagged") {
        total++;
      }
    }
  }

  return total;
}

function checkWin(field) {
  for (const row of field) {
    for (const cell of row) {
      if (cell.type === "empty" && cell.state !== "opened") {
        return false;
      }
    }
  }

  return true;
}

function Cell({ cell, onLeftClick, onRightClick }) {
  let content = "";
  let backgroundColor = "#3b4a5a";
  let textColor = "#ffffff";

  if (cell.state === "flagged") {
    content = "🚩";
  }

  if (cell.state === "opened") {
    backgroundColor = "#dbe4ee";
    textColor = "#1f2937";

    if (cell.type === "mine") {
      content = "💣";
      backgroundColor = "#f87171";
    } else if (cell.neighborMines > 0) {
      content = cell.neighborMines;
    }
  }

  return (
    <button
      onClick={onLeftClick}
      onContextMenu={onRightClick}
      style={{
        width: "36px",
        height: "36px",
        border: "1px solid #94a3b8",
        backgroundColor,
        color: textColor,
        fontSize: "18px",
        fontWeight: "700",
        cursor: "pointer",
        padding: 0,
      }}
    >
      {content}
    </button>
  );
}

function Board({ field, onCellClick, onCellRightClick }) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(10, 36px)",
        width: "fit-content",
        margin: "0 auto",
      }}
    >
      {field.flatMap((row, rowIndex) =>
        row.map((cell, colIndex) => (
          <Cell
            key={`${rowIndex}-${colIndex}`}
            cell={cell}
            onLeftClick={() => onCellClick(rowIndex, colIndex)}
            onRightClick={(event) =>
              onCellRightClick(event, rowIndex, colIndex)
            }
          />
        ))
      )}
    </div>
  );
}

export default function AlforovAnton() {
  const [field, setField] = useState(() =>
    generateField(ROWS, COLS, MINES_COUNT)
  );
  const [status, setStatus] = useState("process");
  const [gameTime, setGameTime] = useState(0);

  const flagsLeft = useMemo(() => {
    return MINES_COUNT - countFlags(field);
  }, [field]);

  useEffect(() => {
    if (status !== "process") return;

    const timerId = setInterval(() => {
      setGameTime((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(timerId);
  }, [status]);

  function resetGame() {
    setField(generateField(ROWS, COLS, MINES_COUNT));
    setStatus("process");
    setGameTime(0);
  }

  function handleCellClick(row, col) {
    if (status !== "process") return;

    const newField = cloneField(field);
    const cell = newField[row][col];

    if (cell.state === "opened" || cell.state === "flagged") return;

    if (cell.type === "mine") {
      cell.state = "opened";
      openAllMines(newField);
      setField(newField);
      setStatus("lose");
      return;
    }

    if (cell.neighborMines === 0) {
      openEmptyArea(newField, row, col, ROWS, COLS);
    } else {
      cell.state = "opened";
    }

    setField(newField);

    if (checkWin(newField)) {
      setStatus("win");
    }
  }

  function handleCellRightClick(event, row, col) {
    event.preventDefault();

    if (status !== "process") return;

    const newField = cloneField(field);
    const cell = newField[row][col];

    if (cell.state === "opened") return;

    if (cell.state === "closed") {
      cell.state = "flagged";
    } else if (cell.state === "flagged") {
      cell.state = "closed";
    }

    setField(newField);
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#0f172a",
        color: "white",
        padding: "30px",
        textAlign: "center",
      }}
    >
      <h1 style={{ marginBottom: "20px" }}>Тральщик React 🔥</h1>

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "20px",
          marginBottom: "20px",
          fontSize: "20px",
          fontWeight: "600",
          flexWrap: "wrap",
        }}
      >
        <div>⏱ Час: {gameTime}</div>
        <div>🚩 Прапорці: {flagsLeft}</div>
        <div>
          Статус:{" "}
          {status === "process"
            ? "Гра триває"
            : status === "win"
              ? "Перемога"
              : "Поразка"}
        </div>
      </div>

      <button
        onClick={resetGame}
        style={{
          marginBottom: "20px",
          padding: "10px 18px",
          border: "none",
          borderRadius: "8px",
          backgroundColor: "#22c55e",
          color: "white",
          fontSize: "16px",
          fontWeight: "700",
          cursor: "pointer",
        }}
      >
        Старт / Рестарт
      </button>

      <Board
        field={field}
        onCellClick={handleCellClick}
        onCellRightClick={handleCellRightClick}
      />
    </div>
  );
}