import { isSamePiece, Piece, PieceType, Team } from "./piece";

export type Pos = {
    row: number
    col: number
};

export type Move = {
    start: Pos
    target: Pos
};

export type GameBoard = Piece[][];

export const SIZE = 8;

export const EMPTY_TILE: Piece = { team: null, type: null };

export const initialBoard = generateInitialBoard();

// A list of all positions on the board, represented as {row, col} tuples
export const positions = generatePositions();

export function isOnBoard({ row, col }) {
    return row >= 0 && row < SIZE && col >= 0 && col < SIZE;
}

export function tileAt(board: GameBoard, { row, col }: Pos) {
    return board[row][col];
}

export function setTileAt(board: GameBoard, { row, col }: Pos, value: Piece) {
    board[row][col] = value;
}

export function isTileClear(board: GameBoard, pos: Pos) {
    return isOnBoard(pos) && isSamePiece(tileAt(board, pos), EMPTY_TILE);
}

export function isTileOccupiedByTeam(team: Team, board: GameBoard, pos: Pos) {
    return isOnBoard(pos) && !isTileClear(board, pos) && tileAt(board, pos).team === team;
}

export function isSameCoord(pos1: Pos, pos2: Pos) {
    return pos1.row === pos2.row && pos1.col === pos2.col;
}

export function moveToString({ start, target }: Move) {
    return `${positionToString(start)}-${positionToString(target)}`;
}

export function stringToMove(moveStr: string) {
    const [startPosStr, targetPosStr] = moveStr.split("-");

    return {
        start: stringToPosition(startPosStr),
        target: stringToPosition(targetPosStr)
    }
}

// Return true if move string follows app's standard syntax
export function isValidMoveStr(moveStr: string) {
    return moveStr.length === 5 && moveStr[2] === "-";
}

// Convert a string representation of a position into a {row, col} tuple that indexes into the board matrix
function stringToPosition(str: string) {
    const colChar = str[0];
    const rowChar = str[1];

    return {
        row: -parseInt(rowChar) + SIZE,
        col: colChar.charCodeAt(0) - 65
    }
}

function positionToString({ row, col }: Pos) {
    return `${String.fromCharCode(("A".charCodeAt(0) + col))}${SIZE - row}`;
}

function generatePositions() {
    const positions: Pos[] = [];

    for (let row = 0; row < SIZE; row++) {
        for (let col = 0; col < SIZE; col++) {
            positions.push({ row, col });
        }
    }

    return positions;
}

function generateInitialBoard() {
    const board = generateEmptyBoard();

    addPiecesForTeam(board, 0, 1, Team.Black);
    addPiecesForTeam(board, SIZE - 1, SIZE - 2, Team.White);

    return board;
}

function addPiecesForTeam(board: GameBoard, backRow: number, frontRow: number, team: Team) {
    board[backRow][0] = { team: team, type: PieceType.Rook };
    board[backRow][7] = { team: team, type: PieceType.Rook };
    board[backRow][1] = { team: team, type: PieceType.Knight };
    board[backRow][6] = { team: team, type: PieceType.Knight };
    board[backRow][2] = { team: team, type: PieceType.Bishop };
    board[backRow][5] = { team: team, type: PieceType.Bishop };
    board[backRow][3] = { team: team, type: PieceType.Queen };
    board[backRow][4] = { team: team, type: PieceType.King };

    for (let col = 0; col < SIZE; col++) {
        board[frontRow][col] = { team: team, type: PieceType.Pawn };
    }
}

function generateEmptyBoard() {
    const board: GameBoard = [];

    for (let row = 0; row < SIZE; row++) {
        board.push([]);

        for (let col = 0; col < SIZE; col++) {
            board[row].push(EMPTY_TILE);
        }
    }

    return board;
}

