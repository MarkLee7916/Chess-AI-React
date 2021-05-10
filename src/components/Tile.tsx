import React from "react";
import { EMPTY_TILE, Pos } from "../game/board";
import { Team, Piece, PieceType, isSamePiece } from "../game/piece";
import { HashMap } from "../utils/hashmap";

interface Props {
    piece: Piece
    isHighlighted: boolean
    pos: Pos
    notifyDrop: (fromPos: Pos, toPos: Pos) => void
    highlightTilesToMove: (pos: Pos) => void
    clearHighlightedTilesToMove: () => void
    notifyClicked: (pos: Pos) => void
}

const pieceToUnicode = new HashMap<Piece, string>([
    [{ team: Team.White, type: PieceType.Bishop }, "♗"],
    [{ team: Team.Black, type: PieceType.Bishop }, "♝"],
    [{ team: Team.White, type: PieceType.Pawn }, "♙"],
    [{ team: Team.Black, type: PieceType.Pawn }, "♟︎"],
    [{ team: Team.White, type: PieceType.King }, "♔"],
    [{ team: Team.Black, type: PieceType.King }, "♚"],
    [{ team: Team.White, type: PieceType.Queen }, "♕"],
    [{ team: Team.Black, type: PieceType.Queen }, "♛"],
    [{ team: Team.White, type: PieceType.Knight }, "♘"],
    [{ team: Team.Black, type: PieceType.Knight }, "♞"],
    [{ team: Team.White, type: PieceType.Rook }, "♖"],
    [{ team: Team.Black, type: PieceType.Rook }, "♜"],
]);

export const Tile = ({ piece, pos, isHighlighted, notifyDrop, highlightTilesToMove, clearHighlightedTilesToMove, notifyClicked }: Props) => {
    function getTileBackgroundColor() {
        if (isHighlighted) {
            return "#32CD32";
        } else if (pos.row % 2 === pos.col % 2) {
            return "white";
        } else {
            return "gainsboro";
        }
    }

    // When user drags a piece, save it for when they drop it
    function handleDragStart(event) {
        highlightTilesToMove(pos);

        event.dataTransfer.setData("draggedFrom", JSON.stringify(pos));
    }

    // When user drops, notify main game component
    function handleDrop(event) {
        clearHighlightedTilesToMove();

        notifyDrop(JSON.parse(event.dataTransfer.getData("draggedFrom")), pos);
    }

    return (
        <td
            className="tile"
            style={{ backgroundColor: getTileBackgroundColor() }}
            draggable="true"
            onClick={() => notifyClicked(pos)}
            onDragStart={handleDragStart}
            onDragOver={event => event.preventDefault()}
            onDragEnter={event => event.preventDefault()}
            onDrop={handleDrop}
        >
            {isSamePiece(piece, EMPTY_TILE) ? "" : pieceToUnicode.get(piece)}
        </td >
    );
}