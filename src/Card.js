class Card {
   constructor(rank, suit) {
      this.rank = rank;
      this.suit = suit;
   }

   getRank() {
      return this.rank;
   }

   getSuit() {
      return this.suit;
   }
}

export function areEqualCards (card1, card2) {
   return card1.rank === card2.rank && card1.suit === card2.suit;
}

export default Card;