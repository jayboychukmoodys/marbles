export default function CardComponent({card, currTurn, onClick}) {
   
   const cardStr = currTurn ? card.getRank() + " " + card.getSuit() : "";
   
   return (
      <button className="card" onClick={() => onClick(card)}>{cardStr}</button>
   )
}