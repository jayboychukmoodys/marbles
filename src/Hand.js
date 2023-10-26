import CardComponent from './CardComponent'

export default function Hand({currHand, currTurn, onCardClick}) {
   const cards = [];

   for (const card of currHand) {
      if (card) {
         cards.push(<CardComponent card={card} currTurn={currTurn} onClick={onCardClick}></CardComponent>);
      }
   }

   return (
      <div className='Hand'>
         {cards}
      </div>
   )
}