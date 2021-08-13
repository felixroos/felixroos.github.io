export default (a, b) => {
  let diff = 0;
  for (let i = 0; i < 12; ++i) {
    diff += a[i] === b[i] ? 0 : 1
  }
  return diff;
}

// export const chromaDifference = (a, b) => ((parseInt(a, 2) ^ parseInt(b, 2)) >>> 0).toString(2).split('1').length - 1;

/*

alternatives:

TODO: see which ones the fastest

removed from chord-scales before "This function will count how much characters of two chromas are different."

After checking my artificial limb (stackoverflow), I found out we can achieve the same goal [using bit operations](https://stackoverflow.com/questions/50479322/how-to-find-bit-difference-between-two-numbers-in-javascript):

```js
export const chromaDifference = (a, b) => {
  const bitStr = ((parseInt(a, 2) ^ parseInt(b, 2)) >>> 0).toString(2);
  return bitStr.split('1').length - 1;
};
```

using popcount(a^b), more ideas can be found [here](https://stackoverflow.com/questions/43122082/efficiently-count-the-number-of-bits-in-an-integer-in-javascript):

```js
// const popcount = (x) => (!x ? 0 : (x & 1) + popcount((x >>= 1)));
const popcount = (n) => n.toString(2).replace(/0/g, '').length;
const chromaDiff = (a, b) => popcount(parseInt(a, 2) ^ parseInt(b, 2));
```


*/