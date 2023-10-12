// Marble.js
// Purpose: defines structures specific to a marble
import { players } from './GameSetup'

export default function MarbleSpace ({color, onClick, disabled}) {
  return (
    <button className={`board-space marble ${color} ${disabled ? `disabled` : `enabled`}`} onClick={() => onClick()} disabled={disabled}></button>
  );
}

export function areEqual(marbleA, marbleB) {
   return marbleA.row === marbleB.row && marbleA.col === marbleB.col;
}

export function resetWhereCanMoveLocations(marbles) {
   for (const player of players) {
      for (const marble of marbles[player]) {
         marble.whereCanMove = [];
      }
   }
}