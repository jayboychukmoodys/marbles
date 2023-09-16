function Space({type, number, colour}) {
   // Space represents a single space on the board.
   // It can be a playing space, a home start, or a home end, or a home playing space
   // Playing spaces have a number
   // Home starts and home ends have a colour
   // Home playing spaces have a number and a colour

   // I don't like the idea that non-colour spaces (e.g., playing spaces) have a colour property
   // But I can't think of a better way to do it
   // Maybe I should have a separate component for each type of space
   // But I don't know if that's a good idea
   // I'll leave it for now

   return (
      <div className={`grid-square board-space ${type} ${colour}`}>{number}</div>
   )
}

export default Space;