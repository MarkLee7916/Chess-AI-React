import React from "react";

interface Props {
    moveHistory: string[]
    isVisible: boolean
    hide: () => void
}

export const MoveHistoryModal = ({ moveHistory, isVisible, hide }: Props) => {
    return (
        <div className="modal" id="move-history-modal" style={{ visibility: isVisible ? "visible" : "hidden" }}>
            <h1 className="modal-heading">Move History</h1>

            {moveHistory.map((move, index) =>
                <span key={index} className="modal-dense-text">
                    {`${move}${index < moveHistory.length - 1 ? "," : ""}`}
                </span>
            )}

            <button className="modal-button modal-bottom-right" onClick={hide}>Close</button>
        </div>
    );
}