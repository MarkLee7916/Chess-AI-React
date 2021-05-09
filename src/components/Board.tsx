import React, { useState } from "react";
import { GameBoard, isSameCoord, isTileOccupiedByTeam, Pos } from "../game/board";
import { generateLegalMovesFromPos } from "../game/game";
import { Piece, Team } from "../game/piece";
import { Tile } from "./Tile";

interface Props {
    team: Team
    running: boolean
    board: GameBoard
    notifyDrop: (fromPos: Pos, toPos: Pos) => void
}

export const Board = ({ team, running, board, notifyDrop }: Props) => {
    // A list of positions that the currently selected piece can legally move to
    const [highlightedTargetPositions, setHighlightedTargetPositions] = useState([]);

    // Given a position, compute positions it can legally move to and highlight them
    function highlightTargetPositions(pos: Pos) {
        if (isTileOccupiedByTeam(team, board, pos)) {
            setHighlightedTargetPositions(generateLegalMovesFromPos(board, pos));
        }
    }

    // Remove all position highlights from the board 
    function clearHighlightedTargetPositions() {
        setHighlightedTargetPositions([]);
    }

    // Return true if a position is highlighted (i.e the currently selected piece can legally move to it)
    function isPositionHighlighted(pos: Pos) {
        return highlightedTargetPositions.some(({ start, target }) =>
            isSameCoord(target, pos) && isTileOccupiedByTeam(team, board, start)
        );
    }

    function renderRow(row: Piece[], rowIndex: number) {
        return (
            <tr className="row" key={rowIndex} style={{ opacity: running ? "1" : "0.5" }}>
                {row.map((piece, colIndex) =>
                    <Tile
                        pos={{ row: rowIndex, col: colIndex }}
                        isHighlighted={isPositionHighlighted({ row: rowIndex, col: colIndex })}
                        highlightTilesToMove={highlightTargetPositions}
                        clearHighlightedTilesToMove={clearHighlightedTargetPositions}
                        piece={piece}
                        notifyDrop={notifyDrop}
                        key={`${rowIndex}-${colIndex}`}
                    />
                )}
            </tr>
        );
    }

    return (
        <>
            <table id="board">
                <tbody>
                    {board.map((row, index) => renderRow(row, index))}
                </tbody>
            </table>
        </>
    );
}