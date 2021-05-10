import React, { useRef } from "react";
import { isValidMoveHistoryStr } from "../game/game";

interface Props {
    isVisible: boolean
    hide: () => void
    uploadGame: (game: string) => void
}

export const InputGameModal = ({ isVisible, hide, uploadGame }: Props) => {
    const currentInput = useRef("");

    // When user inputs a move history, verify that it's syntactically valid and notify parent component
    function handleInput(event) {
        if (isValidMoveHistoryStr(currentInput.current)) {
            uploadGame(currentInput.current);
        }

        hide();
    }

    return (
        <div className="modal" style={{ visibility: isVisible ? "visible" : "hidden" }}>
            <h1 className="modal-heading">Upload Game</h1>

            <p className="modal-text">
                Paste a list of moves into the box and press "Submit" on the bottom left to get the resulting board
            </p>

            <p className="modal-text">
                Note that this will erase the current game, so you should probably save it beforehand
            </p>

            <textarea onChange={event => currentInput.current = event.target.value} className="modal-input-game" />

            <button className="modal-button modal-bottom-right" onClick={hide}>Close</button>
            <button className="modal-button modal-bottom-left" onClick={handleInput}>Submit</button>
        </div>
    );
}