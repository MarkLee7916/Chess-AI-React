import React from "react";
import { Evaluation } from "../ai/evaluation";
import { Dropdown } from "./Dropdown";

interface Props {
    isVisible: boolean
    hide: () => void
    depth: number,
    aggression: number,
    setEvaluation: (evaluation: Evaluation) => void
    setDepth: (depth: number) => void
    setAggression: (aggression: number) => void
}

export const ConfigAIModal = ({ isVisible, hide, depth, aggression, setEvaluation, setDepth, setAggression }: Props) => {
    return (
        <div className="modal" style={{ visibility: isVisible ? "visible" : "hidden" }}>
            <h1 className="modal-heading">Configure AI</h1>
            <p className="modal-text">Toggle some options to control how the AI behaves</p>

            <div id="config-ai-modal-content">
                <Dropdown
                    initialItem={"Select a board evaluation"}
                    content={new Map<string, () => void>([
                        ["Piece Count Evaluation", () => setEvaluation(Evaluation.PieceCount)],
                        ["Weighted Piece Evaluation", () => setEvaluation(Evaluation.WeightedPieceCount)],
                        ["Weighted Position Evaluation", () => setEvaluation(Evaluation.WeightedBoardPositions)],
                    ])}
                />

                <div className="slider-container">
                    <label htmlFor="size-slider">
                        Toggle aggressiveness
                    </label>

                    <input
                        type="range"
                        id="size-slider"
                        value={aggression}
                        min={0}
                        max={200}
                        onChange={event => setAggression(parseInt(event.target.value))}
                    />

                    <label htmlFor="size-slider">
                        x{aggression / 100}
                    </label>
                </div>

                <div className="slider-container">
                    <label htmlFor="size-slider">
                        Toggle number of moves AI looks ahead
                    </label>

                    <input
                        type="range"
                        id="size-slider"
                        value={depth}
                        min={1}
                        max={3}
                        onChange={event => setDepth(parseInt(event.target.value))}
                    />

                    <label htmlFor="size-slider">
                        {depth}
                    </label>
                </div>
            </div>

            <button className="modal-button modal-bottom-right" onClick={hide}>Close</button>
        </div>
    );
}