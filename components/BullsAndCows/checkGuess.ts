export function checkGuess(targetGuess: string, currentGuess: string) {
  // both arguments should be pre-validated
  // 1. same length
  // 2. same chosen format (number vs number ...)

  let bulls = 0
  let cows = 0
  for (let i = 0; i < currentGuess.length; i++) {
    if (targetGuess[i] === currentGuess[i]) {
      bulls++
    } else if (targetGuess.indexOf(currentGuess[i]) > -1) {
      cows++
    }
  }
  return { bulls, cows }
}
