export function generateRandomNumber(digits: number = 4): string {
  // digits: cannot be more than 10

  // between 0 and 1 (can't be one)
  // between 0 and 9 (both inclusive)
  if (digits > 10) {
    // TODO validation at input also
    return
  }
  const numArr = []
  numArr.push(Math.floor(Math.random() * 10))

  while (numArr.length < digits) {
    let newNum = Math.floor(Math.random() * 10)
    while (numArr.indexOf(newNum) > -1) {
      newNum = Math.floor(Math.random() * 10)
    }
    numArr.push(newNum)
  }
  return numArr.join('')
}
