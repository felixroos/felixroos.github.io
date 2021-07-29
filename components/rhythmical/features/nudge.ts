export function nudge({ child }) {
  if (!child.nudge) {
    return child;
  }
  console.log('nudge', child, child.path[child.path.length - 1]);
  console.log('l', child.path.slice(-1));
  console.log('l', child.path.slice(1, 2));
  // return child;
  const p = child.path[child.path.length - 1];
  child.path[child.path.length - 1] = [
    (p[0] + child.nudge) % p[2], p[1], p[2]
  ];
  return { ...child, path: child.path };
}