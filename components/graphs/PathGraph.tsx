import React from 'react';
import buildGraph from './buildGraph';
/* import GraphvizJSON from './GraphvizJSON'; */
import GraphvizJSON from './Graphviz';

export default function PathGraph({ paths, width, height, containerStyle, ...options }: any) {
  const { nodes, edges } = buildGraph(paths, options);
  return (
    <GraphvizJSON
      options={{ width, height }}
      containerStyle={containerStyle}
      json={{
        graph: {
          directed: true,
          nodes,
          edges,
        },
      }}
    />
  );
}
