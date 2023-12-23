// Play.js
// Purpose: defines all game rules and logic

import { getHomePlayingLocation, getNextBoardPosition, isMarbleInStartHome, getPlayingHomePositionWithColourInRange, isSameBoardPosition, getHomeEndLocations, isMarbleInPlayingHome, isMarbleInEndHome, isMarbleInOneOfBoardPositions, allMarblesInEndHome, getNumAvailableSpacesInEndHome } from "./Board";
import { players, getTeammate, UpdateMarbles } from "./GameSetup";
import { areEqual } from "./Marble"

export default function calculateMoves (cardRank, currPlayer, marbles, updateMarbles) {
   let countPossibleMoves = 0;

   if (cardRank !== "J")
   {
      if (isOutCard(cardRank)) {
         countPossibleMoves += calculateMovesFromStartHomeMarbles (currPlayer, marbles, updateMarbles);
      }

      countPossibleMoves += calculateMovesFromMarblesInPlay (getNumSpacesCanMove(cardRank), currPlayer, marbles, cardRank === "7", updateMarbles);

      return countPossibleMoves;
   }
   else // cardRank === "J"
   {
      const boardPositionsWithAMarble = getPlayingBoardPositionsWithAMarbleForJack(marbles, currPlayer);

      const countPossibleMoves = calculateMovesFromMarblesInPlayForJack(marbles, boardPositionsWithAMarble, currPlayer, updateMarbles);

      return countPossibleMoves;
   }
}

export function playRemainderOfCard (numSpaces, currPlayer, marbles) {
   let currMarbleColourToMove = allMarblesInEndHome(currPlayer, marbles[currPlayer]) ? getTeammate(currPlayer) : currPlayer;

   const countPossibleMoves = calculateMovesFromMarblesInPlay (numSpaces, currMarbleColourToMove, marbles, true /*isCardASeven*/, UpdateMarbles.YES);
   
   return countPossibleMoves > 0;
}

export function setCurrMarble(currPlayer, currPlayerMarbles) {
   return allMarblesInEndHome(currPlayer, currPlayerMarbles) ? getTeammate(currPlayer) : currPlayer;
}

function canMarbleBeMovedWithJack(marble, currPlayer) {
   return !isMarbleInStartHome(marble) && (!isMarbleInPlayingHome(marble) || marble.colour === currPlayer) && !isMarbleInEndHome(marble);
}

function calculateMovesFromMarblesInPlayForJack(marbles, boardPositionsWithAMarble, currPlayer, updateMarbles) {
   let countPossibleMoves = 0;
   
   for (const player of players) {
      for (const marble of marbles[player]) {
         if (canMarbleBeMovedWithJack(marble, currPlayer)) {
            for (const boardPosition of boardPositionsWithAMarble) {
               if (boardPosition.marbleColour !== marble.colour) { // can't switch 2 marbles of the same colour
                  if (updateMarbles) marble.whereCanMove.push(boardPosition.position);
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

function calculateMovesFromStartHomeMarbles (currPlayer, marbles, updateMarbles) {
   let countPossibleMoves = 0;

   for (const marble of marbles[currPlayer]) {
      if (isMarbleInStartHomeAndPlayable(marble, marbles, currPlayer)) 
      {
         if (updateMarbles) marble.whereCanMove.push(getHomePlayingLocation(currPlayer));
         countPossibleMoves++;
      }
   }

   return countPossibleMoves;
}

function isMarbleInStartHomeAndPlayable(marble, marbles, currPlayer) {
   return isMarbleInStartHome(marble) && !isBoardPositionOccupiedAndUnplayable(marbles, currPlayer, getHomePlayingLocation(currPlayer), true /*countTeammate*/);
}

function calculateMovesFromMarblesInPlay (numSpaces, currPlayer, marbles, isCardASeven, updateMarbles, isForTeammatesMarbles = false) {
   let countPossibleMoves = 0;
   let countMarblesThatMoveIntoEndHome = 0;

   if (!isCardASeven) {
      calculateMoves(numSpaces);
   }
   else { // isCardASeven
      for (let space=1; space <= numSpaces; space++) {
         calculateMoves(space);
      }

      if (countPossibleMoves < numSpaces) {
         if (canMoveAllMarblesIntoEndHome(currPlayer)) {
            const teammate = getTeammate(currPlayer);

            if (!isForTeammatesMarbles && !allMarblesInEndHome(teammate, marbles[teammate])) {
               return calculateMovesFromMarblesInPlay (numSpaces - countPossibleMoves, getTeammate(currPlayer), marbles, isCardASeven, UpdateMarbles.NO, true /* isForTeammatesMarbles */);
            }

            return countPossibleMoves;
         }

         return 0;
      }
   }

   return countPossibleMoves;

   function calculateMoves(numSpacesThisRound) {
      for (let marble of marbles[currPlayer]) {
         if (!isMarbleInStartHome(marble)) {
            const currBoardPosition = [marble.row, marble.col];
            const nextBoardPosition = getNextBoardPosition (currBoardPosition, numSpacesThisRound, currPlayer)

            if (nextBoardPosition !== null) {
               const canMarbleMoveNow = canMarbleMoveToNextBoardPosition(marble, marbles, nextBoardPosition, currPlayer, numSpacesThisRound >= 0, isCardASeven, updateMarbles);
               const canMarbleNotMoveNowButWillBeAbleToMoveWith7 = canMarbleMoveNow ? false : canMarbleMoveToNextBoardPosition(marble, marbles, nextBoardPosition, currPlayer, numSpacesThisRound >= 0, isCardASeven, UpdateMarbles.NO);
            
               if (canMarbleMoveNow || canMarbleNotMoveNowButWillBeAbleToMoveWith7) {
                  if (updateMarbles && canMarbleMoveNow) {
                     marble.whereCanMove.push(nextBoardPosition);
                  }

                  if (!isInEndHome(currBoardPosition, currPlayer) && isInEndHome(nextBoardPosition, currPlayer)) {
                     countMarblesThatMoveIntoEndHome++;
                  }

                  countPossibleMoves++;
               }
            }
         }
      }
   }

   function canMoveAllMarblesIntoEndHome(player) {
      return countMarblesThatMoveIntoEndHome === getNumAvailableSpacesInEndHome(player, marbles[player]);
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
function isBoardPositionOccupiedAndUnplayable(marbles, currPlayer, boardPosition, countTeammate) {
   const [boardPositionRow, boardPositionCol] = boardPosition;
   let ownTeamsMarbles = countTeammate ? marbles[currPlayer].concat(marbles[getTeammate(currPlayer)]) : marbles[currPlayer];

   for (const marble of ownTeamsMarbles) {
      if (marble.row === boardPositionRow && marble.col === boardPositionCol) {
         return true;
      }
   }

   return false;
}

function canMarbleMoveToNextBoardPosition(marble, marbles, nextBoardPosition, currPlayer, isCardMovingForward, isCardASeven, updateMarbles) {
   return !isBoardPositionOccupiedAndUnplayable (marbles, currPlayer, nextBoardPosition, true /*countTeammate*/)
       && !blockedByOtherMarbleInPlayingHome (marble, marbles, nextBoardPosition, currPlayer, isCardMovingForward)
       && ((isCardASeven && !updateMarbles) || !blockedByOtherMarbleInEndHome (marble, marbles, nextBoardPosition))
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

      const indexOfStartPosition = getIndexOfPosition([marbleToMove.row, marbleToMove.col], endHomePositions);
      const indexOfEndPosition   = getIndexOfPosition(endPosition, endHomePositions);

      const endHomePositionsToSearch = indexOfStartPosition !== null ? endHomePositions.slice(indexOfStartPosition + 1, indexOfEndPosition + 1) : endHomePositions.slice(0, indexOfEndPosition + 1);

      for (const marble of allMarbles[currPlayer]) {
         if (!areEqual(marble, marbleToMove) && isMarbleInOneOfBoardPositions(marble, endHomePositionsToSearch)) {
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

export function getMarblesFor(player, marbles) {
   return allMarblesInEndHome(player, marbles) ? marbles[getTeammate(player)] : marbles[player];
}