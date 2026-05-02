import React from 'react';
import Board from './components/Board';
import StatusPanel from './components/StatusPanel';
import { useMinesweeper } from './hooks/useMinesweeper';
import styles from './Minesweeper.module.css';

const MinesweeperGame = () => {
    const {
        field, status, gameTime, minesLeft,
        reset, openCell, toggleFlag, rows, cols
    } = useMinesweeper(10, 10, 15);

    return (
        <div className={styles.pageContainer}>
            <div className={styles.gameWrapper}>
                <StatusPanel
                    minesLeft={minesLeft}
                    gameTime={gameTime}
                    status={status}
                    onReset={reset}
                />
                {field.length > 0 && (
                    <Board
                        field={field}
                        rows={rows}
                        cols={cols}
                        status={status}
                        onOpenCell={openCell}
                        onToggleFlag={toggleFlag}
                    />
                )}
            </div>
        </div>
    );
};

export default MinesweeperGame;