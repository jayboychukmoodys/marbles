import Card from './Card';

class Deck {
   constructor() {
      this.suits = ['C', 'D', 'H', 'S'];
      this.ranks = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];

      this.cards = [];

      for (const suit of this.suits) {
         for (const rank of this.ranks) {
            this.cards.push(new Card(rank, suit));
         }
      }

      this.cards.push(new Card('R', 'R')); // push red joker
      this.cards.push(new Card('R', 'B')); // push black joker

      this.dealtCards = 0;
   }

   shuffle () {
      // fisher-yates shuffling algorithm
      for (let currIndex = this.cards.length-1; currIndex > 0; currIndex--) {
         const randIndex = Math.floor(Math.random() * this.cards.length);

         [this.cards[currIndex], this.cards[randIndex]] = [this.cards[randIndex], this.cards[currIndex]];
      }
   }

   dealCard () {
      return this.cards[this.dealtCards++];
   }
}

export default Deck;