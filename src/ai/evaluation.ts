import { GameBoard, isTileClear, isTileOccupiedByTeam, Pos, positions, tileAt } from "../game/board";
import { otherTeam } from "../game/game";
import { Team } from "../game/piece";
import { pieceToBoardWeightings, pieceToWeight } from "./weightings";

export const enum Evaluation {
    PieceCount,
    WeightedPieceCount,
    WeightedBoardPositions
}

export type EvaluationFunction = (team: Team, board: GameBoard, aggression: number) => number

export function pieceCountEvaluation(team: Team, board: GameBoard, aggression: number) {
    return genericEvaluate(team, board, aggression, _ => 1);
}

export function weightedPieceCountEvaluation(team: Team, board: GameBoard, aggression: number) {
    return genericEvaluate(team, board, aggression, (pos: Pos) => pieceToWeight.get(tileAt(board, pos).type));
}

export function weightedBoardPositionalEvaluation(team: Team, board: GameBoard, aggression: number) {
    return genericEvaluate(team, board, aggression, (pos: Pos) => {
        const pieceWeight = pieceToWeight.get(tileAt(board, pos).type);
        const boardPosWeightings = pieceToBoardWeightings.get(tileAt(board, pos).type);
        const boardPosWeightingsForTeam = team === Team.White ? boardPosWeightings : boardPosWeightings.reverse();

        return pieceWeight + boardPosWeightingsForTeam[pos.row][pos.col];
    });
}

function genericEvaluate(team: Team, board: GameBoard, aggression: number, score: (pos: Pos) => number) {
    return positions.reduce((totalScore: number, pos: Pos) => {
        if (isTileClear(board, pos)) {
            return totalScore;
        }

        if (isTileOccupiedByTeam(team, board, pos)) {
            return totalScore + score(pos);
        }

        if (isTileOccupiedByTeam(otherTeam(team), board, pos)) {
            return totalScore - (score(pos) * (aggression / 100));
        }
    }, 0);
}