const spotChosen = (boardSquare, user) => {
    boardSquare.location.innerHTML = user.type;
    boardSquare.filled = true;
    if (user.type === 'x') {
        boardSquare.mark = 1;
        user.type = 'o';
    } else if (user.type === 'o') {
        boardSquare.mark = -1;
        user.type = 'x';
    }
}
const checkForWin = (boardSquares) => {
    let left = boardSquares[0].mark + boardSquares[1].mark + boardSquares[2].mark;
    let midVertical = boardSquares[3].mark + boardSquares[4].mark + boardSquares[5].mark;
    let right = boardSquares[6].mark + boardSquares[7].mark + boardSquares[8].mark;
    let top = boardSquares[0].mark + boardSquares[3].mark + boardSquares[6].mark;
    let midHorizontal = boardSquares[1].mark + boardSquares[4].mark + boardSquares[7].mark;
    let bottom = boardSquares[2].mark + boardSquares[5].mark + boardSquares[8].mark;
    let negDiagonal = boardSquares[0].mark + boardSquares[4].mark + boardSquares[8].mark;
    let posDiagonal = boardSquares[2].mark + boardSquares[4].mark + boardSquares[6].mark;
    if (left == 3 || midVertical == 3 || right == 3 || top == 3 || midHorizontal == 3 || bottom == 3 || negDiagonal == 3 || posDiagonal == 3) {
        winMessage.innerHTML = 'X Wins!'
        boardSquares[0].endGame = true;
    } else if (left == -3 || midVertical == -3 || right == -3 || top == -3 || midHorizontal == -3 || bottom == -3 || negDiagonal == -3 || posDiagonal == -3) {
        boardSquares[0].endGame = true;
        winMessage.innerHTML = 'O Wins!'
        //resetBoard(boardSquares);
    }
};
const computerPlay = (boardSquares, user) => {
    let randomIndex = Math.floor(Math.random() * 9);
    while (boardSquares[randomIndex].filled === true) {
        randomIndex = Math.floor(Math.random() * 9);
    }
    spotChosen(boardSquares[randomIndex], user);
}
const resetBoard = (boardSquares) => {
    boardSquares.forEach(boardSquare => {
        delete boardSquare.filled;
        delete boardSquare.mark;
        boardSquare.location.innerHTML = "";
        boardSquares[0].endGame = false;
        winMessage.innerHTML = "";
    })
}
const gameBoard = (() => {
    const boardSquares = [{ position: 'TL' }, { position: 'ML' }, { position: 'BL' },
    { position: 'TM' }, { position: 'MM' }, { position: 'BM' },
    { position: 'TR' }, { position: 'MR' }, { position: 'BR' },];
    /*position ids are row and then column, T=top, M=middle, B=Bottom, L=Left, R=right*/
    const squareDefualt = {
        filled: false,
        mark: 0,
    }
    let movesMade = 0;
    boardSquares[0].endGame = false;
    const computerBTN = document.getElementById('computerBTN');
    const playerBTN = document.getElementById('playerBTN');
    const winMessage = document.getElementById('winMessage');
    const resetBTN = document.getElementById('resetBTN');
    resetBTN.addEventListener('click', () => resetBoard(boardSquares));
    let computerOpponent = true;
    computerBTN.addEventListener('click', () => {
        computerBTN.classList.add('opponent');
        playerBTN.classList.remove('opponent');
        computerOpponent = true;
        resetBoard(boardSquares);
    })
    playerBTN.addEventListener('click', () => {
        playerBTN.classList.add('opponent');
        computerBTN.classList.remove('opponent');
        computerOpponent = false;
        resetBoard(boardSquares);
    })
    let user = {
        type: 'x',
    };
    boardSquares.forEach(boardSquare => {
        Object.setPrototypeOf(boardSquare, squareDefualt);
        boardSquare.location = document.getElementById(boardSquare.position);
        boardSquare.location.addEventListener('mouseup', () => {
            if (boardSquare.filled === false) {
                spotChosen(boardSquare, user);
                movesMade++;
                if (movesMade > 2) {
                    checkForWin(boardSquares);
                }
                if (boardSquares[0].endGame === false && computerOpponent === true) {
                    computerPlay(boardSquares, user);
                    if (movesMade > 2) {
                        checkForWin(boardSquares);
                    }
                } else if (boardSquares[0].endGame === true) {
                    window.addEventListener('mousedown', () => {
                        resetBoard(boardSquares);
                    }, {once: true})
                }

            }
        })
    })
})();
