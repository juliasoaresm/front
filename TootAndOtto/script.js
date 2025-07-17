const winningWords = {
    Toot: "TOOT",
    Otto: "OTTO"
};

var Toot = "Toot";
var Otto = "Otto";
var currPlayer = "Toot";
var tootPieces = { T: 6, O: 6 };
var ottoPieces = { T: 6, O: 6 };
var chosenPiece = "T";
var gameActive = false; 

var GameOver = false;
var board;  
var currColumns;
var timer;
var timeLeft = 30;


var rows = 4;
var columns = 6;

window.onload = function() {
    setGame();
}

function setGame() {
    board = [];
    currColumns = [3, 3, 3, 3, 3, 3];
    document.getElementById("board").innerHTML = "";

   
    for (let r = 0; r < rows; r++) {
        let row = [];
        for (let c = 0; c < columns; c++) {
            //JS
            row.push(' ');
            //HTML
            // <div id="0-0"
            let tile = document.createElement("div");
            tile.id = r.toString() + "-" + c.toString();
            tile.classList.add("tile");
            tile.addEventListener("click", setPiece);
            document.getElementById("board").append(tile);
        }
        board.push(row);
    }
    
}

    function selectPiece(piece) {
        if (!gameActive) {
        const messageElement = document.getElementById("mensagem");
        messageElement.innerText = "O jogo não foi iniciado!";
        setTimeout(() => {
            if (!gameActive) {
                messageElement.innerText = "Bem-vindo a TootAndOtto!";
            }
        }, 1000);
        return;
    }
    chosenPiece = piece;
    document.getElementById("mensagem").innerText = "Vez de " + currPlayer + " - Peça escolhida: " + chosenPiece;
}


    function setPiece () {
        if (GameOver) {
            return;
        }

        if (!chosenPiece) {
            document.getElementById("mensagem").innerText = "Selecione uma peça.";
            return;
        }
        let PlayerPieces = currPlayer === "Toot" ? tootPieces : ottoPieces;


        if (PlayerPieces[chosenPiece] <= 0) {
            document.getElementById("mensagem").innerText = currPlayer + " não tem mais peças " + chosenPiece + "!";
            return;
        }


        let coords = this.id.split("-");//0-0 -> ["0", "0"]
        let r = parseInt(coords[0]);
        let c = parseInt(coords[1]);


        r = currColumns[c];


        if (r < 0) {
        document.getElementById("mensagem").innerText = "Coluna cheia! Escolha outra.";
        return;
        }

        board[r][c] = chosenPiece;
        PlayerPieces[chosenPiece]--;
        let tile = document.getElementById(r.toString() + "-" + c.toString());
        if (currPlayer === "Toot") {
            tile.classList.add("red");
            tile.innerText = chosenPiece;
            currPlayer = "Otto";
        }
        else {
            tile.classList.add("yellow");
            tile.innerText = chosenPiece;
            currPlayer = "Toot";
        }


        r -= 1; //atualiza a altura da linha pra coluna
        currColumns[c] = r; // atualiza o array de posições
        checkWinner();
        updateStatus();
        startTimer();
        chosenPiece = null;
        
    }


    function checkSequence(r, c, dr, dc) {
        let word = "";
        for (let i = 0; i < 4; i++) {
            let row = r + dr * i;
            let col = c + dc * i;


            if (row < 0 ||  row >= rows || col < 0 || col >= columns) {
                return null;
            }
            word += board[row][col];
        }
        return word;
    }

    function startTimer() {
    clearInterval(timer);
    timeLeft = 30;
    document.getElementById("timeleft").innerText = timeLeft;

    timer = setInterval(() => {
        timeLeft--;
        document.getElementById("timeleft").innerText = timeLeft;

        if (timeLeft <= 0) {
            clearInterval(timer);
            document.getElementById("mensagem").innerText = "Tempo esgotado! Vez de " + (currPlayer === "Toot" ? "Otto" : "Toot");
            currPlayer = currPlayer === "Toot" ? "Otto" : "Toot";
            updateStatus();
            startTimer();
        }
    }, 1000);
}

    function startGame() {
        gameActive = true;
        GameOver = false;
        tootPieces = { T: 6, O: 6 };
        ottoPieces = { T: 6, O: 6 };
        
        document.getElementById("winner").innerText = "";
        document.getElementById("mensagem").innerText = "Jogo iniciado!";
        document.getElementById("peca-escolhida").innerText = "";
        setGame();
        setTimeout(() => {
        updateStatus();
        startTimer();
    }, 1000);
    }

    function updateStatus() {
        document.getElementById("toot-t").innerText = tootPieces.T;
        document.getElementById("toot-o").innerText = tootPieces.O;
        document.getElementById("otto-t").innerText = ottoPieces.T;
        document.getElementById("otto-o").innerText = ottoPieces.O;


        document.getElementById("mensagem").innerText = "Vez de " + currPlayer;
    }

    function resetGame() {
    gameActive = false;
    clearInterval(timer);
    GameOver = false;
    currPlayer = "Toot";
    chosenPiece = "T";
    tootPieces = { T: 6, O: 6 };
    ottoPieces = { T: 6, O: 6 };

    document.getElementById("board").innerHTML = "";
    document.getElementById("winner").innerText = "";
    document.getElementById("mensagem").innerText = "Bem-vindo a TootAndOtto!";

    setGame();
    document.getElementById("timeleft").innerText = "30";
}

    function checkWinner() {
    const directions = [
        [0, 1],   // horizontal
        [1, 0],   // vertical
        [1, 1],   // diagonal descendo
        [-1, 1]   // diagonal subindo
    ];


    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {
            for (let [dr, dc] of directions) {
                let word = "";
                let colors = [];


                for (let i = 0; i < 4; i++) {
                    let nr = r + dr * i;
                    let nc = c + dc * i;


                    if (nr < 0 || nr >= rows || nc < 0 || nc >= columns) {
                        word = "";
                        break;
                    }


                    word += board[nr][nc];
                    const tile = document.getElementById(`${nr}-${nc}`);
                    if (tile.classList.contains("red")) {
                        colors.push("Toot");
                    } else if (tile.classList.contains("yellow")) {
                        colors.push("Otto");
                    } else {
                        colors.push("none");
                    }
                }


                if (word === "TOOT") {
                 setWinner("Toot");
                 return;
                }
                if (word === "OTTO") {
                 setWinner("Otto");
                 return;
                }
            }
        }
    }

    const tootRemaining = tootPieces.T + tootPieces.O;
    const ottoRemaining = ottoPieces.T + ottoPieces.O;


    if (tootRemaining === 0 && ottoRemaining === 0) {
        document.getElementById("winner").innerText = "Empate!";
        GameOver = true;
         gameActive = false;
    }
}

    function setWinner(name) {
    let winner = document.getElementById("winner");
    winner.innerText = name + " venceu!";
    GameOver = true;
    gameActive = false;
}