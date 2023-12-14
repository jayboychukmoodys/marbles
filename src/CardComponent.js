export default function CardComponent({card, currTurn, onClick, playable}) {
   
   const cardStr = currTurn ? card.getRank() + " " + card.getSuit() : "";
   
   return (
      <button className="card" onClick={() => onClick(card)} disabled={!playable}>{cardStr}</button>
   )
}