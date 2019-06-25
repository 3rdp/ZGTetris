// Zero Gravity Tetris
// AKA Take-your-Time Tetris
// by Dion Olympia

// Get canvas from HTML and use Context API
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const holdCanvas = document.getElementById("Held-piece");
const holdContext = holdCanvas.getContext("2d");

const BLOCKSIZE = 20;
const ROWS = 20;
const COLS = 10;
const EMPTY = "white";
const GHOST = "grey";

const HOLD_ROWS = 4;
const HOLD_COLS = 4;

const PIECES = [
  [Z, "red"],
  [S, "green"],
  [J, "blue"],
  [T, "purple"],
  [L, "orange"],
  [I, "rgb(117,218,255)"],
  [O, "rgb(244, 217, 66)"],
  
]

var p = new Piece( PIECES[0][0], PIECES[0][1]);
var held = 0;
var holdIsEmpty = true;
var heldTetromino = 0;
var heldColor = 0;
var usedHold = false;
var lastPiece = 8;

var board = [];
var score = 0;
document.getElementById("Score-value").innerHTML = score;

for (var r = 0; r < ROWS; r++){
  board[r]=[];
  for(var c = 0; c < COLS; c++){
    board[r][c] = EMPTY;
  }
}

function drawBlock(context, x, y, color) {
  context.beginPath();
  context.fillStyle = color;
  context.fillRect(x*BLOCKSIZE,y*BLOCKSIZE,BLOCKSIZE,BLOCKSIZE);

  if(context == ctx){
    context.strokeStyle = "BLACK";
    context.strokeRect(x*BLOCKSIZE,y*BLOCKSIZE,BLOCKSIZE,BLOCKSIZE);
  }
}

function drawBoard() {
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      drawBlock(ctx, c, r, board[r][c]);
    }
  }
}

function Piece(tetromino, color) {
  this.tetromino = tetromino;
  this.color = color;

  this.rotationIndex = 0;
  this.currentRotation = this.tetromino[this.rotationIndex];
  this.pieceSize = this.currentRotation.length;

  this.x = 3;
  this.y = 0;
}

function CONTROLUP(event){
  // Alt release
  if(event.keyCode == 91){
    alt = false;
  }
  // Up Arrow release
  if(event.keyCode == 38){
    upArrow = false;
  }

}

function CONTROLDOWN(event){

  // Shift press
  if(event.keyCode == 16){

    if(!usedHold){
      p.holdPiece(p.color);
      ghostPiece.erase();
      p.drawGhost();


      if(holdIsEmpty){
        holdIsEmpty = false;
      }

      usedHold = true;
    }

  }

  // Space press
  else if(event.keyCode == 32){
    p.lock();

    randomPiece();

    if(p.collision(0,0,p.currentRotation)){
      document.getElementById("Game-over").style.display = "visible";
    }

    else{
      p.drawGhost();
      p.draw();
      usedHold = false;
    }
    
  }

  // Up Arrow press
  else if(event.keyCode == 38){
    upArrow = true;
    if(alt){
      p.moveUp();
    }
    else{
      p.rotate();
    }
  }

  // Alt press
  else if(event.keyCode == 91){  
    alt = true;
  }

  
  // Left Arrow press
  else if(event.keyCode == 37){
    p.moveLeft();
  }

  // Right Arrow press
  else if(event.keyCode == 39){
    p.moveRight();
  }

  // Down Arrow press
  else if(event.keyCode == 40){
    p.moveDown();
  }
  

}

function randomPiece(){

  let randomNumber =Math.floor(Math.random() * 7);

  while(randomNumber == lastPiece){
    randomNumber =Math.floor(Math.random() * 7);
  }

  lastPiece = randomNumber;

  p = new Piece( PIECES[randomNumber][0], PIECES[randomNumber][1]);

  if(randomNumber == 5 || randomNumber == 6){
    p.y = -1;
  }

}

Piece.prototype.switchHold = function(playerPiece){

  // Temp store hold object
  let tempHoldObject = holdObject;

  // Erase piece from hold space
  for (var r = 0; r < (held.length); r++) {
    for (var c = 0; c < (held.length); c++) {
      if((held)[r][c]){
        drawBlock(holdContext, c, r, EMPTY);
      }
    }
  }

  // Switch hold object to player piece object
  holdObject = playerPiece;
  held = holdObject.tetromino[0];

  // Draw player piece in hold space
  for (var r = 0; r < (held.length); r++) {
    for (var c = 0; c < (held.length); c++) {
      if((held)[r][c]){
        drawBlock(holdContext, c, r, playerPiece.color);
      }
    }
}

  // Switch player piece object to hold object
  p.erase();
  p = tempHoldObject;
  p.x , p.y = 0;

  console.log("Switched player's piece to: " + p.color);

  // Draw hold object in player canvas
  p.draw();


}

Piece.prototype.holdPiece = function(color){
  
  // If hold space is occupied...
  if(!holdIsEmpty){

    // Switch held piece and player's piece
    this.switchHold(this);
    console.log("switch");

  }

  // If holdspace is empty...
  if(holdIsEmpty){

    // Held piece becomes player's piece
    holdObject = this;
    held = holdObject.tetromino[0];
    console.log("Switched held piece to: " + holdObject.color);

    // Draw player's piece in hold space
    for (var r = 0; r < (held.length); r++) {
      for (var c = 0; c < (held.length); c++) {
        if((held)[r][c]){
          drawBlock(holdContext, c, r, color);
        }
      }
    }

    // Replace player's piece with random piece
    p.erase();
    randomPiece();
    p.draw();

    console.log("Switched player's piece to: " + p.color);
  }

}

Piece.prototype.draw = function() {
  for (var r = 0; r < this.pieceSize; r++) {
    for (var c = 0; c < this.pieceSize; c++) {
      if(this.currentRotation[r][c]){
        drawBlock(ctx, this.x + c, this.y + r, this.color);
      }
    }
  }
}

Piece.prototype.erase = function() {
  for (var r = 0; r < this.pieceSize; r++) {
    for (var c = 0; c < this.pieceSize; c++) {
      if(this.currentRotation[r][c]){
        drawBlock(ctx, this.x + c, this.y + r, EMPTY);
      }
    }
  }
}

Piece.prototype.lock = function(){

  while(!p.collision(0,1,p.currentRotation)){
    p.erase();
    p.y++;
  }
  p.draw();

  // Lock piece and add it to the "actual" board when player no longer controls it
  for (r = 0; r < this.pieceSize; r++) {
    for (c = 0; c < this.pieceSize; c++) {

      // Ignore empty blocks
      if(!this.currentRotation[r][c]){
        continue;
      }

      // Add blocks to "actual" board
      board[this.y + r][this.x + c] = this.color;
    }
  }


  for (r = 0; r < ROWS; r++) {
    let isRowFull = true;
    for (c = 0; c < COLS; c++) {
      isRowFull = isRowFull && (board[r][c] != EMPTY);
    }

    if(isRowFull){
      for(y = r; y > 0; y --){
        for (var c = 0; c < COLS; c++){
          board[y][c] = board [y-1][c];
        }
      }
      for(c = 0; c < COLS; c++){
        board[0][c] = EMPTY;
      }
      score += 1;
      document.getElementById("Score-value").innerHTML = score;
      drawBoard();
    }
  }

 
}

Piece.prototype.collision = function(xMovement, yMovement, piece){

  // For every block in the piece
  for (var r = 0; r < piece.length; r++) {
    for (var c = 0; c < piece.length; c++) {

      // Ignore empty blocks
      if(!piece[r][c]){
        continue;
      }

      // Apply transition (horizontal/vertical)
      let newX = this.x + c + xMovement;
      let newY = this.y + r + yMovement;
  
      // Check movements for collisions w/ walls
      if(newX < 0 || newX >= COLS){
        return true;
      }
      if(newY >= ROWS){
        return true;
      }

      // Ignore when index is less than zero
      // Reason: board[-1][newX] will crash the game
      if(newY < 0){
        continue;
      }

      // Check movements for collisions w/ other pieces
      if(board[newY][newX] != EMPTY && board[newY][newX] != GHOST){
        return true;
      }

    }
  }

  // No collision detected
  return false;
}


Piece.prototype.moveUp = function(){
  if(!this.collision(0, -1, this.currentRotation)){
    this.erase();
    ghostPiece.erase();
    this.y--;
    this.drawGhost();
    this.draw();
  }
}


Piece.prototype.moveDown = function(){
  if(!this.collision(0, 1, this.currentRotation)){
    this.erase();
    ghostPiece.erase();
    this.y++;
    this.drawGhost();
    this.draw();
  }
}

Piece.prototype.moveRight = function(){
  if(!this.collision(1, 0, this.currentRotation)){
    this.erase();
    ghostPiece.erase();
    this.x++;
    this.drawGhost();
    this.draw();
  }
}

Piece.prototype.moveLeft = function(){
  if(!this.collision(-1, 0, this.currentRotation)){
    this.erase();
    ghostPiece.erase();

    this.x--;
    
    this.drawGhost();
    this.draw();
  }
    
}


Piece.prototype.rotate = function(){

  let nextPattern = this.tetromino[(this.rotationIndex + 1) % this.tetromino.length];
  let kick = 0;

  if(this.collision(0, 0, nextPattern)){
    if(this.x > COLS/2){
      kick = -1;
    }
    else{
      kick = 1;
    }

  }

  if(!this.collision(kick, 0, nextPattern)){
    this.erase();
    ghostPiece.erase();
    this.x += kick;
    this.rotationIndex = (this.rotationIndex + 1) % this.tetromino.length;
    this.currentRotation = this.tetromino [this.rotationIndex];
    this.drawGhost();
    this.draw();
  }
}

Piece.prototype.drawGhost = function(){
  //Draw ghost underneath player's piece
  ghostPiece = new Piece(this.tetromino, GHOST);
  ghostPiece.x = this.x;
  ghostPiece.y = this.y;
  ghostPiece.currentRotation = this.currentRotation;

  while(!ghostPiece.collision(0,1,ghostPiece.currentRotation)){
    ghostPiece.y++;
  }
  ghostPiece.draw();

}

var x = 0;

var alt = false;
var upArrow = false;

drawBoard();
randomPiece();
p.draw();
var ghostPiece = new Piece(p.tetromino, GHOST);
p.drawGhost();

document.addEventListener("keydown", CONTROLDOWN);
document.addEventListener("keyup", CONTROLUP);

