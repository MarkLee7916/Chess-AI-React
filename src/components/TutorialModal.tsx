import React, { useEffect, useState } from "react"

interface Props {
    isVisible: boolean
    hide: () => void
}

export const TutorialModal = ({ isVisible, hide }: Props) => {
    const [currentModal, setModal] = useState(0);

    // When user reopens modal, reset slide back to the first one
    useEffect(() =>
        setModal(0)
        , [isVisible])

    const modals = [
        <div className="modal">
            <h1 className="modal-heading">Chess with AI</h1>
            <p className="modal-text">
                Welcome! This mini-tutorial will explain what this app does and walk you through the features
            </p>
            <p className="modal-text">
                As a quick summary, this app allows you to play chess against a configurable AI
            </p>
            <p className="modal-text">
                It also keeps track of the move history, and allows you to save games by copying and pasting the history
            </p>

            <img src="assets/screenshot.png" className="modal-image"></img>

            <button className="modal-bottom-left modal-button" onClick={hide}>Skip Tutorial</button>
            <button className="modal-bottom-right modal-button" onClick={nextPage}>Next</button>
        </div>,

        <div className="modal">
            <h1 className="modal-heading">How to Play</h1>
            <p className="modal-text">
                PC: Drag and drop your teams piece onto another tile, and it will execute a move
            </p>

            <p className="modal-text">
                PC and Mobile: Click the tile you want to move from, and then click the tile you want to move to
            </p>

            <p className="modal-text">
                When you start to move a tile, it will highlight the tiles you can legally move to in green
            </p>

            <img src="assets/movepiece.png" className="modal-image"></img>

            <button className="modal-bottom-left modal-button" onClick={hide}>Skip Tutorial</button>
            <button className="modal-second-bottom-right modal-button" onClick={prevPage}>Previous</button>
            <button className="modal-bottom-right modal-button" onClick={nextPage}>Next</button>
        </div>,

        <div className="modal">
            <h1 className="modal-heading">Configuring the AI</h1>
            <p className="modal-small-text">
                The dropdown menu allows you to control how the AI estimates whether a given board is in its favour or not
            </p>

            <p className="modal-small-text">
                A piece count evaluation means that the AI looks at how many of its own pieces are on the board compared to its opponents
            </p>

            <p className="modal-small-text">
                A weighted piece count evaluation takes into account how valuable pieces are, for example a queen is a lot more valuable than
                a pawn
            </p>

            <p className="modal-small-text">
                A weighted position evaluation takes into account where the pieces are in the board. For example pawns are more valuable when
                they're near the end as they can turn into queens, and horses are more effective when in the centre of the board
            </p>

            <p className="modal-small-text">
                You can also configure how many moves the AI will look ahead, as well as its aggression. A high aggression makes the AI value
                its own pieces lower and your pieces higher, so its more likely to sacrifice its pieces to take yours
            </p>

            <button className="modal-bottom-left modal-button" onClick={hide}>Skip Tutorial</button>
            <button className="modal-second-bottom-right modal-button" onClick={prevPage}>Previous</button>
            <button className="modal-bottom-right modal-button" onClick={nextPage}>Next</button>
        </div>,

        <div className="modal">
            <h1 className="modal-heading">Move History</h1>
            <p className="modal-text">
                If you click the button that says "Move History" it will show you a list of every move that has been played
                during this game. You can copy this list, which will become useful if
                you ever want to go back to a certain game
            </p>

            <p className="modal-text">
                If you click "Upload Game", it will send you to a menu where you can paste a move history and get the resulting
                board so you can play on from the history
            </p>

            <button className="modal-bottom-left modal-button" onClick={hide}>Skip Tutorial</button>
            <button className="modal-second-bottom-right modal-button" onClick={prevPage}>Previous</button>
            <button className="modal-bottom-right modal-button" onClick={nextPage}>Next</button>
        </div>,

        <div className="modal">
            <h1 className="modal-heading">That's all folks</h1>
            <p className="modal-text">
                If you enjoyed you can take a look at the source code on
                <a href="https://github.com/MarkLee7916/Chess-AI-React"> GitHub</a>
            </p>

            <img src="assets/code.png" className="modal-image"></img>

            <button className="modal-bottom-left modal-button" onClick={hide}>Skip Tutorial</button>
            <button className="modal-second-bottom-right modal-button" onClick={prevPage}>Previous</button>
            <button className="modal-bottom-right modal-button" onClick={hide}>Finish</button>
        </div>
    ]

    function nextPage() {
        setModal(currentModal => currentModal + 1);
    }

    function prevPage() {
        setModal(currentModal => currentModal - 1);
    }

    return (
        <div id="modal-container" style={{ visibility: isVisible ? "visible" : "hidden" }}>
            {modals[currentModal]}
        </div>
    )
}