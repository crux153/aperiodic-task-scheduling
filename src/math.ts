// Greatest common divisor of 2 integers
export function gcd2(numA: number, numB: number): number {
  if (!numB) {
    return numB === 0 ? numA : NaN;
  }
  return gcd2(numB, numA % numB);
}

// Greatest common divisor of a list of integers
export function gcd(array: number[]) {
  let num = 0;
  for (let idx = 0; idx < array.length; ++idx) {
    num = gcd2(array[idx], num);
  }
  return num;
}

// Least common multiple of 2 integers
export function lcm2(numA: number, numB: number): number {
  return (numA * numB) / gcd2(numA, numB);
}

// Least common multiple of a list of integers
export function lcm(array: number[]): number {
  let num = 1;
  for (let idx = 0; idx < array.length; ++idx) {
    num = lcm2(array[idx], num);
  }
  return num;
}

// Average of integers
export function average(array: number[]): number {
  return array.reduce((acc, val) => acc + val, 0) / array.length;
}
