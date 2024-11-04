const gameBoard = (function GameBoard() {
    // board is 9 cells. Cell 0,1,2 are the top 3.
    // cell 3, 4, 5 are the middle and cells 6, 7, 8 are the bottom
    const board = new Array(9);
    board.fill(null);

    /**
     * 
     * @param {*} player 
     * @param {*} cellNum 
     * @param {*} imgEl 
     * @returns false if the cell is not free to play on
     */
    const play = (player, cellNum, imgEl) => {
        if (!board[cellNum]) {
            //if this cell is free to play on then:
            imgEl.style.opacity = "1";
            board[cellNum] = player.mark;
            return true;
        } else {
            return false;
        }
    }

    const reset = (imgList) => {
        board.fill(null);

        //clear the DOM too
        imgList.forEach(imgEl => {
            imgEl.style.opacity = "0";
        });
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
        for (let i = 0; i < winningPatterns.length; i++) {
            console.log(winningPatterns[i]);
            if (pattern.match(new RegExp(winningPatterns[i]))) {
                return true;
            }
        }
        return false;
    }

    // a tie is when the board is full (we assume that hasWinningRow was checked earlier)
    const hasTieGame = () => {
        return board.filter(el => el === null).length === 0;
    }
    return { board, play, hasWinningRow, reset, hasTieGame };
})();

function Player(name, mark, element) {
    return { name, mark, element };
}

const controller = (function Controller() {

    const boardEl = document.querySelector("#board");
    const legendEl = document.querySelector("legend");
    const resetImg = document.querySelector("#reset");
    const player0 = document.querySelector("#player0");
    const player1 = document.querySelector("#player1");

    const players = [new Player("Player 1", "X", player0), new Player("Player 2", "O", player1)];

    function setPlayerName(e) {
        const targetID = e.target.getAttribute("id");
        if (targetID == "player0") {
            players[0].name = e.target.value;
        } else {
            players[1].name = e.target.value;
        }
    }
    player0.addEventListener("change", setPlayerName);
    player1.addEventListener("change", setPlayerName);

    let currentPlayer = 0; // zero is player 0, while 1 is player 
    let turns = 0;
    let disableClicks = false;

    /**
     * 
     * @param {*} flag 1 if the game should be called for a winner, 2 if it's a tie, 0 if restarting
     * @param {*} name the name of the winner (optional param)
     */
    function gameOver(flag, name) {
        const gameOverMsg = document.querySelector("#game-over");
        const tieGameMsg = document.querySelector("#tie-game");
        if (flag > 0) {
            document.querySelectorAll(".cell").forEach(el => el.style.opacity = "0.4");
        }
        if (flag === 1) {
            const winnersNameEl = document.querySelector("#winners-name");
            winnersNameEl.innerText = name;
            gameOverMsg.classList.add("blink-me");
        } else if (flag === 2) {
            tieGameMsg.classList.add("blink-me");
        }
        else {
            gameOverMsg.style.opacity = "0";
            tieGameMsg.style.opacity = "0";
            gameOverMsg.classList.remove("blink-me");
            tieGameMsg.classList.remove("blink-me");
            document.querySelectorAll(".cell").forEach(el => el.style.opacity = "1");
        }
    }

    /**
     * if player 0 is the current player, then make the input background change color to reflect that
     * @param {*} currentPlayer index
     */
    function togglePlayer(currentPlayer) {
        if (currentPlayer === 0) {
            players[0].element.classList.add("current-player");
            players[1].element.classList.remove("current-player");
        } else {
            players[1].element.classList.add("current-player");
            players[0].element.classList.remove("current-player");
        }
    }

    boardEl.addEventListener("click", (e) => {
        e.preventDefault();

        //if cell is clicked and is empty, then
        //make either O or X show up
        //which shows is depending on the current player's turn?

        //first figure out which cell was clicked and grab its x/o img elements
        const xMark = e.target.parentElement.lastElementChild;
        const oMark = e.target.parentElement.firstElementChild;
        let imgEl = oMark;
        const parentEl = e.target.parentElement;

        if (e.target.getAttribute("id") === "reset") {
            turns = 0;
            currentPlayer = 0;
            disableClicks = false;
            gameOver(false);
            gameBoard.reset(document.querySelectorAll(".cell img"));
            togglePlayer(currentPlayer);
        } else {
            if (disableClicks) {
                return;
            }
            const cellNum = parseInt(parentEl.getAttribute("data-loc"));
            if (cellNum >= 0) {
                if (players[currentPlayer].mark == "X") {
                    imgEl = xMark;
                }
                if (gameBoard.play(players[currentPlayer], cellNum, imgEl)) {
                    turns++;

                    if (turns >= 5) {
                        //check if someone won yet
                        if (gameBoard.hasWinningRow(players[currentPlayer].mark)) {
                            gameOver(1, players[currentPlayer].name);
                            disableClicks = true;
                        } else if (gameBoard.hasTieGame(players[currentPlayer].mark)) {
                            gameOver(2, players[currentPlayer].name);
                            disableClicks = true;
                        }
                    }
                    //toggle player
                    currentPlayer = currentPlayer ? 0 : 1;
                    togglePlayer(currentPlayer);
                }
            }
        }
    });



})();