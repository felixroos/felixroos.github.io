import { max } from 'd3-array';


export function isPrime(num) {
  for (var i = 2; i < num; i++) {
    if (num % i === 0) {
      return false;
    }
  }
  return true;
}

export function primes(from, to) {
  const primes = [];
  for (let i = from; i <= to; ++i) {
    if (isPrime(i)) {
      primes.push(i);
    }
  }
  return primes;
}

export function nPrimes(n) {
  const primes = [];
  let i = 2;
  while (primes.length < n && i < 10000) {
    if (isPrime(i)) {
      primes.push(i);
    }
    i++;
  }
  return primes;
}

export function primefactors(n) {
  const factors = [];
  let divisor = 2;
  while (n >= 2) {
    if (n % divisor == 0) {
      factors.push(divisor);
      n = n / divisor;
    } else {
      divisor++;
    }
  }
  return factors;
}

export function withoutFactor(factor, n) {
  return primefactors(n)
    .filter((f) => f !== factor)
    .reduce((p, f) => p * f, 1);
}

export function primepowers(n) {
  const factors = primefactors(n);
  const powers = [];
  let latest;
  for (let factor of factors) {
    if (!latest || latest !== factor) {
      powers.push([factor, 1]);
    } else {
      powers[powers.length - 1][1] += 1;
    }
    latest = factor;
  }
  return powers;
}

export function primelimit(n) {
  return max(primefactors(n));
}

export function primevector(n) {
  const limit = primelimit(n);
  const dimensions = primes(2, limit);
  const powers = primepowers(n);
  return dimensions.map((d) => powers.find(([f]) => f === d)?.[1] || 0);
}

export function ratioPrimePowers(n, d) {
  return primepowers(n).concat(primepowers(d).map(([f, p]) => [f, -p])).sort(([a], [b]) => a - b);
}

export function addVectors(a, b) {
  if (a.length < b.length) {
    [a, b] = [b, a];
  }
  return a.map((va, i) => va + (b[i] || 0));
}

export function slicePrimeVector(vector, minPrime = 2, maxPrime?) {
  const factors = maxPrime ? primes(2, maxPrime) : nPrimes(vector.length);
  const [a, b] = [factors.indexOf(minPrime), maxPrime ? factors.indexOf(maxPrime) + 1 : factors.length];
  return vector.slice(a, b);
}

export function fractionPrimeVector(n, d) {
  return addVectors(primevector(n), primevector(d).map(v => -v));
}

export function ratioPrimeVector(n, d, minPrime = 2, maxPrime?) {
  const powers = ratioPrimePowers(n, d);
  const limit = Math.max(primelimit(n), primelimit(d));
  maxPrime = maxPrime || limit;
  if (maxPrime < limit) {
    throw new Error(`tried use maxPrime lower than prime limit of ratio ${n}/${d}. maxPrime must be >= ${limit}, but received ${maxPrime}`);
  }
  const dimensions = primes(minPrime, maxPrime);
  return dimensions.map((d) => powers.find(([f, p]) => f === d)?.[1] || 0);
}