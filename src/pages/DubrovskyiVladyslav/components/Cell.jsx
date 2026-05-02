import React from 'react';
import styles from '../Minesweeper.module.css';
import { CELL_STATE, CELL_TYPE, STATUS } from '../constants';

const Cell = ({ data, row, col, onOpen, onFlag, gameStatus }) => {
    let className = styles.cell;
    let content = '';

    if (data.state === CELL_STATE.OPENED) {
        className += ` ${styles.open}`;
        if (data.type === CELL_TYPE.MINE) {
            className += ` ${styles.mine}`;
            if (gameStatus === STATUS.LOSE) {
                className += ` ${styles.exploded}`;
            }
        } else if (data.neighborMines > 0) {
            content = data.neighborMines;
            className += ` ${styles[`num${data.neighborMines}`]}`;
        }
    } else if (data.state === CELL_STATE.FLAGGED) {
        className += ` ${styles.flag}`;
    }

    const handleContextMenu = (e) => {
        e.preventDefault();
        onFlag(row, col);
    };

    return (
        <button
            className={className}
            type="button"
            onClick={() => onOpen(row, col)}
            onContextMenu={handleContextMenu}
        >
            {content}
        </button>
    );
};

export default Cell;