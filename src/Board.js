import Space from "./Space";

const numRows = 19;
const numCols = 19;

export default function Board() {
 
  const spaces = [];

  for (let row = 0; row < numRows; row++) {
    for (let col = 0; col < numCols; col++) {
      
     let {spaceType, spaceColour, spaceNumber} = getSpaceTypeAndColourAndNumber(row, col);

     let space = spaceType ? <Space type={spaceType} number={spaceNumber} colour={spaceColour}/> 
                           : <div className = {`grid-square`}></div>;      

     spaces.push (
       space
     );
   }
  }

  return (
    <div className="board">
      {spaces}
    </div>
  )
}

function getSpaceTypeAndColourAndNumber (row, col) {
  
  let colour = getColour (row, col);
  let type   = getType (row, col);
  let number = getNumber (row, col);

   return {spaceType: type, spaceColour: colour, spaceNumber: number};
}

function getColour (row, col) {

  const yellow = [[2,2],[2,4],[4,2],[4,4],[0,11],[2,9],[3,9],[4,9],[5,9]];
  const green  = [[2,14],[2,16],[4,14],[4,16],[9,13],[9,14],[9,15],[9,16],[11,18]];
  const red    = [[14,14],[14,16],[16,14],[16,16],[13,9],[14,9],[15,9],[16,9],[18,7]];
  const blue   = [[14,2],[14,4],[16,2],[16,4],[9,2],[9,3],[9,4],[9,5],[7,0]];

  if (row === 0 && col === 11) {
    console.log(yellow.some(([r, c]) => r === row && c === col));
  }

  if (yellow.some(([r, c]) => r === row && c === col)) {
    return `light-yellow`;
  }
  else if (green.some(([r, c]) => r === row && c === col)) {
    return `light-green`;
  }
  else if (red.some(([r, c]) => r === row && c === col)) {
    return `light-red`;
  }
  else if (blue.some(([r, c]) => r === row && c === col)) {
    return `light-blue`;
  }
  else {
    return null;
  }
}

function getType (row, col) {
   
  if (isHomePlaying(row, col)) {
    return `home-playing`;
  }
  else if (isHomeStart(row, col)) {
    return `home-start`;
  }
  else if (isHomeEnd(row, col)) {
    return `home-end`;
  }
  if (isBoardSpace(row, col))
  {
    return `board-space`;
  }
}

function isBoardSpace(row, col) {
  return ((row === 0 || row === numRows - 1) && (col >= 7 && col <= 11))
    || (((row >= 1 && row <= 6) || (row >= 12 && row <= 17)) && (col === 7 || col === 11))
    || ((row === 7 || row === 11) && ((col >= 0 && col <= 7) || (col >= 11 && col <= 18)))
    || ((row >= 8 && row <= 10) && (col === 0 || col === 18));
}

function isHomeEnd(row, col) {
  return (row === 9 && ((col >= 2 && col <= 5) || (col >= 13 && col <= 16)))
    || (col === 9 && ((row >= 2 && row <= 5) || (row >= 13 && row <= 16)));
}

function isHomeStart(row, col) {
  return (row === 2 || row === 4 || row === 14 || row === 16)
    && (col === 2 || col === 4 || col === 14 || col === 16);
}

function isHomePlaying(row, col) {
  return (row === 0 && col === 11)
    || (row === 11 && col === 18)
    || (row === 18 && col === 7)
    || (row === 7 && col === 0);
}

function getNumber (row, col) {
  if ((row === 1 && col === 11)
  ||  (row === 11 && col === 17)
  ||  (row === 17 && col === 7)
  ||  (row === 7 && col === 1)) {
    return 1;
  }
  else if ((row === 2 && col === 11)
  ||       (row === 11 && col === 16)
  ||       (row === 16 && col === 7)
  ||       (row === 7 && col === 2)) {
    return 2;
  }
  else if ((row === 3 && col === 11)
  ||       (row === 11 && col === 15)
  ||       (row === 15 && col === 7)
  ||       (row === 7 && col === 3)) {
    return 3;
  }
  else if ((row === 4 && col === 11)
  ||       (row === 11 && col === 14)
  ||       (row === 14 && col === 7)
  ||       (row === 7 && col === 4)) {
    return 4;
  }
  else if ((row === 5 && col === 11)
  ||       (row === 11 && col === 13)
  ||       (row === 13 && col === 7)
  ||       (row === 7 && col === 5)) {
    return 5;
  }
  else if ((row === 6 && col === 11)
  ||       (row === 11 && col === 12)
  ||       (row === 12 && col === 7)
  ||       (row === 7 && col === 6)) {
    return 6;
  }
  else if ((row === 7 && col === 11)
  ||       (row === 11 && col === 11)
  ||       (row === 11 && col === 7)
  ||       (row === 7 && col === 7)) {
    return 7;
  }
  else if ((row === 7 && col === 12)
  ||       (row === 12 && col === 11)
  ||       (row === 11 && col === 6)
  ||       (row === 6 && col === 7)) {
    return 8;
  }
  else if ((row === 7 && col === 13)
  ||       (row === 13 && col === 11)
  ||       (row === 11 && col === 5)
  ||       (row === 5 && col === 7)) {
    return 9;
  }
  else if ((row === 7 && col === 14)
  ||       (row === 14 && col === 11)
  ||       (row === 11 && col === 4)
  ||       (row === 4 && col === 7)) {
    return 10;
  }
  else if ((row === 7 && col === 15)
  ||       (row === 15 && col === 11)
  ||       (row === 11 && col === 3)
  ||       (row === 3 && col === 7)) {
    return 11;
  }
  else if ((row === 7 && col === 16)
  ||       (row === 16 && col === 11)
  ||       (row === 11 && col === 2)
  ||       (row === 2 && col === 7)) {
    return 12;
  }
  else if ((row === 7 && col === 17)
  ||       (row === 17 && col === 11)
  ||       (row === 11 && col === 1)
  ||       (row === 1 && col === 7)) {
    return 13;
  }
  else if ((row === 7 && col === 18)
  ||       (row === 18 && col === 11)
  ||       (row === 11 && col === 0)
  ||       (row === 0 && col === 7)) {
    return 14;
  }
  else if ((row === 8 && col === 18)
  ||       (row === 18 && col === 10)
  ||       (row === 10 && col === 0)
  ||       (row === 0 && col === 8)) {
    return 15;
  }
  else if ((row === 9 && col === 18)
  ||       (row === 18 && col === 9)
  ||       (row === 9 && col === 0)
  ||       (row === 0 && col === 9)) {
    return 16;
  }
  else if ((row === 10 && col === 18)
  ||       (row === 18 && col === 8)
  ||       (row === 8 && col === 0)
  ||       (row === 0 && col === 10)) {
    return 17;
  }
  else if ((row === 11 && col === 18)
  ||       (row === 18 && col === 7)
  ||       (row === 7 && col === 0)
  ||       (row === 0 && col === 11)) {
    return 18;
  }

  return null;
}