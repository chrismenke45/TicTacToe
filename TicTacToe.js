const spotChosen = (boardSquare, user) => { //this function marks the gameboard after it is selected
    boardSquare.location.innerHTML = user.type; //put visible mark on board
    boardSquare.filled = true;// make board area no longer available
    if (user.type === 'x') { 
        boardSquare.mark = 1; //give value so scoring can be possible
        user.type = 'o'; // make it so next move is opposit mark
    } else if (user.type === 'o') {
        boardSquare.mark = -1; //give value so scoring can be possible
        user.type = 'x';// make it so next move is opposit mark
    }
}
const checkForWin = (boardSquares) => { // this checks for boardSquare.mark with 3 in a row
    let left = boardSquares[0].mark + boardSquares[1].mark + boardSquares[2].mark; //check left column
    let midVertical = boardSquares[3].mark + boardSquares[4].mark + boardSquares[5].mark; //check middle column
    let right = boardSquares[6].mark + boardSquares[7].mark + boardSquares[8].mark; // check right column
    let top = boardSquares[0].mark + boardSquares[3].mark + boardSquares[6].mark;// check top row
    let midHorizontal = boardSquares[1].mark + boardSquares[4].mark + boardSquares[7].mark;// check middle row
    let bottom = boardSquares[2].mark + boardSquares[5].mark + boardSquares[8].mark;// check bottom row
    let negDiagonal = boardSquares[0].mark + boardSquares[4].mark + boardSquares[8].mark; //check diagonal with negative slope
    let posDiagonal = boardSquares[2].mark + boardSquares[4].mark + boardSquares[6].mark;// check diagonal with positive slope
    if (left == 3 || midVertical == 3 || right == 3 || top == 3 || midHorizontal == 3 || bottom == 3 || negDiagonal == 3 || posDiagonal == 3) { //check if x wins
        winMessage.innerHTML = 'X Wins!'
        boardSquares[0].endGame = true; // allows board to be reset
    } else if (left == -3 || midVertical == -3 || right == -3 || top == -3 || midHorizontal == -3 || bottom == -3 || negDiagonal == -3 || posDiagonal == -3) { //check is o wins
        boardSquares[0].endGame = true; // allows board to be reset
        winMessage.innerHTML = 'O Wins!'
        //resetBoard(boardSquares);
    }
};
const computerPlay = (boardSquares, user) => { // selects random place on board for computer to go
    let randomIndex = Math.floor(Math.random() * 9); //select random index
    while (boardSquares[randomIndex].filled === true) { //if index is already taken, then true new random index
        randomIndex = Math.floor(Math.random() * 9); // select random index
    }
    spotChosen(boardSquares[randomIndex], user); // use spot chosen function
}
const resetBoard = (boardSquares) => { //this resets all spots on board to as if window just opened
    boardSquares.forEach(boardSquare => {
        delete boardSquare.filled; //remove property saying board area cant be taken
        delete boardSquare.mark; // clear all score indicators
        boardSquare.location.innerHTML = "";// clear all visible marks on board
        boardSquares[0].endGame = false; // reset so it isn't the end of the game
        winMessage.innerHTML = ""; // remove message stating who won
    })
}
const gameBoard = (() => { // module pattern to keep global variables to minimum
    const boardSquares = [{ position: 'TL' }, { position: 'ML' }, { position: 'BL' }, // set array with objects for each board area
    { position: 'TM' }, { position: 'MM' }, { position: 'BM' },
    { position: 'TR' }, { position: 'MR' }, { position: 'BR' },];
    /*position ids are row and then column, T=top, M=middle, B=Bottom, L=Left, R=right*/
    const squareDefualt = { // prototype for boardSquares
        filled: false, //allow spot to be filled
        mark: 0, // set score value to 0 (neutral)
    }
    let movesMade = 0; //makes it so game wont check for winner until enough moves have been made for a win
    boardSquares[0].endGame = false; // set board to know the game hasn't ended
    const computerBTN = document.getElementById('computerBTN'); //button to switch to computer play
    const playerBTN = document.getElementById('playerBTN'); // button to switch to PvP play
    const winMessage = document.getElementById('winMessage'); //area to display who won
    const resetBTN = document.getElementById('resetBTN'); // button to reset board
    resetBTN.addEventListener('click', () => resetBoard(boardSquares)); //clicking reset button resets board
    let computerOpponent = true; // assume computer will be opponent unless PvP button is pressed
    computerBTN.addEventListener('click', () => { //sets opponent to be computer
        computerBTN.classList.add('opponent'); //add color to computer button
        playerBTN.classList.remove('opponent'); // remove color to player btn
        computerOpponent = true; // sets computer as opponent
        resetBoard(boardSquares); //resets board
    })
    playerBTN.addEventListener('click', () => { //sets PvP game
        playerBTN.classList.add('opponent'); // add color to PvP button
        computerBTN.classList.remove('opponent'); // remove color from computer button
        computerOpponent = false; // ignore computer generated moves
        resetBoard(boardSquares); // resetboard
    })
    let user = { //initialize mark type
        type: 'x',
    };
    boardSquares.forEach(boardSquare => { // make changes to all board areas
        Object.setPrototypeOf(boardSquare, squareDefualt); // set prototype to each board area
        boardSquare.location = document.getElementById(boardSquare.position); // give location value to check for wins
        boardSquare.location.addEventListener('mouseup', () => { //allows board areas to be selected for play
            if (boardSquare.filled === false) { // only allow board area to be selected if it isnt already filled
                spotChosen(boardSquare, user); //choose spot
                movesMade++; // specify that a move has been made
                if (movesMade > 2) { //check for win if enough moves have been made for a win
                    checkForWin(boardSquares);
                }
                if (boardSquares[0].endGame === false && computerOpponent === true) { //computer goes if game is still going and playing against computer
                    computerPlay(boardSquares, user);//computer choses spot
                    if (movesMade > 2) {
                        checkForWin(boardSquares); //check for win if win is possible
                    }
                } else if (boardSquares[0].endGame === true) { //if the game ended
                    window.addEventListener('mousedown', () => { //add event listener for board to reset on next click
                        resetBoard(boardSquares);
                    }, {once: true}) // onle happens once
                }

            }
        })
    })
})();
