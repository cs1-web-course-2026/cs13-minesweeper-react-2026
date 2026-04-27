import React from 'react';
import styles from './Cell.module.css';

const Cell = ({ data, onOpen, onFlag }) => {
  
  const renderContent = () => {
    if (data.state === 'closed') return null; 
    if (data.state === 'flagged') return '🚩'; 
    if (data.type === 'mine') return '💣';     
    if (data.neighborMines > 0) return data.neighborMines; 
    return null; 
  };

  const getCellClassName = () => {
    let classes = [styles.cell];
    if (data.state === 'open') classes.push(styles.revealed);
    if (data.state === 'flagged') classes.push(styles.flag);
    if (data.type === 'mine' && data.state === 'open') classes.push(styles.exploded);
    if (data.neighborMines > 0 && data.state === 'open') {
        classes.push(styles[`number-${data.neighborMines}`]);
    }
    return classes.join(' ');
  };

  return (
    <button 
      className={getCellClassName()}
      onClick={onOpen} 
      onContextMenu={(e) => {
        e.preventDefault(); 
        onFlag(); 
      }}
    >
      {renderContent()}
    </button>
  );
};

export default Cell;