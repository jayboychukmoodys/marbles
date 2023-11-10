function Space({type, number, colour, marbleColour, disabled, onClick}) {

   let spaceColour = null;

   if (type === `home-playing-space` || type === `home-start` || type === `home-end`) {
      spaceColour = colour;
   }

   if (marbleColour) {
      spaceColour = marbleColour;
   }

   const classNameVar = `grid-square board-space ${spaceColour}`;

   const returnComponent = disabled ?
      <div className={classNameVar}>
         {number}
      </div> :
      <button className={classNameVar + ` enabled`} onClick={onClick}>
         {number}
      </button> 
      ;

   return returnComponent;
}

export default Space;