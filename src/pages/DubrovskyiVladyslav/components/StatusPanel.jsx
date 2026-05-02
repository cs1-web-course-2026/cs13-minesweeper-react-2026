import React from 'react';
import styles from '../Minesweeper.module.css';
import { STATUS } from '../constants';

const StatusPanel = ({ minesLeft, gameTime, status, onReset }) => {
    const format = (n) => String(Math.max(0, n)).padStart(3, '0');

    let face = '🙂';
    if (status === STATUS.WIN) face = '😎';
    if (status === STATUS.LOSE) face = '😵';

    return (
        <header className={styles.gameHeader}>
            <div className={styles.statusPanel}>
                <div className={styles.lcdDisplay}>{format(minesLeft)}</div>
                <button
                    className={styles.resetBtn}
                    onClick={onReset}
                    type="button"
                >
                    {face}
                </button>
                <div className={styles.lcdDisplay}>{format(gameTime)}</div>
            </div>
        </header>
    );
};

export default StatusPanel;