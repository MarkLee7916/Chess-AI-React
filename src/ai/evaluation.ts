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
    return positions.reduce((totalScore: number, pos: Pos) => {
        if (isTileOccupiedByTeam(team, board, pos)) {
            return totalScore + 1;
        } else if (isTileOccupiedByTeam(otherTeam(team), board, pos)) {
            return totalScore - (1 * (aggression / 100));
        } else {
            return totalScore;
        }
    }, 0);
}

export function weightedPieceCountEvaluation(team: Team, board: GameBoard, aggression: number) {
    return positions.reduce((totalScore: number, pos: Pos) => {
        const pieceWeight = pieceToWeight.get(tileAt(board, pos).type);

        if (isTileOccupiedByTeam(team, board, pos)) {
            return totalScore + pieceWeight;
        } else if (isTileOccupiedByTeam(otherTeam(team), board, pos)) {
            return totalScore - (pieceWeight * (aggression / 100));
        } else {
            return totalScore;
        }
    }, 0);
}

export function weightedBoardPositionalEvaluation(team: Team, board: GameBoard, aggression: number) {
    return positions.reduce((totalScore: number, pos: Pos) => {
        if (!isTileClear(board, pos)) {
            const pieceWeight = pieceToWeight.get(tileAt(board, pos).type);
            const boardPosWeightings = pieceToBoardWeightings.get(tileAt(board, pos).type);
            const boardPosWeightingsForTeam = team === Team.White ? boardPosWeightings : boardPosWeightings.reverse();

            if (isTileOccupiedByTeam(team, board, pos)) {
                return totalScore + pieceWeight + boardPosWeightingsForTeam[pos.row][pos.col];
            } else if (isTileOccupiedByTeam(otherTeam(team), board, pos)) {
                return totalScore - ((pieceWeight + boardPosWeightingsForTeam[pos.row][pos.col]) * (aggression / 100));
            }
        }

        return totalScore;
    }, 0);
}