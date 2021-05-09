import { GameBoard, Move } from "../game/board";
import { generatePseudoLegalMoves, applyMoveToBoard, otherTeam } from "../game/game";
import { Team } from "../game/piece";
import { EvaluationFunction } from "./evaluation";

export function minimaxMove(
    team: Team,
    board: GameBoard,
    aggression: number,
    maxDepth: number,
    evaluation: EvaluationFunction
) {
    let maxValue = Number.NEGATIVE_INFINITY;
    let bestMove: Move;

    generatePseudoLegalMoves(team, board).forEach(move => {
        const nextBoard = applyMoveToBoard(board, move);
        const value = min(
            otherTeam(team),
            nextBoard,
            Number.NEGATIVE_INFINITY,
            Number.POSITIVE_INFINITY,
            1,
            team,
            aggression,
            maxDepth,
            evaluation
        );

        if (value > maxValue) {
            maxValue = value;
            bestMove = move;
        }
    });

    return bestMove;
}

function max(
    team: Team,
    board: GameBoard,
    alpha: number,
    beta: number,
    depth: number,
    originalTeam: Team,
    aggression: number,
    maxDepth: number,
    evaluation: EvaluationFunction
) {
    if (depth === maxDepth) {
        return evaluation(originalTeam, board, aggression);
    } else {
        generatePseudoLegalMoves(team, board).forEach(move => {
            const nextBoard = applyMoveToBoard(board, move);

            alpha = Math.max(
                alpha,
                min(
                    otherTeam(team),
                    nextBoard,
                    alpha,
                    beta,
                    depth + 1,
                    originalTeam,
                    aggression,
                    maxDepth,
                    evaluation
                )
            );

            if (alpha >= beta) {
                return;
            }
        });

        return alpha;
    }
}

function min(
    team: Team,
    board: GameBoard,
    alpha: number,
    beta: number,
    depth: number,
    originalTeam: Team,
    aggression: number,
    maxDepth: number,
    evaluation: EvaluationFunction
) {
    if (depth === maxDepth) {
        return evaluation(originalTeam, board, aggression);
    } else {
        generatePseudoLegalMoves(team, board).forEach(move => {
            const nextBoard = applyMoveToBoard(board, move);

            beta = Math.min(
                beta,
                max(
                    otherTeam(team),
                    nextBoard,
                    alpha,
                    beta,
                    depth + 1,
                    originalTeam,
                    aggression,
                    maxDepth,
                    evaluation
                )
            );

            if (alpha >= beta) {
                return;
            }
        });

        return beta;
    }
}
