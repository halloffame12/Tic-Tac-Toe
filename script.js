$(document).ready(function () {
  const board = Array(9).fill(null);
  let currentPlayer = 'X';
  let isGameOver = false;
  let isPlayerVsComputer = false;

  // Initialize the game board
  const initBoard = () => {
    $('#game-board').empty();
    board.fill(null);
    currentPlayer = 'X';
    isGameOver = false;
    $('#winner-text').text('');
    for (let i = 0; i < 9; i++) {
      $('#game-board').append(`<div class="cell" data-index="${i}"></div>`);
    }
  };

  // Check for a winner or draw
  const checkWinner = () => {
    const winningCombinations = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];

    for (const combination of winningCombinations) {
      const [a, b, c] = combination;
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        return board[a];
      }
    }

    if (!board.includes(null)) {
      return 'Draw';
    }

    return null;
  };

  // Minimax Algorithm for computer AI
  const minimax = (newBoard, isMaximizing) => {
    const winner = checkWinner();
    if (winner === 'X') return -10;
    if (winner === 'O') return 10;
    if (winner === 'Draw') return 0;

    const emptyCells = newBoard
      .map((val, idx) => (val === null ? idx : null))
      .filter(val => val !== null);

    if (isMaximizing) {
      let bestScore = -Infinity;
      for (let index of emptyCells) {
        newBoard[index] = 'O';
        const score = minimax(newBoard, false);
        newBoard[index] = null;
        bestScore = Math.max(score, bestScore);
      }
      return bestScore;
    } else {
      let bestScore = Infinity;
      for (let index of emptyCells) {
        newBoard[index] = 'X';
        const score = minimax(newBoard, true);
        newBoard[index] = null;
        bestScore = Math.min(score, bestScore);
      }
      return bestScore;
    }
  };

  // Computer makes a move
  const computerMove = () => {
    if (isGameOver) return;

    const emptyCells = board
      .map((val, idx) => (val === null ? idx : null))
      .filter(val => val !== null);

    let bestScore = -Infinity;
    let move;
    for (let index of emptyCells) {
      board[index] = 'O';
      const score = minimax(board, false);
      board[index] = null;
      if (score > bestScore) {
        bestScore = score;
        move = index;
      }
    }

    board[move] = 'O';
    $(`.cell[data-index=${move}]`).text('O').addClass('taken');

    const winner = checkWinner();
    if (winner) {
      isGameOver = true;
      $('#winner-text').text(winner === 'Draw' ? "It's a Draw!" : `${winner} Wins!`);
    } else {
      currentPlayer = 'X';
    }
  };

  // Handle cell clicks
  $('#game-board').on('click', '.cell', function () {
    if (isGameOver) return;

    const index = $(this).data('index');
    if (board[index] !== null) return;

    board[index] = currentPlayer;
    $(this).text(currentPlayer).addClass('taken');

    const winner = checkWinner();
    if (winner) {
      isGameOver = true;
      $('#winner-text').text(winner === 'Draw' ? "It's a Draw!" : `${winner} Wins!`);
    } else {
      currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
      if (isPlayerVsComputer && currentPlayer === 'O') {
        setTimeout(computerMove, 500);
      }
    }
  });

  // Restart the game
  $('#reset-btn').on('click', initBoard);

  // Switch to Player vs Player mode
  $('#player-vs-player').on('click', function () {
    isPlayerVsComputer = false;
    initBoard();
  });

  // Switch to Player vs Computer mode
  $('#player-vs-computer').on('click', function () {
    isPlayerVsComputer = true;
    initBoard();
  });

  // Initialize the board on page load
  initBoard();
});
