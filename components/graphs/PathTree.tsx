import React from 'react';
import buildTree from './buildTree';
/* import GraphvizJSON from './GraphvizJSON'; */
import GraphvizJSON from './Graphviz';

export default function PathTree({ paths, getColor, getValue, width, height, containerStyle }: any) {
  const { nodes, edges } = buildTree(paths || [], getColor, getValue);
  return (
    <GraphvizJSON
      options={{ height, width }}
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
