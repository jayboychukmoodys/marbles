import { useState, useRef } from 'react';
import './styles.css';
import Board, { getHomeStartLocations, allMarblesInEndHome, getNumSpacesBetween, getAllPlayingPositionsInRange } from './Board'
import playAndGetNumberOfPossibleMoves, { playRemainderOfCard } from './Play'
import { players, getNextPlayer, getTeammate, areOnOpposingTeams } from './GameSetup'
import { areEqual } from './Marble'
import Card, { areEqualCards } from './Card'
import Hand from './Hand'
import Deck from './Deck'

// Task list:
// - Add all the rules (e.g., have to play a playable card rule; when you finish you play the other players marbles)
// - Put the last played card in the middle of the board - this is important for the Joker where the card is played automatically. Right now you just can't see the card played
// - Update the images of the cards to actual card images (see the svg images online)
// - fix the board to the screen so it doesn't keep moving every time cards are played
// - make it easy to know which hand belongs to which colour player
// - create test cases
// - standardize the use of "colour" and "player" in all names
// - standardize the use of "boardPosition", "space", or whatever else I used
// - can I add some sort of data structure or something to iterate through all marbles? so I'm not constantly writing 2 for loops
// - if there's only one possible move, just make it automatically instead of making the player do it
// - create a home screen where user can select rules (i.e., which colour starts, what to with jokers)
// - make it hosted online and allow multiplayer

const initialMarbles = players.reduce((marblesDict, player) => {
  marblesDict[player] = getHomeStartLocations(player).map(([marbleRow, marbleCol]) => ({
    row: marbleRow,
    col: marbleCol,
    colour: player,
    whereCanMove: [],
    allowUserToSelectWhereCanMove: false,
  }));
  return marblesDict;
}, {});

const initialHands = players.reduce((handsDict, player) => {
  handsDict[player] = [];
  return handsDict;
}, {});

const extraCardPlayedImmediatelyForRedJoker   = true;
const extraCardPlayedImmediatelyForBlackJoker = true;

const dealingSequence = [5, 4, 4];

function MarblesGame() {

  const [marbles, setMarbles]         = useState(initialMarbles);
  const [hands, setHands]             = useState(initialHands);

  const player          = useRef("green");
  const deck            = useRef(new Deck());
  const dealNum         = useRef(0);
  const dealer          = useRef("yellow");
  const selectedMarble  = useRef(null);
  const playedCard      = useRef(null);
  const spacesLeftIn7   = useRef(0); // TODO - refactor this. Shouldn't be this dependency bt playedCard and spacesLeftIn7

  function startGame() {
    resetDealAndDeck("yellow");
    dealCards();
  }

  /* FOR TESTING PURPOSES */
  function implementTest() {
    marbles["green"][0].row = 9;
    marbles["green"][0].col = 14;

    setMarbles({...marbles});

    hands["green"][0] = new Card("4", "S");

    setHands({...hands});
  }
  /* FOR TESTING PURPOSES */

  function onMarbleClick(marble) {
    for (const updatedMarble of marbles[marble.colour]) {
      if (areEqual(updatedMarble, marble)) {
        if (isCurrCardJack()) {
          if (selectingFirstMarbleForJack()) {
            selectedMarble.current = marble;
            marble.whereCanMove = [];
          }
          else { // selecting second marble
            swapCurrentMarbleWith(marble);

            prepareNextTurn();
          }
        }
        else {
          updateMarblesBasedOnWhereCanMovePositions(updatedMarble);
        }

        break;
      }
    }

    setMarbles({...marbles});
  }

  function isCurrCardJack() {
    return playedCard.current.getRank() === "J";
  }

  function swapCurrentMarbleWith(marble) {
    const tempPosition = [marble.row, marble.col];
    [marble.row, marble.col] = [selectedMarble.current.row, selectedMarble.current.col];
    [selectedMarble.current.row, selectedMarble.current.col] = tempPosition;
  }

  function onCardClick(card) {
    playCard(card);
  }

  function playCard(card) {
    const cardRank = card.getRank();

    playedCard.current = card;

    if (cardRank === "7") spacesLeftIn7.current = 7;

    const isCardPlayable = playAndGetNumberOfPossibleMoves(cardRank, player.current, marbles);

    removeCardFromHand(card, hands[player.current]);

    setHands({ ...hands });

    if (isCardPlayable) {
      setMarbles({ ...marbles });
    }

    else {
      prepareNextTurn();
    }
  }

  function onBoardPositionClick(newPosition) {
    const oldPosition = [selectedMarble.current.row, selectedMarble.current.col];

    selectedMarble.current.row = newPosition[0];
    selectedMarble.current.col = newPosition[1];

    killAllOpposingMarblesBetweenPositions(oldPosition, newPosition, player.current, marbles);

    spacesLeftIn7.current -= getNumSpacesBetween(oldPosition, newPosition, player.current);

    resetWhereCanMoveLocations();

    // TODO: ASSERT (numSpacesLeft >= 0);

    if (spacesLeftIn7.current > 0) {
      const isCardPlayable = playRemainderOfCard(spacesLeftIn7.current, player.current, marbles);
      
      if (isCardPlayable) {
        setMarbles({...marbles});
      }
      else
      {
        prepareNextTurn();
      }
    }
    else {
      prepareNextTurn();

      setMarbles({...marbles});
    }
  }

  function resetDealAndDeck(newDealer) {
    setNewDealer(newDealer);
    createDeck();
  }

  function setNewDealer(newDealer) {
    dealer.current = newDealer;
    player.current = getNextPlayer(newDealer);

    dealNum.current = 0;
  }

  function createDeck() {
    deck.current = new Deck();
    deck.current.shuffle();
  }

  function setDealingParameters() {
    if (dealNum.current === dealingSequence.length - 1) {
      resetDealAndDeck(getNextPlayer(dealer.current));
    }
    else {
      dealNum.current += 1;
    }
  }

  function dealCards() {
    for (let i = 0; i < dealingSequence[dealNum.current]; i++) {
      let playerToGetCard = player.current;
      do {
        hands[playerToGetCard].push(deck.current.dealCard());
        playerToGetCard = getNextPlayer(playerToGetCard);
      } while (playerToGetCard !== player.current);
    }

    setHands({...hands});
  }

  function updateMarblesBasedOnWhereCanMovePositions (marble) {
    if (marble.whereCanMove.length === 1) {
      const [newRow, newCol] = marble.whereCanMove[0];
 
      marble.row = newRow;
      marble.col = newCol;

      killOpposingMarbleInBoardPosition(marble.whereCanMove[0], marble.colour);

      resetWhereCanMoveLocations();

      prepareNextTurn();
    }
    else { // marble can move to multiple different locations
      marble.allowUserToSelectWhereCanMove = true;

      selectedMarble.current               = marble;
    }
  }
 
 function killOpposingMarbleInBoardPosition(boardPosition, currPlayer) {
    for (const player of players) {
      if (areOnOpposingTeams(player, currPlayer)) {
        for (const marble of marbles[player]) {
          if (isMarbleInBoardPosition(marble, boardPosition)) {
            const homeStartLocation = getNextAvailableHomeStartLocation(marble.colour, marbles);
  
            marble.row = homeStartLocation[0];
            marble.col = homeStartLocation[1];
          }
        }
      }
    }
  }

  function killAllOpposingMarblesBetweenPositions(startPosition, endPosition, currPlayer) {
    const boardPositions = getAllPlayingPositionsInRange(startPosition, endPosition, currPlayer);

    for (const boardPosition of boardPositions) {
      killOpposingMarbleInBoardPosition(boardPosition, currPlayer);
    }
  }

  function resetWhereCanMoveLocations() {
    let tempMarbles = {...marbles};

    for (const player of players) {
       for (const marble of tempMarbles[player]) {
          marble.whereCanMove = [];
          marble.allowUserToSelectWhereCanMove = false;
       }
    }
 }
  
  function isMarbleInBoardPosition(marble, boardPosition) {
    return marble.row === boardPosition[0] && marble.col === boardPosition[1];
  }
  
  function getNextAvailableHomeStartLocation(currPlayer) {
    const homeStartLocations = getHomeStartLocations(currPlayer);
  
    for (const homeStartLocation of homeStartLocations) {
      let isLocationOccupied = false;
  
      for (const marble of marbles[currPlayer]) {
        if (marble.row === homeStartLocation[0] && marble.col === homeStartLocation[1]) {
          isLocationOccupied = true;
          break;
        }
      }
  
      if (!isLocationOccupied) return homeStartLocation;
    }
  
    // return error
  }

  function removeCardFromHand(card, hand) {
    let index = 0; // TODO - figure out the syntax in the for loop to get the index (i.e., something like "for (let [handCard, index] of hand) {}")
    
    for (let handCard of hand) {
      if (handCard && areEqualCards(card, handCard)) {
        hand.splice(index, 1);
        break;
      }
      index++;
    }
  }

  function setNextPlayer() {
    player.current = getNextPlayer(player.current);
  }

  function prepareNextTurn() {
    checkForWinner();

    if (isCurrCardJoker()) {
      playSecondCardForJoker();
    }
    else {
      resetPerTurnVariables();

      setNextPlayer();

      if (requireNewDeal()) {
        setDealingParameters();
        dealCards();
      }
    }
  }

  function isCurrCardJoker() {
    return playedCard.current.getRank() === "R";
  }

  function playSecondCardForJoker() {
    // ASSERT (playedCard.current.getRank() === "R")
    const newCard = deck.current.dealCard();

    const cardPlayedImmediately = playedCard.current.getSuit() === "R" ? extraCardPlayedImmediatelyForRedJoker : extraCardPlayedImmediatelyForBlackJoker;

    hands[player.current].push(newCard);
    
    if (cardPlayedImmediately) {
      playCard(newCard);
    }
  }

  function resetPerTurnVariables() {
    resetWhereCanMoveLocations();

    selectedMarble.current = null;
    playedCard.current     = null;

    spacesLeftIn7.current  = 0;
  }

  function checkForWinner() {
    if (allMarblesInEndHome(player.current, marbles[player.current]) && allMarblesInEndHome(getTeammate(player.current), marbles[getTeammate(player.current)])) {
      // TODO - display winning team
      // TODO - end game
    }
  }

  function requireNewDeal() {
    return getNumCards(hands[dealer.current]) === 0;
  }

  function getNumCards(hand) {
    let count = 0;

    for (const card of hand) {
      if (card !== null) count += 1;
    }

    return count;
  }

  function selectingFirstMarbleForJack() {
    return selectedMarble.current === null;
  }
  
  return (
    <>
      <div className="game-area">
        <div className="hand-area">
          <Hand currHand={hands[players[0]]} currTurn={player.current===players[0]} onCardClick={onCardClick}/>
          <Hand currHand={hands[players[3]]} currTurn={player.current===players[3]} onCardClick={onCardClick}/>
        </div>
        <Board marbles={marbles} onMarbleClick={onMarbleClick} onBoardPositionClick={onBoardPositionClick}/>
        <div className="hand-area">
          <Hand currHand={hands[players[1]]} currTurn={player.current===players[1]} onCardClick={onCardClick}/>
          <Hand currHand={hands[players[2]]} currTurn={player.current===players[2]} onCardClick={onCardClick}/>
        </div>
      </div>
      <div className="start-game-area">
        <button className="start-game" onClick={() => startGame()}>Start Game</button>
        <button className="start-game" onClick={() => implementTest()}>Implement test case</button>
      </div>
    </>
  );
}

export default MarblesGame;