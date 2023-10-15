// Board.js
// Purpose: defines the board

import Space from "./Space";
import MarbleSpace from "./Marble";
import { getNextPlayer, players } from './GameSetup'

const numRows = 19;
const numCols = 19;

// TODO - create a static 2D array for the board that contains all the static info (space type, space number). Ask chatGPT how to create a static data structure in react/javascript
// TODO - create a map of the current marbles (key = "row-col", value = marble info) so when I'm rendering the Board I can just look up in O(1) any marble info for that board space

export default function Board({marbles, onMarbleClick}) {

  const board = buildBoard(); // Can I refactor so the board is a constant and doesn't need to be kept as state? The marbles contain all the info needed to render where the marbles go?

  const spaces = [];

  for (let row = 0; row < numRows; row++) {
    for (let col = 0; col < numCols; col++) {
      
     let [spaceType, spaceColour, spaceNumber, spaceMarble] = getSpaceInfo(board, row, col);

      if (spaceMarble) {
        spaces.push(<MarbleSpace key={`${row}-${col}`} color={`${spaceMarble.colour}-marble`} disabled={spaceMarble.whereCanMove.length === 0} onClick={() => onMarbleClick(spaceMarble)}/>);
      }
      else if (spaceType) {
        spaces.push(<Space key={`${row}-${col}`} type={spaceType} number={spaceNumber} colour={spaceColour}/> );
      }
      else {
        spaces.push(<div key={`${row}-${col}`} className = {`grid-square`}></div>);
      }
   }
  }

  function buildBoard() {
    const newBoard = [];
  
    // Create the start home spaces
    newBoard.push(buildHomeStartSpaces(marbles));
  
    // Create the board spaces
    newBoard.push(buildBoardSpaces(marbles));
  
    // Create the end home spaces
    newBoard.push(buildHomeEndSpaces(marbles));
  
    return newBoard;
  }

  return (
    <div className="board">
      {spaces}
    </div>
  )
}

export function getNextBoardPosition(currBoardPosition, numSpaces, currPlayer) {
  const playingBoardPositions = getAllPlayingBoardPositions(currPlayer);

  let currIndex = 0;

  while (!isSameBoardPosition(playingBoardPositions[currIndex], currBoardPosition)) currIndex++;
  
  const nextBoardPositionIndex = currIndex + numSpaces;

  if (nextBoardPositionIndex >= playingBoardPositions.length) return null;

  return playingBoardPositions[nextBoardPositionIndex];
}

export function isMarbleInStartHome (marble, currPlayer) {
  const homeStartLocations = getHomeStartLocations(currPlayer);

  return homeStartLocations.some(([row, col]) => row === marble.row && col === marble.col);
}

export function getHomeStartLocations(colour) {
  switch (colour) {
    case "yellow": return getYellowHomeStartLocations();
    case "green":  return getGreenHomeStartLocations();
    case "blue":   return getBlueHomeStartLocations();
    case "red":    return getRedHomeStartLocations();
    default:       return null; // TODO - throw an error
  }
}

function isSameBoardPosition(boardPosition1, boardPosition2) {
  const [row1, col1] = boardPosition1;
  const [row2, col2] = boardPosition2;

  if (row1 === row2 && col1 === col2) return true;

  return false;
}

function getAllPlayingBoardPositions(currPlayer) {
  let playingBoardPositions = [];

  for (let i = 0; i < players.length; i++) {
    playingBoardPositions = playingBoardPositions.concat(getPlayingLocations(currPlayer));
    currPlayer = getNextPlayer(currPlayer);
  }

  playingBoardPositions = playingBoardPositions.concat(getHomeEndLocations(currPlayer));

  return playingBoardPositions;
}

function getYellowHomeStartLocations() {
  return [[2,2],[2,4],[4,2],[4,4]];
}

function getGreenHomeStartLocations() {
  return [[2,14],[2,16],[4,14],[4,16]];
}

function getBlueHomeStartLocations() {
  return [[14, 2], [14, 4], [16, 2], [16, 4]];
}

function getRedHomeStartLocations() {
  return [[14, 14], [14, 16], [16, 14], [16, 16]];
}

function getYellowHomeEndLocations() {
  return [[2, 9], [3, 9], [4, 9], [5, 9]];
}

function getGreenHomeEndLocations() {
  return [[9, 13], [9, 14], [9, 15], [9, 16]];
}

function getRedHomeEndLocations() {
  return [[13, 9], [14, 9], [15, 9], [16, 9]];
}

function getBlueHomeEndLocations() {
  return [[9, 2], [9, 3], [9, 4], [9, 5]];
}

function getHomeEndLocations(colour) {
  if (colour === "yellow") {
    return getYellowHomeEndLocations();
  }
  else if (colour === "green") {
    return getGreenHomeEndLocations();
  }
  else if (colour === "red") {
    return getRedHomeEndLocations();
  }
  else if (colour === "blue") {
    return getBlueHomeEndLocations();
  }
}

function getYellowStartPlayingLocations() {
  return [[0,10],[0,11],[1,11],[2,11],[3,11],[4,11],[5,11],[6,11],[7,11],[7,12],[7,13],[7,14],[7,15],[7,16],[7,17],[7,18],[8,18],[9,18]];
}

function getGreenStartPlayingLocations() {
  return [[10,18],[11,18],[11,17],[11,16],[11,15],[11,14],[11,13],[11,12],[11,11],[12,11],[13,11],[14,11],[15,11],[16,11],[17,11],[18,11],[18,10],[18,9]];
}

function getRedStartPlayingLocations() {
  return [[18,8],[18,7],[17,7],[16,7],[15,7],[14,7],[13,7],[12,7],[11,7],[11,6],[11,5],[11,4],[11,3],[11,2],[11,1],[11,0],[10,0],[9,0]];
}

function getBlueStartPlayingLocations() {
  return [[8,0],[7,0],[7,1],[7,2],[7,3],[7,4],[7,5],[7,6],[7,7],[6,7],[5,7],[4,7],[3,7],[2,7],[1,7],[0,7],[0,8],[0,9]];
}

function getPlayingLocations(colour) {
  if (colour === "yellow") {
    return getYellowStartPlayingLocations();
  }
  else if (colour === "green") {
    return getGreenStartPlayingLocations();
  }
  else if (colour === "red") {
    return getRedStartPlayingLocations();
  }
  else if (colour === "blue") {
    return getBlueStartPlayingLocations();
  }
}

function getYellowHomePlayingLocation() {
  return [0,11];
}

function getGreenHomePlayingLocation() {
  return [11,18];
}

function getRedHomePlayingLocation() {
  return [18,7];
}

function getBlueHomePlayingLocation() {
  return [7,0];
}

export function getHomePlayingLocation(colour) {
  switch (colour) {
    case "yellow": return getYellowHomePlayingLocation();
    case "green":  return getGreenHomePlayingLocation();
    case "red":    return getRedHomePlayingLocation();
    case "blue":   return getBlueHomePlayingLocation();
    default:       return [-1, -1]; // TODO - throw an error
  }
}

function getMarbleOccupyingSpaceFromOneColour (row, col, marbles) {
  for (const marble of marbles) {
    if (marble.row === row && marble.col === col) {
      return marble;
    }
  }

  return null;
}

function getMarbleOccupyingSpaceFromAllColours (row, col, marbles) {
  for (const colour of players) {
    const marble = getMarbleOccupyingSpaceFromOneColour(row, col, marbles[colour]);

    if (marble) {
      return marble;
    }
  }
}

function buildBoardSpaces(marbles) {
  const boardSpaces = [];

  // Create the yellow board spaces
  addPlayingLocationsToBoardSpaces("yellow");
  addPlayingLocationsToBoardSpaces("green");
  addPlayingLocationsToBoardSpaces("red");
  addPlayingLocationsToBoardSpaces("blue");

  return boardSpaces;

  function addPlayingLocationsToBoardSpaces(colour) {
    const locations = getPlayingLocations(colour);

    for (const [row, col] of locations) {

      let [spaceNumber, spaceType] = getNumberAndType(row, col);

      boardSpaces.push({ row: row, col: col, type: spaceType, colour: colour, number: spaceNumber, marble: getMarbleOccupyingSpaceFromAllColours(row, col, marbles)});
    };
  }

  function getNumberAndType(row, col) {
    let spaceNumber = getNumber(row, col);
    let spaceType   = spaceNumber === 18 ? `home-playing-space` : `board-space`;

    return [spaceNumber, spaceType];
  }
}

function buildHomeStartSpaces(marbles) {
  const homeStartSpaces = [];

  createHomeStartSpaces("yellow");
  createHomeStartSpaces("green");
  createHomeStartSpaces("red");
  createHomeStartSpaces("blue");

  return homeStartSpaces;

  function createHomeStartSpaces(colour) {
    const locations = getHomeStartLocations(colour);

    for (const [row, col] of locations) {
      homeStartSpaces.push({ row: row, col: col, type: `home-start`, colour: colour, number: null, marble: getMarbleOccupyingSpaceFromOneColour(row, col, marbles[colour])});
    };
  }
}

function buildHomeEndSpaces(marbles) {
  const homeEndSpaces = [];

  // Create yellow spaces
  createHomeEndSpaces("yellow");
  createHomeEndSpaces("green");
  createHomeEndSpaces("red");
  createHomeEndSpaces("blue");

  return homeEndSpaces;

  function createHomeEndSpaces(colour) {
    const locations = getHomeEndLocations(colour);

    for (const [row, col] of locations) {
      homeEndSpaces.push({ row: row, col: col, type: `home-end`, colour: colour, number: null, marble: getMarbleOccupyingSpaceFromOneColour(row, col, marbles[colour])});
    };
  }
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

function getSpaceInfo(board, row, col) {
  for (const spaceSet of board) {
    for (const space of spaceSet) {
      if (space.row === row && space.col === col) {
        return [space.type, space.colour, space.number, space.marble];
      }
    }
  }

  return [null, null, null];
}