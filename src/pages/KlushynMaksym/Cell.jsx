import React from 'react';
import styles from './Minesweeper.module.css';

export default function Cell({ cellData, onClick, onRightClick, rowIndex, colIndex }) {
    let cellClass = styles.cell;
    
    // Додаємо класи зі стилів як у тебе в JS
    if (cellData.state === 'opened') {
        cellClass += ` ${styles.open}`;
        if (cellData.type === 'mine') cellClass += ` ${styles.exploded}`;
        else if (cellData.neighborMines > 0) cellClass += ` ${styles[`num${cellData.neighborMines}`]}`;
    } else if (cellData.state === 'flagged') {
        cellClass += ` ${styles.flag}`;
    }

    // Що всередині клітинки
    let content = '';
    if (cellData.state === 'flagged') content = '🚩';
    else if (cellData.state === 'opened') {
        if (cellData.type === 'mine') content = '💣';
        else if (cellData.neighborMines > 0) content = cellData.neighborMines;
    }

    // Для доступності (Accessibility)
    let ariaLabel = `Рядок ${rowIndex + 1}, стовпець ${colIndex + 1}, `;
    if (cellData.state === 'opened') {
        if (cellData.type === 'mine') ariaLabel += 'відкрита міна';
        else if (cellData.neighborMines > 0) ariaLabel += `відкрита, ${cellData.neighborMines} мін навколо`;
        else ariaLabel += 'відкрита, безпечна';
    } else if (cellData.state === 'flagged') ariaLabel += 'з прапорцем';
    else ariaLabel += 'закрита';

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