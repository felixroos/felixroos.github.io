const Circle = (items) => ({
  items,
  get first() {
    return items[0];
  },
  get last() {
    return items[items.length - 1];
  },
  index(n) {
    return (items.length + (n % items.length)) % items.length;
  },
  item(n) {
    return items[this.index(n)];
  },
  rotate(steps) {
    return Circle(items.map((_, i) => this.item(i + steps)));
  },
  invert() {
    return Circle([...items].reverse()).rotate(-1);
  },
});

export default Circle;
