function Space({type, number, colour, marbleColour}) {

   let spaceColour = null;

   if (type === `home-playing-space` || type === `home-start` || type === `home-end`) {
      spaceColour = colour;
   }

   if (marbleColour) {
      spaceColour = marbleColour;
   }

   return (
      <div className={`grid-square board-space ${spaceColour}`}>
         {number}
      </div>
   )
}

export default Space;