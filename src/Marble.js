// Marble.js
// Purpose: defines structures specific to a marble

export default function MarbleSpace ({color, onClick, disabled}) {
  return (
    <button className={`board-space marble ${color} ${disabled ? `disabled` : `enabled`}`} onClick={() => onClick()} disabled={disabled}></button>
  );
}

export function areEqual(marbleA, marbleB) {
   return marbleA.row === marbleB.row && marbleA.col === marbleB.col;
}