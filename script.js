const gameBoard = (function GameBoard() {
    // board is 9 cells. Cell 0,1,2 are the top 3.
    // cell 3, 4, 5 are the middle and cells 6, 7, 8 are the bottom
    const board = [null, null, null, null, null, null, null, null, null];

    const play = (player, cellNum, imgEl) => {
        if (!board[cellNum]) {
            //if this cell is free to play on then:
            imgEl.style.opacity = "1";
            board[cellNum] = player.mark;
            console.log(board);
        }
    }
    // to win a player must fill 3 cells in a row
    // (012), (345), (678), 
    // or fill 3 cells in a column
    // (036), (147), (258)
    // or fill 3 cells on a diagonal
    // (048), (246)
    const hasWinningRow = (mark) => {
        const winningPatterns = ["012", ".*345.*", ".*678.*", "0.*3.*6.*", ".*1.*4.*7.*", ".*2.*5.*8", "0.*4.*8", ".*2.*4.*6.*"];
        const pattern = board.reduce((acc, el, i) => {
            if (el === mark) {
                return acc + i;
            } else {
                return acc;
            }
        }, "");
        console.log({ pattern }); //eg. 0248 matches 048 win
        for (let i = 0; i < winningPatterns.length; i++) {
            console.log(winningPatterns[i]);
            if (pattern.match(new RegExp(winningPatterns[i]))) {
                return true;
            }
        }
        return false;
    }
    return { board, play, hasWinningRow };
})();

function Player(name, mark) {
    return { name, mark };
}

const controller = (function Controller() {

    const players = [new Player("XPlayer 0", "X"), new Player("OPlayer 1", "O")];
    let currentPlayer = 0; // zero is player 0, while 1 is player 
    let turns = 0;

    console.table(gameBoard);

    const boardEl = document.querySelector("#board");
    boardEl.addEventListener("click", (e) => {
        e.preventDefault();
        turns++;

        //if cell is clicked and is empty, then
        //make either O or X show up
        //which shows is depending on the current player's turn?

        //first figure out which cell was clicked and grab its x/o img elements
        const xMark = e.target.parentElement.lastElementChild;
        const oMark = e.target.parentElement.firstElementChild;
        let imgEl = oMark;
        if (players[currentPlayer].mark == "X") {
            imgEl = xMark;
        }
        const cellNum = parseInt(e.target.parentElement.getAttribute("data-loc"));
        gameBoard.play(players[currentPlayer], cellNum, imgEl);

        if (turns >= 5) {
            //check if someone won yet
            if (gameBoard.hasWinningRow(players[currentPlayer].mark)) {
                const winnersNameEl = document.querySelector("#winners-name");
                winnersNameEl.innerText = players[currentPlayer].name;
                const gameOverMsg = document.querySelector("#game-over");
                gameOverMsg.style.opacity = "1";
            }
        }
        //toggle player
        currentPlayer = currentPlayer ? 0 : 1;

    });



})();