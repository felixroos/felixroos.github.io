// https://stackoverflow.com/questions/27266550/how-to-flatten-nested-array-in-javascript/27266878#27266878
// This is done in a linear time O(n) without recursion
// memory complexity is O(1) or O(n) if mutable param is set to false
export default function flatten(array, mutable?) {
  var toString = Object.prototype.toString;
  var arrayTypeStr = '[object Array]';

  var result = [];
  var nodes = (mutable && array) || array.slice();
  var node;

  if (!array.length) {
    return result;
  }

  node = nodes.pop();

  do {
    if (toString.call(node) === arrayTypeStr) {
      nodes.push.apply(nodes, node);
    } else {
      result.push(node);
    }
  } while (nodes.length && (node = nodes.pop()) !== undefined);

  result.reverse(); // we reverse result to restore the original order
  return result;
}