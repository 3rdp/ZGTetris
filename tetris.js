// Zero Gravity Tetris
// AKA Take-your-Time Tetris
// by Dion Olympia

// Get canvas from HTML and use Context API
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const holdCanvas = document.getElementById("Held-piece");
const holdContext = holdCanvas.getContext("2d");

const TOP_CVS = document.getElementById("onDeck");
const TOP_CTX = TOP_CVS.getContext("2d");

const MID_CVS = document.getElementById("inTheHole");
const MID_CTX = MID_CVS.getContext("2d");

const BOT_CVS= document.getElementById("inTheDoubleHole");
const BOT_CTX = BOT_CVS.getContext("2d");


const BLOCKSIZE = 20;
const ROWS = 20;
const COLS = 10;

const HOLD_ROWS = 4;
const HOLD_COLS = 4;

// Piece colors
const EMPTY = "white";
const GHOST = "grey";
const RED = "#D12641";
const GREEN = "#60C127";
const DARK_BLUE = "#2B51C7";
const PURPLE = "#B331A1";
const ORANGE = "#E76F1A";
const LIGHT_BLUE = "#30C5F5";
const YELLOW = "#EFB239";

const PIECES = [
  [Z, RED],
  [S, GREEN],
  [J, DARK_BLUE],
  [T, PURPLE],
  [L, ORANGE],
  [I, LIGHT_BLUE],
  [O, YELLOW],
]

var p = new Piece( PIECES[0][0], PIECES[0][1]);
var held = 0;
var holdIsEmpty = true;
var heldTetromino = 0;
var heldColor = 0;
var usedHold = false;
var lastPiece = 8;
var isGameOver = false;
var queue = [];
var topPiece;
var midPiece;
var botPiece;


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

  if(!isGameOver){

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

      console.log("drop");

      p.lock();

      pieceFromPreview();

      if(p.color != YELLOW){
        p.y = 0;
      }
      else{
        p.y= -1;
      }      

      // Switch "I" piece to horizontal position if space is limited
      if(p.color == LIGHT_BLUE && p.collision(0,0,p.currentRotation)){
        p.rotationIndex = (p.rotationIndex + 1) % p.tetromino.length;
        p.currentRotation = p.tetromino [p.rotationIndex];
        while(p.collision(0,0,p.currentRotation)){
          p.y--;
        }
        p.draw();
      }

      if(p.collision(0,0,p.currentRotation)){
        while(p.collision(0,0,p.currentRotation)){
          p.y--;
        }
        p.draw();
        document.getElementById("Game-over").style.display = "block";
        isGameOver = true;
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
        console.log("rotate");
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

    // "R" = restart
    else if(event.keyCode == 82){
      location.reload();
    }
  
  }
  else{
    if(event.keyCode == 82){
      location.reload();
    }
  }
}

function unshiftQueue(){
  let randomNumber =Math.floor(Math.random() * 7);

  while(randomNumber == lastPiece){
    randomNumber =Math.floor(Math.random() * 7);
  }

  lastPiece = randomNumber;

  queue.unshift(randomNumber);

}

function popQueue(){

  return queue.pop();

}

function initializeQueue(){
  unshiftQueue();
  unshiftQueue();
  unshiftQueue();
}

function drawQueue(){

  let top = queue[2];
  let mid = queue[1];
  let bot = queue[0];

  topPiece = new Piece( PIECES[top][0], PIECES[top][1]);
  midPiece = new Piece( PIECES[mid][0], PIECES[mid][1]);
  botPiece = new Piece( PIECES[bot][0], PIECES[bot][1]);

  if(top == 5){
    topPiece.rotationIndex = (topPiece.rotationIndex + 1) % topPiece.tetromino.length;
    topPiece.currentRotation = topPiece.tetromino [topPiece.rotationIndex];
  }

  if(mid == 5){
    midPiece.rotationIndex = (midPiece.rotationIndex + 1) % midPiece.tetromino.length;
    midPiece.currentRotation = midPiece.tetromino [midPiece.rotationIndex];
  }

  if(bot == 5){
    botPiece.rotationIndex = (botPiece.rotationIndex + 1) % botPiece.tetromino.length;
    botPiece.currentRotation = botPiece.tetromino [botPiece.rotationIndex];
  }

  for (var r = 0; r < (topPiece.tetromino[0].length); r++) {
    for (var c = 0; c < (topPiece.tetromino[0].length); c++) {
      if(topPiece.currentRotation[r][c]){
        drawBlock(TOP_CTX, c, r, topPiece.color);
      }
    }
  }
  
  for (var r = 0; r < (midPiece.tetromino[0].length); r++) {
    for (var c = 0; c < (midPiece.tetromino[0].length); c++) {
      if(midPiece.currentRotation[r][c]){
        drawBlock(MID_CTX, c, r, midPiece.color);
      }
    }
  }
  
  for (var r = 0; r < (botPiece.tetromino[0].length); r++) {
    for (var c = 0; c < (botPiece.tetromino[0].length); c++) {
      if(botPiece.currentRotation[r][c]){
        drawBlock(BOT_CTX, c, r, botPiece.color);
      }
    }
  }
  

}

function pieceFromPreview(){

  let newPiece = popQueue();

  p = new Piece(PIECES[newPiece][0], PIECES[newPiece][1]);
  
  for (var r = 0; r < (topPiece.tetromino[0].length); r++) {
    for (var c = 0; c < (topPiece.tetromino[0].length); c++) {
      if(topPiece.currentRotation[r][c]){
        drawBlock(TOP_CTX, c, r, EMPTY);
      }
    }
  }

  for (var r = 0; r < (midPiece.tetromino[0].length); r++) {
    for (var c = 0; c < (midPiece.tetromino[0].length); c++) {
      if(midPiece.currentRotation[r][c]){
        drawBlock(MID_CTX, c, r, EMPTY);
      }
    }
  }

  for (var r = 0; r < (botPiece.tetromino[0].length); r++) {
    for (var c = 0; c < (botPiece.tetromino[0].length); c++) {
      if(botPiece.currentRotation[r][c]){
        drawBlock(BOT_CTX, c, r, EMPTY);
      }
    }
  }

  unshiftQueue();
  drawQueue();
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
  p.currentRotation = p.tetromino[0];
  p.x = 3;
  if(p.color != YELLOW){
    p.y = 0;
  }
  else{
    p.y= -1;
  }

  // Draw hold object in player canvas
  p.draw();


}

Piece.prototype.holdPiece = function(color){
  
  // If hold space is occupied...
  if(!holdIsEmpty){

    // Switch held piece and player's piece
    this.switchHold(this);

  }

  // If holdspace is empty...
  if(holdIsEmpty){

    // Held piece becomes player's piece
    holdObject = this;
    held = holdObject.tetromino[0];

    // Draw player's piece in hold space
    for (var r = 0; r < (held.length); r++) {
      for (var c = 0; c < (held.length); c++) {
        if((held)[r][c]){
          drawBlock(holdContext, c, r, color);
        }
      }
    }

    // replace player's piece with next in queue  
    p.erase();
    pieceFromPreview();

    if(p.color != YELLOW){
      p.y = 0;
    }
    else{
      p.y= -1;
    }
  

    p.draw();
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

  // Hard drop
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

// Create the queue (3 pieces)

initializeQueue();
drawQueue();
pieceFromPreview();


p.draw();
var ghostPiece = new Piece(p.tetromino, GHOST);
p.drawGhost();

document.addEventListener("keydown", CONTROLDOWN);
document.addEventListener("keyup", CONTROLUP);

function on() {
  document.getElementById("controls").style.display = "block";
}

function off() {
  document.getElementById("controls").style.display = "none";
}