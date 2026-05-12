import React from 'react';
import styles from './Minesweeper.module.css';
import { CELL_STATE, CELL_CONTENT } from './constants';

export default function Cell({ cellData, onClick, onRightClick, rowIndex, colIndex }) {
    const isOpened = cellData.state === CELL_STATE.OPENED;
    const isFlagged = cellData.state === CELL_STATE.FLAGGED;
    const isMine = cellData.type === CELL_CONTENT.MINE;
    const hasNeighbors = cellData.neighborMines > 0;

    // Декларативне формування класів
    const cellClass = `
        ${styles.cell} 
        ${isOpened ? styles.open : ''} 
        ${isOpened && isMine ? styles.exploded : ''} 
        ${isFlagged ? styles.flag : ''} 
        ${isOpened && !isMine && hasNeighbors ? styles[`num${cellData.neighborMines}`] : ''}
    `.trim();

    // Контент всередині
    let content = '';
    if (isFlagged) content = '🚩';
    else if (isOpened) {
        if (isMine) content = '💣';
        else if (hasNeighbors) content = cellData.neighborMines;
    }

    // Доступність
    let ariaLabel = `Рядок ${rowIndex + 1}, стовпець ${colIndex + 1}, `;
    if (isOpened) {
        if (isMine) ariaLabel += 'відкрита міна';
        else if (hasNeighbors) ariaLabel += `відкрита, ${cellData.neighborMines} мін навколо`;
        else ariaLabel += 'відкрита, безпечна';
    } else if (isFlagged) {
        ariaLabel += 'з прапорцем';
    } else {
        ariaLabel += 'закрита';
    }

    return (
        <button
            type="button"
            className={cellClass}
            onClick={onClick}
            onContextMenu={onRightClick}
            aria-label={ariaLabel}
        >
            {content}
        </button>
    );
}