// Play.js
// Purpose: defines all game rules and logic

import { getHomePlayingLocation, getNextBoardPosition, isMarbleInStartHome, getPlayingHomePositionWithColourInRange, isSameBoardPosition, getHomeEndLocations, isMarbleInPlayingHome, isMarbleInEndHome } from "./Board";
import { players, getTeammate } from "./GameSetup";
import { areEqual } from "./Marble"

export default function playAndGetNumberOfPossibleMoves (cardRank, currPlayer, marbles) {
   let countPossibleMoves = 0;

   if (cardRank !== "J")
   {
      if (isOutCard(cardRank)) {
         countPossibleMoves += updateWhereStartHomeMarblesCanMove (currPlayer, marbles);
      }

      countPossibleMoves += updateWhereMarblesCanMove (getNumSpacesCanMove(cardRank), currPlayer, marbles, cardRank === "7");

      return countPossibleMoves > 0;
   }
   else // cardRank === "J"
   {
      const boardPositionsWithAMarble = getPlayingBoardPositionsWithAMarbleForJack(marbles, currPlayer);

      const countPossibleMoves = updateWhereMarblesCanMoveFromJack(marbles, boardPositionsWithAMarble, currPlayer);

      return countPossibleMoves;
   }
}

export function playRemainderOfCard (numSpaces, currPlayer, marbles) {
   const countPossibleMoves = updateWhereMarblesCanMove (numSpaces, currPlayer, marbles, true /*isCardASeven*/);
   
   return countPossibleMoves > 0;
}

function canMarbleBeMovedWithJack(marble, currPlayer) {
   return !isMarbleInStartHome(marble) && (!isMarbleInPlayingHome(marble) || marble.colour === currPlayer) && !isMarbleInEndHome(marble);
}

function updateWhereMarblesCanMoveFromJack(marbles, boardPositionsWithAMarble, currPlayer) {
   let countPossibleMoves = 0;
   
   for (const player of players) {
      for (const marble of marbles[player]) {
         if (canMarbleBeMovedWithJack(marble, currPlayer)) {
            for (const boardPosition of boardPositionsWithAMarble) {
               if (boardPosition.marbleColour !== marble.colour ) {
                  marble.whereCanMove.push(boardPosition.position);
                  countPossibleMoves++;
               }
            }
         }
      }
   }

   return countPossibleMoves;
}

function getPlayingBoardPositionsWithAMarbleForJack(marbles, currPlayer) {
   let playingBoardPositionsWithAMarble = [];
   
   for (const player of players) {
      for (const marble of marbles[player]) {
         if (canMarbleBeMovedWithJack(marble, currPlayer)) {
            playingBoardPositionsWithAMarble.push({position: [marble.row, marble.col], marbleColour: marble.colour});
         }
      }
   }

   return playingBoardPositionsWithAMarble;
}

function updateWhereStartHomeMarblesCanMove (currPlayer, marbles) {
   let countPossibleMoves = 0;

   const homePlayingLocation = getHomePlayingLocation(currPlayer);

   const marblesToMove = marbles[currPlayer];

   for (const marble of marblesToMove) {
      if (isMarbleInStartHome(marble) && !isBoardPositionOccupiedAndUnplayable(marbles, currPlayer, homePlayingLocation)) 
      {
         marble.whereCanMove.push(homePlayingLocation);
         countPossibleMoves++;
      }
   }

   return countPossibleMoves;
}

function updateWhereMarblesCanMove (numSpaces, currPlayer, marbles, isCardASeven) {
   let countPossibleMoves = 0;

   if (!isCardASeven) {
      addBoardPositionToWhereCanMove(numSpaces);
   }
   else { // isCardASeven
      for (let space=1; space <= numSpaces; space++) {
         addBoardPositionToWhereCanMove(space);
      }

      if (countPossibleMoves < numSpaces) {
         return 0;
      }
   }

   return countPossibleMoves;

   function addBoardPositionToWhereCanMove(numSpaces) {
      for (let marble of marbles[currPlayer]) {
         if (!isMarbleInStartHome(marble)) {
            const nextBoardPosition = getNextBoardPosition ([marble.row, marble.col], numSpaces, currPlayer);
         
            if (nextBoardPosition && canMarbleMoveToNextBoardPosition(marble, marbles, nextBoardPosition, currPlayer, numSpaces >= 0)) {
               marble.whereCanMove.push(nextBoardPosition);
               countPossibleMoves++;
            }  
         }
      }
   }
}

function isOutCard (cardRank) {
   const outCards = ["A", "K", "R"];

   if (outCards.includes(cardRank)) return true;

   return false;
}

function getNumSpacesCanMove(cardRank) {
// TODO: assert that card is an expected card number

   switch (cardRank) {
      case "A": return 1;
      case "2": return 2;
      case "3": return 3;
      case "4": return -4;
      case "5": return 5;
      case "6": return 6;
      case "7": return 7;
      case "8": return 8;
      case "9": return 9;
      case "10": return 10;
      case "Q": return 12;
      case "K": return 13;
      case "R": return 15;
      default : return -1; // TODO - throw an error
   }
}

// Rule: a marble cannot move to a space that is occupied by one of it's own or one of it's teammates marbles
function isBoardPositionOccupiedAndUnplayable(marbles, currPlayer, boardPosition) {
   const teammate                             = getTeammate(currPlayer);
   const [boardPositionRow, boardPositionCol] = boardPosition;
   const ownTeamsMarbles                      = marbles[currPlayer].concat(marbles[teammate]);

   for (const marble of ownTeamsMarbles) {
      if (marble.row === boardPositionRow && marble.col === boardPositionCol) {
         return true;
      }
   }

   return false;
}

function canMarbleMoveToNextBoardPosition(marble, marbles, nextBoardPosition, currPlayer, isCardMovingForward) {
   return !isBoardPositionOccupiedAndUnplayable (marbles, currPlayer, nextBoardPosition)
       && !blockedByOtherMarbleInPlayingHome (marble, marbles, nextBoardPosition, currPlayer, isCardMovingForward)
       && !blockedByOtherMarbleInEndHome (marble, marbles, nextBoardPosition, currPlayer)
       && !isMarbleInEndHomeAndNextPositionNotInEndHome(marble, nextBoardPosition)
      ;
}

// Rule: if a marble is in it's own colours playing home, no other marble can pass it (either going forward or backward)
function blockedByOtherMarbleInPlayingHome (marble, marbles, endPosition, currPlayer, isMovingForward) {
   const playingHomePositionWithColour = getPlayingHomePositionWithColourInRange([marble.row, marble.col], endPosition, currPlayer, isMovingForward);

   if (playingHomePositionWithColour) {
      for (const homeMarble of marbles[playingHomePositionWithColour.colour]) {
         if (isSameBoardPosition([homeMarble.row, homeMarble.col], playingHomePositionWithColour.position)) {
            return true;
         }
      }
   }

   return false;
}

function blockedByOtherMarbleInEndHome (marbleToMove, allMarbles, endPosition) {
   const currPlayer = marbleToMove.colour;
   
   if (isInEndHome(endPosition, currPlayer)) {
      const endHomePositions = getHomeEndLocations(currPlayer);

      const indexOfEndPosition = getIndexOfPosition(endPosition, endHomePositions);

      const endHomePositionsToSearch = endHomePositions.slice(0, indexOfEndPosition + 1);
      
      for (const marble of allMarbles[currPlayer]) {
         if (!areEqual(marble, marbleToMove) && endHomePositionsToSearch.some(([row, col]) => marble.row === row && marble.col === col)) {
            return true;
         }
      }
   }

   return false;
}

function isMarbleInEndHomeAndNextPositionNotInEndHome(marble, nextBoardPosition) {
   return isMarbleInEndHome(marble) && !isInEndHome(nextBoardPosition, marble.colour);
}

function isInEndHome(position, currPlayer) {
   const endHomePositions = getHomeEndLocations(currPlayer);

   return endHomePositions.some(([row, col]) => position[0] === row && position[1] === col);
}

function getIndexOfPosition(positionToFind, positionsArray) {
   let index = 0;

   for (const position of positionsArray) {
      if (position[0] === positionToFind[0] && position[1] === positionToFind[1]) {
         return index;
      }
      index += 1;
   }

   return null;
}