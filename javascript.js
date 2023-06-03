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
      token: "0",
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

  return { playRound, getActivePlayer, setNames };
})();

const displayController = (() => {
  console.log("Test123");
})();

gameController.setNames("Julian", "PC");
displayController;
