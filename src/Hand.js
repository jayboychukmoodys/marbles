import CardComponent from './CardComponent'
import calculateMoves, { setCurrMarble } from './Play';
import { UpdateMarbles } from './GameSetup';

export default function Hand({currHand, currTurn, onCardClick, marbles, currPlayer}) {
   const cards = [];

   let atLeastOnePlayable = false;

   for (const card of currHand) {
      const cardRank = card.getRank();

      card.isPlayable = isPlayable(cardRank, marbles, currPlayer); // TODO - this seems dangerous. Is there a way to code this safer?

      atLeastOnePlayable = atLeastOnePlayable || (card.isPlayable && cardRank !== "J"); // TODO - refactor this logic into a function
   }

   for (const [index, card] of currHand.entries()) {
      if (card) {
         const playable = currTurn && (card.isPlayable || !atLeastOnePlayable);
         cards.push(<CardComponent key={index} card={card} currTurn={currTurn} onClick={onCardClick} playable={playable}></CardComponent>);
      }
   }

   return (
      <div className='Hand'>
         {cards}
      </div>
   )
}

function isPlayable(cardRank, marbles, currPlayer) {
   const currMarbleToMove = setCurrMarble(currPlayer, marbles[currPlayer]);

   return calculateMoves(cardRank, currMarbleToMove, marbles, UpdateMarbles.NO) > 0;
}