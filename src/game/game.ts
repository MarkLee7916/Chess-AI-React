import { appendMutate, deepCopy, squashStepFunction } from "../utils/utils";
import { EMPTY_TILE, GameBoard, initialBoard, isSameCoord, isTileClear, isTileOccupiedByTeam, isValidMoveStr, Move, Pos, positions, setTileAt, SIZE, stringToMove, tileAt } from "./board";
import { isSamePiece, pieceToGenerateMoveList, PieceType, Team } from "./piece";

const teamToMoveDirection = new Map<Team, number>([
    [Team.Black, 1],
    [Team.White, -1]
]);

// Generate all moves a team can make for some board, including moves that result in being checked
export function generatePseudoLegalMoves(teamToMove: Team, board: GameBoard) {
    const possibleMoves: Move[] = [];

    positions.forEach(pos => {
        if (isTileOccupiedByTeam(teamToMove, board, pos)) {
            appendMutate(possibleMoves, generatePseudoLegalMovesFromPos(board, pos));
        }
    });

    return possibleMoves;
}

// Generate all moves a team can make for some board, excluding moves that result in being checked
export function generateLegalMoves(teamToMove: Team, board: GameBoard) {
    return filterCheckedMoves(board, generatePseudoLegalMoves(teamToMove, board));
}

// Generate all moves a team can make for some position, including moves that result in being checked
export function generateLegalMovesFromPos(board: GameBoard, pos: Pos) {
    return filterCheckedMoves(board, generatePseudoLegalMovesFromPos(board, pos));
}

// Generate all moves a team can make for some position, excluding moves that result in being checked
export function generatePseudoLegalMovesFromPos(board: GameBoard, pos: Pos) {
    return generateIllegalMovesFromPos(board, pos).filter(move =>
        isValidDestination(board, move) && isClearPath(board, move)
    )
}

// Return true if move follows the rules of chess, excluding moves that result in being checked
export function isValidPseudoLegalMove(team: Team, board: GameBoard, move: Move) {
    return generatePseudoLegalMoves(team, board).some(
        ({ start, target }) =>
            isSameCoord(start, move.start) && isSameCoord(target, move.target)
    );
}

export function otherTeam(team: Team) {
    return team === Team.Black ? Team.White : Team.Black;
}

export function isChecked(team: Team, board: GameBoard) {
    const kingPos = getKingPos(team, board);

    return generatePseudoLegalMoves(otherTeam(team), board).some(({ target }) =>
        isSameCoord(kingPos, target)
    );
}

export function applyMoveToBoard(board: GameBoard, { start, target }: Move) {
    const boardCopy = deepCopy(board);

    setTileAt(boardCopy, target, tileAt(boardCopy, start));
    setTileAt(boardCopy, start, EMPTY_TILE);

    handlePawnToQueenConversion(boardCopy, { start, target });

    return boardCopy;
}

export function canMove(team: Team, board: GameBoard) {
    return filterCheckedMoves(board, generatePseudoLegalMoves(team, board)).length > 0;
}

// Given a history of moves, return the state of the game resulting from applying the moves
export function convertMoveHistoryStrToGameState(moveHistoryStr: string) {
    const splitMoveHistoryStr = convertMoveHistoryStrToMoveStrList(moveHistoryStr);
    const moves = splitMoveHistoryStr.map(str => stringToMove(str));

    let board = deepCopy(initialBoard);

    moves.forEach(move => {
        board = applyMoveToBoard(board, move);
    });

    return { board: board, teamToMove: moves.length % 2 === 0 ? Team.White : Team.Black };
}

// Return true if a move history string follows the app's syntax
export function isValidMoveHistoryStr(moveHistoryStr: string) {
    const splitMoveHistoryStr = convertMoveHistoryStrToMoveStrList(moveHistoryStr);

    return splitMoveHistoryStr.every(moveStr => isValidMoveStr(moveStr));
}

// Parse move history string into a list of move strings
function convertMoveHistoryStrToMoveStrList(moveHistoryStr: string) {
    const minifiedMoveHistoryStr = moveHistoryStr.replace(/[^-,0-9A-Z]/g, "");

    return minifiedMoveHistoryStr.split(",");
}

// Remove any moves from a list that result in being checked
function filterCheckedMoves(board: GameBoard, moves: Move[]) {
    return moves.filter(move => !isChecked(tileAt(board, move.start).team, applyMoveToBoard(board, move)))
}

// Generate any move from a position that's possible 
function generateIllegalMovesFromPos(board: GameBoard, pos: Pos) {
    const moveListFunc = pieceToGenerateMoveList.get(tileAt(board, pos).type);

    if (tileAt(board, pos).type === PieceType.Pawn) {
        return moveListFunc.apply(null, getPawnInformation(board, pos));
    } else {
        return moveListFunc(pos);
    }
}

// If piece at target is a pawn at end of board, convert to a queen
function handlePawnToQueenConversion(board: GameBoard, { target }: Move) {
    if (tileAt(board, target).type === PieceType.Pawn && (target.row === 0 || target.row === SIZE - 1)) {
        replacePawnWithQueen(board, target);
    }
}

function replacePawnWithQueen(board: GameBoard, target: Pos) {
    const pawnTeam = tileAt(board, target).team;

    setTileAt(board, target, { team: pawnTeam, type: PieceType.Queen });
}

function getKingPos(team: Team, board: GameBoard) {
    return positions.find(
        pos => isTileOccupiedByTeam(team, board, pos) && tileAt(board, pos).type === PieceType.King
    );
}

// Get the information needed to tell a pawn where it can move
function getPawnInformation(board: GameBoard, pawnPos: Pos) {
    const pawnTeam = tileAt(board, pawnPos).team;
    const moveDirection = teamToMoveDirection.get(pawnTeam);

    return [
        pawnPos,
        !isTileClear(board, { row: pawnPos.row + moveDirection, col: pawnPos.col }),
        !isTileClear(board, { row: pawnPos.row + 2 * moveDirection, col: pawnPos.col }),
        isTileOccupiedByTeam(otherTeam(pawnTeam), board, { row: pawnPos.row + moveDirection, col: pawnPos.col - 1 }),
        isTileOccupiedByTeam(otherTeam(pawnTeam), board, { row: pawnPos.row + moveDirection, col: pawnPos.col + 1 }),
        moveDirection
    ];
}

// Compute the tiles that lie within move's path and verify that they're not occupied
function isClearPath(board: GameBoard, move: Move) {
    return drawPath(board, move).every(pos => isTileClear(board, pos));
}

// Destination is valid if target tile is either empty or occupied by opposing team's piece
function isValidDestination(board: GameBoard, { start, target }: Move) {
    return isSamePiece(tileAt(board, target), EMPTY_TILE) || tileAt(board, start).team !== tileAt(board, target).team;
}

// Return list of all positions that lie between a move, for example drawPath((0, 0) -> (3, 0)) returns [(1, 0), (2, 0)]
function drawPath(board: GameBoard, move: Move) {
    const path = [];
    const { start, target } = deepCopy(move);

    if (tileAt(board, start).type !== PieceType.Knight) {
        const { rowIncrement, colIncrement } = getDirectionsFromMove({ start, target });

        while (!isSameCoord(start, target)) {
            path.push(deepCopy(start));

            start.row += rowIncrement;
            start.col += colIncrement;
        }
    }

    return path.slice(1);
}

// Given a move, return the directions the piece had to head in to make the move
function getDirectionsFromMove({ start, target }: Move) {
    return {
        rowIncrement: squashStepFunction(target.row - start.row),
        colIncrement: squashStepFunction(target.col - start.col)
    }
}
