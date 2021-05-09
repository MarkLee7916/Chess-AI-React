import { Pos, Move, isOnBoard, SIZE } from "./board";

export const enum PieceType {
    Pawn,
    Rook,
    Bishop,
    Knight,
    King,
    Queen
}

export const enum Team {
    White,
    Black
}

export type Piece = {
    team: Team,
    type: PieceType
}

// Map a piece onto the function that generates all the possible moves it can make
export const pieceToGenerateMoveList = new Map<PieceType, Function>([
    [PieceType.Rook, generateRookMoves],
    [PieceType.Bishop, generateBishopMoves],
    [PieceType.Queen, generateQueenMoves],
    [PieceType.Knight, generateKnightMoves],
    [PieceType.King, generateKingMoves],
    [PieceType.Pawn, generatePawnMoves]
]);

export function isSamePiece(piece1: Piece, piece2: Piece) {
    return piece1.team === piece2.team && piece1.type === piece2.type;
}

function generateRookMoves(startPos: Pos) {
    const moves: Move[] = [];

    for (let jumpSize = 0; jumpSize < SIZE; jumpSize++) {
        addPositionToMoveList(moves, startPos, { row: startPos.row - jumpSize, col: startPos.col });
        addPositionToMoveList(moves, startPos, { row: startPos.row + jumpSize, col: startPos.col });
        addPositionToMoveList(moves, startPos, { row: startPos.row, col: startPos.col + jumpSize });
        addPositionToMoveList(moves, startPos, { row: startPos.row, col: startPos.col - jumpSize });
    }

    return moves;
}

function generateBishopMoves(startPos: Pos) {
    const moves: Move[] = [];

    for (let jumpSize = 0; jumpSize < SIZE; jumpSize++) {
        addPositionToMoveList(moves, startPos, { row: startPos.row - jumpSize, col: startPos.col - jumpSize });
        addPositionToMoveList(moves, startPos, { row: startPos.row - jumpSize, col: startPos.col + jumpSize });
        addPositionToMoveList(moves, startPos, { row: startPos.row + jumpSize, col: startPos.col - jumpSize });
        addPositionToMoveList(moves, startPos, { row: startPos.row + jumpSize, col: startPos.col + jumpSize });
    }

    return moves;
}

function generateQueenMoves(startPos: Pos) {
    return generateRookMoves(startPos).concat(generateBishopMoves(startPos));
}

function generateKnightMoves(startPos: Pos) {
    const moves: Move[] = [];

    addPositionToMoveList(moves, startPos, { row: startPos.row - 2, col: startPos.col - 1 });
    addPositionToMoveList(moves, startPos, { row: startPos.row - 1, col: startPos.col - 2 });
    addPositionToMoveList(moves, startPos, { row: startPos.row - 1, col: startPos.col + 2 });
    addPositionToMoveList(moves, startPos, { row: startPos.row - 2, col: startPos.col + 1 });
    addPositionToMoveList(moves, startPos, { row: startPos.row + 1, col: startPos.col - 2 });
    addPositionToMoveList(moves, startPos, { row: startPos.row + 2, col: startPos.col - 1 });
    addPositionToMoveList(moves, startPos, { row: startPos.row + 1, col: startPos.col + 2 });
    addPositionToMoveList(moves, startPos, { row: startPos.row + 2, col: startPos.col + 1 });

    return moves;
}

function generateKingMoves(startPos: Pos) {
    const moves: Move[] = [];

    addPositionToMoveList(moves, startPos, { row: startPos.row - 1, col: startPos.col - 1 });
    addPositionToMoveList(moves, startPos, { row: startPos.row - 1, col: startPos.col });
    addPositionToMoveList(moves, startPos, { row: startPos.row - 1, col: startPos.col + 1 });
    addPositionToMoveList(moves, startPos, { row: startPos.row, col: startPos.col - 1 });
    addPositionToMoveList(moves, startPos, { row: startPos.row, col: startPos.col + 1 });
    addPositionToMoveList(moves, startPos, { row: startPos.row + 1, col: startPos.col - 1 });
    addPositionToMoveList(moves, startPos, { row: startPos.row + 1, col: startPos.col + 1 });
    addPositionToMoveList(moves, startPos, { row: startPos.row + 1, col: startPos.col });

    return moves;
}

function generatePawnMoves(
    startPos: Pos,
    isPieceInFront: boolean,
    isPieceTwoInFront: boolean,
    isValidLeftTake: boolean,
    isValidRightTake: boolean,
    moveDirection: number) {

    const moves: Move[] = [];
    const startingPawnRow = moveDirection === 1 ? 1 : (SIZE - 2);

    if (isValidLeftTake) {
        addPositionToMoveList(moves, startPos, { row: startPos.row + moveDirection, col: startPos.col - 1 });
    }

    if (isValidRightTake) {
        addPositionToMoveList(moves, startPos, { row: startPos.row + moveDirection, col: startPos.col + 1 });
    }

    if (!isPieceInFront) {
        addPositionToMoveList(moves, startPos, { row: startPos.row + moveDirection, col: startPos.col });
    }

    if (!isPieceTwoInFront && startPos.row == startingPawnRow) {
        addPositionToMoveList(moves, startPos, { row: startPos.row + (moveDirection * 2), col: startPos.col });
    }

    return moves;
}

function addPositionToMoveList(moves: Move[], startPos: Pos, targetPos: Pos) {
    if (isOnBoard(targetPos)) {
        moves.push({ start: startPos, target: targetPos });
    }
}