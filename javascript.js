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
  const columns = 3;
  const board = [];

  for (let i = 0; i < rows; i++) {
    board[i] = [];
    for (let j = 0; j < columns; j++) {
      board[i].push(cell());
    }
  }

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

  return { getBoard, markCell, printBoard };
})();

const gameController = (() => {
  const board = gameboard;

  const players = [
    {
      name: "Player One",
      token: "X",
    },
    {
      name: "Player Two",
      token: "O",
    },
  ];

  const setNames = (playerOneNewName, playerTwoNewName) => {
    players[0].name = playerOneNewName;
    players[1].name = playerTwoNewName;
  };

  let activePlayer = players[0];

  const switchPlayerTurn = () => {
    activePlayer = activePlayer === players[0] ? players[1] : players[0];
  };

  const getActivePlayer = () => activePlayer;

  const printNewRound = () => {
    board.printBoard();
    console.log(`${getActivePlayer().name}'s turn.`);
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

  return { playRound, getActivePlayer, setNames, getBoard: board.getBoard };
})();

const displayController = (() => {
  const game = gameController;
  const infoDiv = document.querySelector(".info");
  const boardDiv = document.querySelector(".grid");

  const updateScreen = () => {
    boardDiv.textContent = "";

    const board = game.getBoard();
    const activePlayer = game.getActivePlayer();

    infoDiv.textContent = `${activePlayer.name}'s turn...`;

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
