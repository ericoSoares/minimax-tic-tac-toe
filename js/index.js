var x = '<div class="x">X</div>';
var o = '<div class="x">O</div>';
var player = 'X';
var computer = 'O';
var multiPlayer = false;
var boardMat = [
  [0, 0, 0],
  [0, 0, 0],
  [0, 0, 0] //Game board, 0 = null, 1 = X, 2 = O
];

$(document).ready(function() {
  update();
});
//Update board after each move
function update() {
  $('#board').children().each(function() {
    $(this).empty();
    var c1 = $(this).attr('id').charAt(1);
    var c2 = $(this).attr('id').charAt(2);
    if(boardMat[c1][c2] == 'X') {
      $(this).append(x);
    } else {
      if(boardMat[c1][c2] == 'O') {
        $(this).append(o);
      }
    }
  });
}
//Check for game ending
function checkWin(grid) {
  //Ugly code ahead
  if(grid[0][0] == grid[0][1] && grid[0][0] == grid[0][2]) {
    return grid[0][0];
  }
  if(grid[1][0] == grid[1][1] && grid[1][0] == grid[1][2]) {
    return grid[1][0];
  }
  if(grid[2][0] == grid[2][1] && grid[2][0] == grid[2][2]) {
    return grid[2][0];
  }
  if(grid[0][0] == grid[1][0] && grid[0][0] == grid[2][0]) {
    return grid[0][0];
  }
  if(grid[0][1] == grid[1][1] && grid[0][1] == grid[2][1]) {
    return grid[0][1];
  }
  if(grid[0][2] == grid[1][2] && grid[0][2] == grid[2][2]) {
    return grid[0][2];
  }
  if(grid[0][0] == grid[1][1] && grid[0][0] == grid[2][2]) {
    return grid[0][0];
  }
  if(grid[0][2] == grid[1][1] && grid[0][2] == grid[2][0]) {
    return grid[0][2];
  }
  if(!grid[0].includes(0) && !grid[1].includes(0) && !grid[2].includes(0)) {
    return -1;
  }
  return 0;
}
//Register a move in the board array
function registerMove(x, y, p) {
  //Register move in the boardMat
  if (boardMat[x][y] == 0) {
    boardMat[x][y] = p;
  }
}

function changePlayer() {
  if (player == 'X') {
    player = 'O';
  } else {
    player = 'X';
  }
}
//Makes move
$('.field').click(function() {
  var c1 = $(this).attr('id').charAt(1);
  var c2 = $(this).attr('id').charAt(2);
  if(boardMat[c1][c2] == 0) {
    registerMove(c1, c2, player);
    update();
    if(multiPlayer) {
      changePlayer();
    } else {
      computerMove();
    }
    setTimeout(function() {
      handleGameOver(checkWin(boardMat));
    }, 100);
  }
});
//X or O controller
$('#button1').click(function() {
  if($("#button1").text() == "Play as X") {
    $("#button1").text("Play as O");
    player = 'X';
    computer = 'O';
  } else {
    $("#button1").text("Play as X");
    player = 'O';
    computer = 'X';
  }
  resetBoard();
  
});
//Multiplayer button
$('#button2').click(function() {
  if(multiPlayer) {
    multiPlayer = false;
    $('#button2').text('vs Player');
  } else {
    multiPlayer = true;
    $('#button2').text('vs AI');
  }
  resetBoard();
  
});

function resetBoard() {
  $('.container').fadeOut();
  for (var i = 0; i < boardMat.length; i++) {
    for (var j = 0; j < boardMat[i].length; j++) {
      boardMat[i][j] = 0;
    }
  }
  $('.container').fadeIn();
  update();
}
//Alerts the winner
function handleGameOver(state) {
  switch(state) {
    case 'X':
      alert("X wins");
      break;
    case 'O':
      alert("O wins");
      break;
    case -1:
      alert("Draw");
      break;
    default:
      return;
  }
  resetBoard();
  
}
//Minimax algorithm to calculate computer's moves, ugly code ahead!
function minimax(newBoard, pl){
  function winning(board, player){
   if (
          (board[0] == player && board[1] == player && board[2] == player) ||
          (board[3] == player && board[4] == player && board[5] == player) ||
          (board[6] == player && board[7] == player && board[8] == player) ||
          (board[0] == player && board[3] == player && board[6] == player) ||
          (board[1] == player && board[4] == player && board[7] == player) ||
          (board[2] == player && board[5] == player && board[8] == player) ||
          (board[0] == player && board[4] == player && board[8] == player) ||
          (board[2] == player && board[4] == player && board[6] == player)
          ) {
          return true;
      } else {
          return false;
      }
  }
  function emptyIndexies(board) {
    return  board.filter(s => s != "O" && s != "X");
  }
  
  var availSpots = emptyIndexies(newBoard);
  if (winning(newBoard, player)){
     return {score:-10};
  }
	else if (winning(newBoard, computer)){
    return {score:10};
	}
  else if (availSpots.length === 0){
  	return {score:0};
  }

  var moves = [];

  for (var i = 0; i < availSpots.length; i++){
    var move = {};
  	move.index = newBoard[availSpots[i]];
    newBoard[availSpots[i]] = pl;
    if (pl == computer){
      var result = minimax(newBoard, player);
      move.score = result.score;
    }
    else{
      var result = minimax(newBoard, computer);
      move.score = result.score;
    }
    newBoard[availSpots[i]] = move.index;
    moves.push(move);
  }
  var bestMove;
  if(pl === computer){
    var bestScore = -10000;
    for(var i = 0; i < moves.length; i++){
      if(moves[i].score > bestScore){
        bestScore = moves[i].score;
        bestMove = i;
      }
    }
  }else{
    var bestScore = 10000;
    for(var i = 0; i < moves.length; i++){
      if(moves[i].score < bestScore){
        bestScore = moves[i].score;
        bestMove = i;
      }
    }
  }
  return moves[bestMove];
}
//Register computer move
function computerMove() {
  var aux = [];
  var c = 0;
  for(var i = 0; i < boardMat.length; i++) {
    for(var j = 0; j < boardMat.length; j++) {
      if(boardMat[i][j] == 0) {
        aux.push(c);
      } else {
        aux.push(boardMat[i][j]);
      }
      c++;
    }
  }
  var ff = minimax(aux, computer);
  switch(ff.index) {
    case 0:
      registerMove(0,0,computer);
      break;
    case 1:
      registerMove(0,1,computer);
      break;
    case 2:
      registerMove(0,2,computer);
      break;
    case 3:
      registerMove(1,0,computer);
      break;
    case 4:
      registerMove(1,1,computer);
      break;
    case 5:
      registerMove(1,2,computer);
      break;
    case 6:
      registerMove(2,0,computer);
      break;
    case 7:
      registerMove(2,1,computer);
      break;
    case 8:
      registerMove(2,2,computer);
      break;
  }
  update();
}
