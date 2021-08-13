export default (getValue) => ({ path }) => ({
  path,
  ...path.reduce(({ values }, choice, i) => {
    const next = i ? getValue(path[i - 1], choice) : 0;
    const value = i ? values[i - 1] + next : 0;
    return { values: (values || []).concat([next]), value };
  }, {}),
});