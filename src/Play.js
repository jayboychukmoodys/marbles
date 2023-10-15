// Play.js
// Purpose: defines all game rules and logic

import { getHomeStartLocations, getHomePlayingLocation, getNextBoardPosition, isMarbleInStartHome } from "./Board";
import { getTeammate } from "./GameSetup";

export default function play (card, currPlayer, marbles) {
   const marblesCopy = {...marbles};

   if (card !== "J")
   {
      const marblesToMove = marblesCopy[currPlayer];

      if (isOutCard(card))
      {
         updateWhereStartHomeMarblesCanMove ();
      }

      updateWhereMarblesCanMove ();

      return marblesCopy;

      function updateWhereStartHomeMarblesCanMove () {
         const homeStartLocations = getHomeStartLocations(currPlayer);
         const homePlayingLocation = getHomePlayingLocation(currPlayer);
      
         for (const marble of marblesToMove) {
            if (homeStartLocations.some (([row, col]) => row === marble.row && col === marble.col)
             && !isBoardPositionOccupiedAndUnplayable(marbles, currPlayer, getHomePlayingLocation(currPlayer))
            ) 
            {
               marble.whereCanMove.push(homePlayingLocation);
            }
         }
      }

      function updateWhereMarblesCanMove () {
         for (let marble of marbles[currPlayer]) {
            if (!isMarbleInStartHome(marble, currPlayer)) {
               const nextBoardPosition = getNextBoardPosition ([marble.row, marble.col], getNumSpacesCanMove(card), currPlayer);
            
               if (nextBoardPosition && !isBoardPositionOccupiedAndUnplayable (marbles, currPlayer, nextBoardPosition)) {
                  marble.whereCanMove.push(nextBoardPosition);
               }  
            }
         }
      }
   }
   else
   {
      // TODO
   }
}

export function moveMarble (marble) {
   if (marble.whereCanMove.length === 1) {
      const [newRow, newCol] = marble.whereCanMove[0];

      marble.row = newRow;
      marble.col = newCol;
    }
    else { // marble can move to multiple different locations
      // TODO: set all spaces where the marble can move to a button and allow the user to select which space they want to move to
    }
}

function isOutCard (card) {
   const outCards = ["A", "K", "R"];

   if (outCards.includes(card)) return true;

   return false;
}

function getNumSpacesCanMove(card) {
// TODO: assert that card is an expected card number

   switch (card) {
      case "A": return 1;
      case "2": return 2;
      case "3": return 3;
      case "4": return -4;
      case "5": return 5;
      case "6": return 6;
      case "7": return 7; // TODO
      case "8": return 8;
      case "9": return 9;
      case "10": return 10;
      case "Q": return 12;
      case "K": return 13;
      case "R": return 15;
      default : return -1; // TODO - throw an error
   }
}

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