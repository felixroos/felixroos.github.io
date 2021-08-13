import { Connection, ConnectionState } from './astar';

export default function connectionGraph(
  connections: ConnectionState,
  options?: { createNode: (node) => object, createEdge: (edge) => object }
) {
  const { createNode, createEdge } = {
    createNode: (node) => node,
    createEdge: (edge) => edge,
    ...(options || {})
  };
  const nodes = [];
  const edges = [];
  const findNode = (id) => nodes.find((node) => node.id === id);
  const addNode = (connection: Connection) => {
    let [source, target] = connection;
    source = source || 'start';
    if (!findNode(source)) {
      nodes.push(createNode({ id: source, label: source }));
    }
    if (!findNode(target)) {
      nodes.push(createNode({ id: target, label: target }));
    }
  };
  const addEdge = ([source, target, value]: Connection) =>
    edges.push(createEdge({
      source: source || 'start',
      target,
      label: value + '',
    }));
  connections.open.concat(connections.closed).forEach((connection) => {
    addNode(connection)
    addEdge(connection);
  });
  return { nodes, edges };
}
