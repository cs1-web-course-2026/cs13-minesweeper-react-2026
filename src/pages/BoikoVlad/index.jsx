import { useEffect, useState } from "react";

import styles from "./Minesweeper.module.css";

import Board from "./components/Board";
import Timer from "./components/Timer";
import RestartButton from "./components/RestartButton";
import GameStatus from "./components/GameStatus";

import {
  createEmptyField,
  createGameField,
  openCell,
  toggleFlag,
  checkWin,
  countFlags,
} from "./utils/gameLogic";

const ROWS = 9;
const COLS = 9;
const MINES_COUNT = 10;

export default function BoikoVlad() {
  const [field, setField] = useState(() =>
    createEmptyField(ROWS, COLS)
  );

  const [status, setStatus] = useState("idle");

  const [time, setTime] = useState(0);

  useEffect(() => {
    if (status !== "process") return;

    const timerId = setInterval(() => {
      setTime((prevTime) => prevTime + 1);
    }, 1000);

    return () => clearInterval(timerId);
  }, [status]);

  const flagsLeft = MINES_COUNT - countFlags(field);

  function restartGame() {
    setField(createEmptyField(ROWS, COLS));
    setStatus("idle");
    setTime(0);
  }

  function handleCellClick(rowIndex, colIndex) {
    if (status === "win" || status === "lose") {
      return;
    }

    let currentField = field;

    if (status === "idle") {
      currentField = createGameField(
        ROWS,
        COLS,
        MINES_COUNT,
        rowIndex,
        colIndex
      );

      setStatus("process");
    }

    const { newField, result } = openCell(
      currentField,
      rowIndex,
      colIndex
    );

    setField(newField);

    if (result === "lose") {
      setStatus("lose");
      return;
    }

    if (checkWin(newField, ROWS, COLS, MINES_COUNT)) {
      setStatus("win");
    }
  }

  function handleCellRightClick(event, rowIndex, colIndex) {
    event.preventDefault();

    if (status === "win" || status === "lose") {
      return;
    }

    const newField = toggleFlag(
      field,
      rowIndex,
      colIndex
    );

    setField(newField);
  }

  return (
    <div className={styles.page}>
      <div className={styles.game}>
        <header className={styles.header}>
          <div className={styles.flags}>
            {flagsLeft}
          </div>

          <RestartButton onRestart={restartGame} />

          <Timer time={time} />
        </header>

        <Board
          field={field}
          onCellClick={handleCellClick}
          onCellRightClick={handleCellRightClick}
        />

        <GameStatus status={status} />
      </div>
    </div>
  );
}