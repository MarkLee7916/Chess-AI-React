import { canMove, convertMoveHistoryStrToState, isChecked } from "../src/game/game";
import { Team } from "../src/game/piece";

testCheckmatedBoard();
testCheckedBoard();
testNoncheckedBoard();

function testCheckmatedBoard() {
    const blackCheckmatedBoard = convertMoveHistoryStrToState(
        "E2-E4,F7-F5,E4-F5,G7-G6,F5-G6,B8-C6,G6-H7,C6-B8,D1-H5"
    ).board;

    console.assert(
        !canMove(Team.Black, blackCheckmatedBoard),
        "Black should be checkmated, but it can move"
    );
    console.assert(
        isChecked(Team.Black, blackCheckmatedBoard),
        "Black should be checked, but it's not"
    );
}

function testCheckedBoard() {
    const blackCheckedBoard = convertMoveHistoryStrToState(
        "E2-E4,D7-D5,D1-H5,D5-E4,F2-F3,G7-G6,H5-G6,E7-E6,G6-F7,E8-F7,E1-F2,G8-H6,G1-H3,H6-F5,H3-F4,F5-H4,F4-H5,F7-E7,H5-G7,E7-D6,G7-F5,D6-D5,B1-C3"
    ).board;

    console.assert(
        canMove(Team.Black, blackCheckedBoard),
        "Black should be able to move, but it can can't"
    );
    console.assert(
        isChecked(Team.Black, blackCheckedBoard),
        "Black should be checked, but it's not"
    );
}

function testNoncheckedBoard() {
    const nonCheckedBoard = convertMoveHistoryStrToState(
        "E2-E4,D7-D5,D1-H5,D5-E4,F2-F3,G7-G6,H5-G6,E7-E6,G6-F7,E8-F7,E1-F2,G8-H6,G1-H3,H6-F5,H3-F4,F5-H4,F4-H5,F7-E7,H5-G7,E7-D6,G7-F5,D6-D5,B1-C3,D5-C5"
    ).board;

    console.assert(
        canMove(Team.Black, nonCheckedBoard),
        "Black should be able to move, but it can can't"
    );
    console.assert(
        !isChecked(Team.Black, nonCheckedBoard),
        "Black should be checked, but it's not"
    );

    console.assert(
        canMove(Team.White, nonCheckedBoard),
        "White should be able to move, but it can can't"
    );
    console.assert(
        !isChecked(Team.White, nonCheckedBoard),
        "White should be checked, but it's not"
    );
}