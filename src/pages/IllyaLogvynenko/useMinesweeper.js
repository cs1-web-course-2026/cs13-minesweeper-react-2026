import { useCallback, useEffect, useState } from 'react'
import { CELL_STATE, DEFAULT_SETTINGS, GAME_STATUS } from './constants/game'
import {
  checkWinCondition,
  cloneBoard,
  countFlaggedCells,
  createInitialGameState,
  formatCounterValue,
  getRestartFace,
  getStatusMessage,
  placeMines,
  revealCells
} from './utils'

export default function useMinesweeper(settings = DEFAULT_SETTINGS) {
  const [gameState, setGameState] = useState(() => createInitialGameState(settings));

  useEffect(() => {
    if (!gameState.firstMoveMade || gameState.status !== GAME_STATUS.PLAYING) {
      return undefined;
    }

    const timerId = setInterval(() => {
      setGameState((previousState) => ({
        ...previousState,
        gameTime: previousState.gameTime + 1
      }));
    }, 1000);

    return () => clearInterval(timerId);
  }, [gameState.firstMoveMade, gameState.status]);

  const handleReveal = (row, col) => {
    setGameState((previousState) => {
      if (previousState.status !== GAME_STATUS.PLAYING) {
        return previousState;
      }

      const cell = previousState.board[row]?.[col];

      if (!cell || cell.state !== CELL_STATE.CLOSED) {
        return previousState;
      }

      let workingBoard = previousState.board;
      let firstMoveMade = previousState.firstMoveMade;

      if (!previousState.firstMoveMade) {
        workingBoard = placeMines(
          previousState.board,
          row,
          col,
          previousState.minesCount
        );
        firstMoveMade = true;
      }

      const revealResult = revealCells(workingBoard, row, col);
      let nextStatus = revealResult.status;

      if (
        nextStatus === GAME_STATUS.PLAYING &&
        checkWinCondition(revealResult.board)
      ) {
        nextStatus = GAME_STATUS.WON;
      }

      return {
        ...previousState,
        board: revealResult.board,
        status: nextStatus,
        explodedCell: revealResult.explodedCell,
        firstMoveMade
      };
    });
  };

  const handleToggleFlag = (row, col) => {
    setGameState((previousState) => {
      if (previousState.status !== GAME_STATUS.PLAYING) {
        return previousState;
      }

      if (
        previousState.board.length === 0 ||
        row < 0 ||
        row >= previousState.board.length ||
        col < 0 ||
        col >= previousState.board[0].length
      ) {
        return previousState;
      }

      const nextBoard = previousState.board.map((boardRow) =>
        boardRow.map((cell) => ({ ...cell }))
      );
      const cell = nextBoard[row][col];

      if (cell.state === CELL_STATE.OPENED) {
        return previousState;
      }

      const flaggedCellsCount = countFlaggedCells(nextBoard);

      if (
        cell.state === CELL_STATE.CLOSED &&
        flaggedCellsCount >= previousState.minesCount
      ) {
        return previousState;
      }

      cell.state =
        cell.state === CELL_STATE.FLAGGED
          ? CELL_STATE.CLOSED
          : CELL_STATE.FLAGGED;

      return {
        ...previousState,
        board: nextBoard
      };
    });
  };

  const handleRestart = () => {
    setGameState(createInitialGameState(settings));
  };

  const flagsLeft = formatCounterValue(
    gameState.minesCount - countFlaggedCells(gameState.board)
  );

  return {
    board: gameState.board,
    gameStatus: gameState.status,
    explodedCell: gameState.explodedCell,
    timerValue: formatCounterValue(gameState.gameTime),
    flagsLeft,
    statusMessage: getStatusMessage(gameState.status),
    restartFace: getRestartFace(gameState.status),
    handleReveal,
    handleToggleFlag,
    handleRestart
  };
}
