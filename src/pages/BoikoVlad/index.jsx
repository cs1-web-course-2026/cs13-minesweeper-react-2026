import { useEffect, useState } from "react";
import styles from "./Minesweeper.module.css";

import Board from "./components/Board";
import Timer from "./components/Timer";
import RestartButton from "./components/RestartButton";
import GameStatus from "./components/GameStatus";

import {
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
    createGameField(ROWS, COLS, MINES_COUNT)
  );

  const [status, setStatus] = useState("process");
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
    setField(createGameField(ROWS, COLS, MINES_COUNT));
    setStatus("process");
    setTime(0);
  }

  function handleCellClick(rowIndex, colIndex) {
    if (status !== "process") return;

    const { newField, result } = openCell(field, rowIndex, colIndex);

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

    if (status !== "process") return;

    const newField = toggleFlag(field, rowIndex, colIndex);
    setField(newField);
  }

  return (
    <div className={styles.page}>
      <div className={styles.game}>
        <header className={styles.header}>
          <div className={styles.flags}>{flagsLeft}</div>

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