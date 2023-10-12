import { useState } from 'react';
import './styles.css';
import Board, { getHomeStartLocations } from './Board'
import play, { moveMarble } from './Play'
import { players, getNextPlayer } from './GameSetup'
import { areEqual, resetWhereCanMoveLocations } from './Marble'

const initialMarbles = players.reduce((marblesDict, player) => {
  marblesDict[player] = getHomeStartLocations(player).map(([marbleRow, marbleCol]) => ({
    row: marbleRow,
    col: marbleCol,
    colour: player,
    whereCanMove: [],
  }));
  return marblesDict;
}, {});

function MarblesGame() {

  const [marbles, setMarbles]       = useState(initialMarbles);
  const [currPlayer, setCurrPlayer] = useState("green");

  function playGame () {
    // Deal cards - TODO
    
    // Turn selects a card to play
    let card = "K";
    const updatedMarbles = play(card, currPlayer, marbles);
    setMarbles(updatedMarbles);

    // Turn ends

    // Check for winner

    // Set next turn
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

    setCurrPlayer(getNextPlayer(currPlayer));
  }
  
  return (
    <>
      <Board marbles={marbles} onMarbleClick={onMarbleClick}/>
      <button onClick={() => playGame()}>Start Game</button>
    </>
  );
}

// Next step - pass the onMarbleClick to the Board component - onMarbleClick should probably be defined in the Play.js file?


export default MarblesGame;