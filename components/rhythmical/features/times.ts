export function times({ child }) {
  if (!child.times) {
    return child;
  }
  const times = child.times;
  delete child.times;
  // return child;
  return { ...child, value: Array.from({ length: times }, (_, i) => ({ ...child })) };
}