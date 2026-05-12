export const GAME_STATUS = {
    PROCESS: 'process',
    WIN: 'win',
    LOSE: 'lose'
};

export const CELL_STATE = {
    CLOSED: 'closed',
    OPENED: 'opened',
    FLAGGED: 'flagged'
};

export const CELL_CONTENT = {
    EMPTY: 'empty',
    MINE: 'mine'
};

export const GAME_SETTINGS = {
    ROWS: 9,
    COLS: 9,
    MINES: 15
};

export const DIRECTIONS = [
    [-1, -1], [-1, 0], [-1, 1],
    [0, -1],           [0, 1],
    [1, -1],  [1, 0],  [1, 1]
];