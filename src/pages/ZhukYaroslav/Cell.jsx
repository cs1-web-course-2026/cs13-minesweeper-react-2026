import React from 'react';
import styles from './Minesweeper.module.css'; // Підключаємо стилі

export default function Cell({ cellData, row, col, onLeftClick, onRightClick }) {
  // Визначаємо, як буде виглядати клітинка
  let content = '';
  let cellClasses = [styles.cell];

if (cellData.state === 'open') {
    cellClasses.push(styles.revealed); // Додаємо клас відкритої клітинки
    
    if (cellData.type === 'mine') {
      content = '💣';
      cellClasses.push(styles.exploded);
    } else if (cellData.neighborMines > 0) {
      content = cellData.neighborMines;
      // Додаємо клас для кольору цифри (num1, num2 і т.д.)
      cellClasses.push(styles[`num${cellData.neighborMines}`]); 
    }
  } else if (cellData.state === 'flagged') {
    content = '🚩';
    cellClasses.push(styles.flag);
  }

  return (
    <button 
      // Об'єднуємо всі класи в один рядок
      className={cellClasses.join(' ')} 
      // Що робити при лівому кліку
      onClick={() => onLeftClick(row, col)} 
      // Що робити при правому кліку
      onContextMenu={(e) => {
        e.preventDefault(); // Забороняємо браузеру відкривати своє меню
        onRightClick(row, col);
      }}
    >
      {content}
    </button>
  );
}