const gameBoard = (function GameBoard() {
    // board is 9 cells. Cell 0,1,2 are the top 3.
    // cell 3, 4, 5 are the middle and cells 6, 7, 8 are the bottom
    const board = [];


    // to win a player must fill 3 cells in a row
    // (012), (345), (678), 
    // or fill 3 cells in a column
    // (036), (147), (258)
    // or fill 3 cells on a diagonal
    // (048), (246)
    return { board };
})();

function Player(name, mark) {
    return { name, mark };
}

const controller = (function Controller() {

    const player1 = new Player("Me", "X");
    const player2 = new Player("You", "O");
    let currentPlayer = player1; //for now hardcode

    console.table(gameBoard);

    const boardEl = document.querySelector("#board");
    boardEl.addEventListener("click", () => {
        //if cell is clicked and is empty, then
        //make either O or X show up
        //which shows is depending on the current player's turn?
        
        //first figure out which cell was clicked
        
    });



})();