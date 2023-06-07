const cell = () => {
  let value = 0;

  const markCell = (player) => {
    value = player;
  };

  const getValue = () => value;

  return {
    markCell,
    getValue,
  };
};

const gameboard = (() => {
  const rows = 3;
  const board = [];

  for (let i = 0; i < rows; i++) {
    board[i] = [];
    for (let j = 0; j < rows; j++) {
      board[i].push(cell());
    }
  }

  const getRows = () => rows;

  const getBoard = () => board;

  const markCell = (row, column, player) => {
    if (board[row][column].getValue()) return;
    board[row][column].markCell(player);
    return true;
  };

  const printBoard = () => {
    const boardWithCellValues = board.map((row) =>
      row.map((cell) => cell.getValue())
    );
    console.log(boardWithCellValues);
  };

  return { getBoard, markCell, printBoard, getRows };
})();

const gameController = (() => {
  const board = gameboard;
  const rows = board.getRows();

  const players = [
    {
      name: "Julian",
      token: "X",
    },
    {
      name: "Hyo",
      token: "O",
    },
  ];

  const setNames = (playerOneNewName, playerTwoNewName) => {
    players[0].name = playerOneNewName;
    players[1].name = playerTwoNewName;
  };

  let activePlayer = players[0];
  let lastPlayer = players[1];

  const switchPlayerTurn = () => {
    activePlayer = activePlayer === players[0] ? players[1] : players[0];
    lastPlayer = lastPlayer === players[0] ? players[1] : players[0];
  };

  const getActivePlayer = () => activePlayer;

  const printNewRound = () => {
    board.printBoard();
    checkWinner();
    if (checkWinner()) {
      console.log(checkWinner().name);
      return `${checkWinner().name} wins!!!`;
    } else if (!checkDraw()) {
      console.log("Game Over");
      return `Game Over - It's a draw!`;
    } else {
      console.log(`${getActivePlayer().name}'s turn.`);
      return `${getActivePlayer().name}'s turn.`;
    }
  };

  const checkDraw = () => {
    let empty = 0;
    //draw
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < rows; j++) {
        const val = board.getBoard()[i][j].getValue();
        if (val == 0) empty += 1;
      }
    }

    return empty;
  };

  const checkWinner = () => {
    const player = lastPlayer;
    const token = lastPlayer.token;

    // check rows for three
    for (let i = 0; i < rows; i++) {
      if (
        board.getBoard()[i][0].getValue() === token &&
        board.getBoard()[i][1].getValue() === token &&
        board.getBoard()[i][2].getValue() === token
      ) {
        return player;
      }
    }

    // check columns for three
    for (let i = 0; i < rows; i++) {
      if (
        board.getBoard()[0][i].getValue() === token &&
        board.getBoard()[1][i].getValue() === token &&
        board.getBoard()[2][i].getValue() === token
      ) {
        return player;
      }
    }

    // check for diagonal 1
    if (
      board.getBoard()[0][0].getValue() === token &&
      board.getBoard()[1][1].getValue() === token &&
      board.getBoard()[2][2].getValue() === token
    ) {
      return player;
    }

    // check for diagonal 2
    if (
      board.getBoard()[2][0].getValue() === token &&
      board.getBoard()[1][1].getValue() === token &&
      board.getBoard()[0][2].getValue() === token
    ) {
      return player;
    }

    return 0;
  };

  const playRound = (row, column) => {
    console.log(`${getActivePlayer().name} marks row ${row} column ${column}`);
    if (board.markCell(row, column, getActivePlayer().token) === true) {
      switchPlayerTurn();
      printNewRound();
    } else {
      console.log("Cell already occupied");
      printNewRound();
    }
  };

  printNewRound();

  return {
    playRound,
    getActivePlayer,
    setNames,
    printNewRound,
    getBoard: board.getBoard,
  };
})();

const displayController = (() => {
  const game = gameController;
  const infoDiv = document.querySelector(".info");
  const boardDiv = document.querySelector(".grid");

  const updateScreen = () => {
    boardDiv.textContent = "";

    const board = game.getBoard();

    infoDiv.textContent = game.printNewRound();

    board.forEach((row, rowindex) => {
      row.forEach((cell, colindex) => {
        const cellButton = document.createElement("button");
        const cellValue = cell.getValue();
        cellButton.classList.add("cell");
        cellButton.dataset.row = rowindex;
        cellButton.dataset.column = colindex;
        cellValue === 0
          ? (cellButton.textContent = "")
          : (cellButton.textContent = cellValue);
        boardDiv.appendChild(cellButton);
      });
    });
  };

  function clickHandlerBoard(e) {
    const selectedRow = e.target.dataset.row;
    const selectedColumn = e.target.dataset.column;

    if (!(selectedRow && selectedColumn)) return;

    game.playRound(selectedRow, selectedColumn);
    updateScreen();
  }
  boardDiv.addEventListener("click", clickHandlerBoard);

  updateScreen();
})();

displayController;
