// GameSetup.js
// Purpose: defines all structures required for basic setup

export const players = [
   "yellow",
   "green",
   "red",
   "blue"
 ]

 export function getTeammate(colour) {
   switch (colour) {
      case "yellow": return "red";
      case "green":  return "blue";
      case "red":    return "yellow";
      case "blue":   return "green";
      default:       return null; // TODO - throw an error
   }
 }

 export function getNextPlayer(colour) {
  switch (colour) {
    case "yellow": return "green";
    case "green":  return "red";
    case "red":    return "blue";
    case "blue":   return "yellow";
    default:       return null; // TODO - throw an error
  }
 }