import React, { useRef, useState } from "react"
import { Evaluation, EvaluationFunction, pieceCountEvaluation, weightedBoardPositionalEvaluation, weightedPieceCountEvaluation } from "../ai/evaluation"
import { minimaxMove } from "../ai/minimaxai"
import { GameBoard, initialBoard, Move, moveToString, Pos } from "../game/board"
import { canMove, convertMoveHistoryStrToGameState, applyMoveToBoard, isChecked, isValidPseudoLegalMove, otherTeam } from "../game/game"
import { Team } from "../game/piece"
import { useLocalStorageState } from "../hooks/useLocalStorageState"
import { deepCopy } from "../utils/utils"
import { Board } from "./Board"
import { ConfigAIModal } from "./configAIModal"
import { InputGameModal } from "./InputGameModal"
import { MoveHistoryModal } from "./MoveHistoryModal"
import { TutorialModal } from "./TutorialModal"

const enum Modal {
    InputGame,
    MoveHistory,
    ConfigAI,
    Tutorial,
    None
}

// Maps each team onto a string that can be displayed on the screen
const teamToString = new Map<Team, string>([
    [Team.Black, "Black"],
    [Team.White, "White"]
]);

// Map an evaluation function enum onto the actual implementation of the algorithm
const evaluationEnumToImplementation = new Map<Evaluation, EvaluationFunction>([
    [Evaluation.PieceCount, pieceCountEvaluation],
    [Evaluation.WeightedBoardPositions, weightedBoardPositionalEvaluation],
    [Evaluation.WeightedPieceCount, weightedPieceCountEvaluation]
]);

export const Game = () => {
    // The current board that is rendered to the screen
    const [board, setBoard] = useLocalStorageState(initialBoard, "board");

    // True if game is currently in play, otherwise false if game has ended
    const [running, setRunning] = useLocalStorageState(true, "running");

    // A list of all the moves that have been played so far, formatted as strings to be displayed
    const [moveHistory, setMoveHistory] = useLocalStorageState([], "movehistory");

    // The message that is currently displayed on the screen
    const [message, setMessage] = useState("Welcome to Chess! Drag and drop your piece to make a move");

    // A modifier that controls how much the AI values taking opponents pieces over preserving it's own
    const [aiAggressionModifier, setAIAggressionModifier] = useLocalStorageState(100, "aggression");

    // The number of moves the AI will look ahead
    const [aiSearchDepth, setAISearchDepth] = useLocalStorageState(3, "depth");

    // The algorithm the AI uses to estimate whether a given board is in it's favour or not
    const [aiEvaluation, setAIEvaluation] = useLocalStorageState(Evaluation.WeightedBoardPositions, "eval");

    // The modal that's currently being displayed on the screen
    const [modalVisible, setModalVisible] = useState(Modal.None);

    // True if user can move (i.e AI isn't currently running), otherwise false
    const canUserMoveRef = useRef(true);

    // Deal with user dropping a tile onto another
    function handleMoveInput(start: Pos, target: Pos) {
        if (running && canUserMoveRef.current) {
            handleMove(Team.White, board, { start, target });
        }
    }

    // If move is valid, deal with the move potentially checking itself, otherwise notify invalid
    function handleMove(teamToMove: Team, board: GameBoard, move: Move) {
        if (isValidPseudoLegalMove(teamToMove, board, move)) {
            const boardFromMove = applyMoveToBoard(board, move);

            handleCheckCase(teamToMove, boardFromMove, move);
        } else {
            setMessage(`Move ${moveToString(move)} is not valid!`);
        }
    }

    // If move checks itself, notify the user, otherwise move must be valid, so update the state needed
    function handleCheckCase(teamToMove: Team, boardFromMove: GameBoard, move: Move) {
        if (isChecked(teamToMove, boardFromMove)) {
            setMessage(`Move ${moveToString(move)} has resulted in a check, please try another move`);
        } else {
            handleSuccessfulMoveCase(teamToMove, boardFromMove, move);
        }
    }

    // For this move, update any state needed and check that the game hasn't been ended
    function handleSuccessfulMoveCase(teamToMove: Team, boardFromMove: GameBoard, move: Move) {
        handleUpdateMoveHistory(move);
        handleMoveMessage(teamToMove, boardFromMove, move);
        handleGameOverCase(teamToMove, boardFromMove);

        setBoard(boardFromMove);

        if (teamToMove === Team.White) {
            makeAIMove(boardFromMove);
        }
    }

    function makeAIMove(boardFromMove: GameBoard) {
        setTimeout(() => {
            canUserMoveRef.current = false;

            const evaluationFunc = evaluationEnumToImplementation.get(aiEvaluation);
            const move = minimaxMove(Team.Black, boardFromMove, aiAggressionModifier, aiSearchDepth, evaluationFunc);

            handleMove(Team.Black, boardFromMove, move);

            canUserMoveRef.current = true;
        }, 0);
    }

    // Append a move onto the move history
    function handleUpdateMoveHistory(move: Move) {
        setMoveHistory(history => {
            const historyCopy = deepCopy(history);

            historyCopy.push(moveToString(move));

            return historyCopy;
        });
    }

    // If game has ended, set running to false and notify the user with the appropiate message
    function handleGameOverCase(teamToMove: Team, boardFromMove: GameBoard) {
        if (!canMove(otherTeam(teamToMove), boardFromMove)) {
            setRunning(false);

            handleGameOverMessage(teamToMove, boardFromMove);
        }
    }

    // Print the appropiate game over message depending on whether game has ended in checkmate or stalemate
    function handleGameOverMessage(teamToMove: Team, boardFromMove: GameBoard) {
        if (isChecked(otherTeam(teamToMove), boardFromMove)) {
            setMessage(`Checkmate! ${teamToString.get(teamToMove)} wins!`);
        } else {
            setMessage("Game has ended in stalemate!");
        }
    }

    // Print the appropiate move message depending on whether a move has checked the opponent
    function handleMoveMessage(teamToMove: Team, boardFromMove: GameBoard, move: Move) {
        if (isChecked(otherTeam(teamToMove), boardFromMove)) {
            setMessage(`${teamToString.get(otherTeam(teamToMove))} has been checked!`);
        } else {
            setMessage(moveToString(move));
        }
    }

    function resetGame() {
        setBoard(initialBoard);
        setRunning(true);
        setMessage("Game Reset!");
        setMoveHistory([]);
    }

    // Given a move history string, parse it and update the game's state to continue on from the history
    function handleUploadGame(moveHistoryStr: string) {
        const { board, teamToMove } = convertMoveHistoryStrToGameState(moveHistoryStr);

        handleStateUpdateOnUpload(board, teamToMove, moveHistoryStr);
    }

    // Update state to continue on from some move history
    function handleStateUpdateOnUpload(board: GameBoard, teamToMove: Team, moveHistoryStr: string) {
        setBoard(board);
        setMoveHistory(moveHistoryStr.split(","));
        setRunning(true);
        setMessage("Game successfully uploaded!");

        handleGameOverCase(teamToMove, board);
    }

    function closeModals() {
        setModalVisible(Modal.None);
    }

    return (
        <div onError={() => location.reload()}>
            <div id="page" style={{ opacity: modalVisible === Modal.None ? "1" : "0.2" }}>
                <div id="menu">
                    <button onClick={() => setModalVisible(Modal.MoveHistory)} className="menu-button">
                        Show Move History
                    </button>

                    <button onClick={() => setModalVisible(Modal.InputGame)} className="menu-button">
                        Upload Game
                    </button>

                    <button onClick={() => setModalVisible(Modal.Tutorial)} className="menu-button">
                        Tutorial
                    </button>

                    <button onClick={() => setModalVisible(Modal.ConfigAI)} className="menu-button">
                        Configure AI
                    </button>

                    <button onClick={resetGame} className="menu-button">
                        Reset Game
                    </button>
                </div>

                <div id="message">{message}</div>

                <Board
                    team={Team.White}
                    running={running}
                    board={board}
                    notifyDrop={handleMoveInput}
                />
            </div>

            <MoveHistoryModal
                isVisible={modalVisible === Modal.MoveHistory}
                moveHistory={moveHistory}
                hide={closeModals}
            />

            <InputGameModal
                uploadGame={handleUploadGame}
                isVisible={modalVisible === Modal.InputGame}
                hide={closeModals}
            />
            <TutorialModal
                isVisible={modalVisible === Modal.Tutorial}
                hide={closeModals}
            />

            <ConfigAIModal
                isVisible={modalVisible === Modal.ConfigAI}
                hide={closeModals}
                depth={aiSearchDepth}
                aggression={aiAggressionModifier}
                setEvaluation={(evaluation: Evaluation) => setAIEvaluation(evaluation)}
                setDepth={(depth: number) => setAISearchDepth(depth)}
                setAggression={(aggression: number) => setAIAggressionModifier(aggression)}
            />
        </div >
    );
}

