import { useState, useRef } from 'react';
import './styles.css';
import Board, { getHomeStartLocations, allMarblesInEndHome } from './Board'
import play, { moveMarble } from './Play'
import { players, getNextPlayer, getTeammate } from './GameSetup'
import { areEqual, resetWhereCanMoveLocations } from './Marble'
import { areEqualCards } from './Card'
import Hand from './Hand'
import Deck from './Deck'

// Task list:
// - Add all the rules (e.g., 4, 7, J, R rules; marble in playing home rule; can't hop inside end home rule)
// - Update the images of the cards to actual card images (see the svg images online)

const initialMarbles = players.reduce((marblesDict, player) => {
  marblesDict[player] = getHomeStartLocations(player).map(([marbleRow, marbleCol]) => ({
    row: marbleRow,
    col: marbleCol,
    colour: player,
    whereCanMove: [],
  }));
  return marblesDict;
}, {});

const initialHands = players.reduce((handsDict, player) => {
  handsDict[player] = [null, null, null, null, null];
  return handsDict;
}, {});

const dealingSequence = [5, 4, 4];

function MarblesGame() {

  const [marbles, setMarbles]         = useState(initialMarbles);
  const [hands, setHands]             = useState(initialHands);

  const player  = useRef("green");
  const deck    = useRef(new Deck());
  const dealNum = useRef(0);
  const dealer  = useRef("yellow");

  function startGame () {
    resetDealAndDeck("yellow");
    dealCards();
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
    const tempHands = {...hands};

    for (let i = 0; i < dealingSequence[dealNum.current]; i++) {
      let playerToGetCard = player.current;
      do {
        hands[playerToGetCard][i] = deck.current.dealCard();
        playerToGetCard = getNextPlayer(playerToGetCard);
      } while (playerToGetCard !== player.current);
    }

    setHands(tempHands);
  }

  function onMarbleClick(marble) {
    const updatedMarbles = {...marbles};

    for (const updatedMarble of updatedMarbles[marble.colour]) {
      if (areEqual(updatedMarble, marble)) {
        moveMarble(updatedMarble);
      }
    }

    resetWhereCanMoveLocations (updatedMarbles);

    setMarbles(updatedMarbles);

    prepareNextTurn();
  }

  function onCardClick(card) {
    const [updatedMarbles, isCardPlayable] = play(card.getRank(), player.current, marbles);

    const tempHands = {...hands};

    removeCardFromHand(card, tempHands[player.current]);

    setHands(tempHands);

    if (isCardPlayable) {
      setMarbles(updatedMarbles);
    }
    else
    {
      prepareNextTurn();
    }
  }

  function removeCardFromHand(card, hand) {
    let index = 0; // TODO - figure out the syntax in the for loop to get the index (i.e., something like "for (let [handCard, index] of hand) {}")
    
    for (let handCard of hand) {
      if (handCard && areEqualCards(card, handCard)) {
        hand[index] = null;
        // TODO - break out of for loop
      }
      index++;
    }
  }

  function setNextPlayer() {
    player.current = getNextPlayer(player.current);
  }

  function prepareNextTurn() {
    checkForWinner();

    setNextPlayer();

    if (requireNewDeal()) {
      setDealingParameters();
      dealCards();
    }
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
  
  return (
    <>
      <div className="game-area">
        <div className="hand-area">
          <Hand currHand={hands[players[0]]} currTurn={player.current===players[0]} onCardClick={onCardClick}/>
          <Hand currHand={hands[players[3]]} currTurn={player.current===players[3]} onCardClick={onCardClick}/>
        </div>
        <Board marbles={marbles} onMarbleClick={onMarbleClick}/>
        <div className="hand-area">
          <Hand currHand={hands[players[1]]} currTurn={player.current===players[1]} onCardClick={onCardClick}/>
          <Hand currHand={hands[players[2]]} currTurn={player.current===players[2]} onCardClick={onCardClick}/>
        </div>
      </div>
      <div className="start-game-area">
        <button className="start-game" onClick={() => startGame()}>Start Game</button>
      </div>
    </>
  );
}

export default MarblesGame;