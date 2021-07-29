import React, { useState } from 'react';
import { walk } from '../rhythmical/tree/walk';
import Tree from '../rhythmical/components/Tree';
import GeneratorStepper from './GeneratorStepper';

export default function TreeVisitor({ tree, getChildren, onNode, initGenerator }) {
  getChildren = getChildren || ((node) => node.children);
  const [visited, setVisited] = useState([]);
  const [node, setNode] = useState<any>();
  function getTree() {
    if (typeof tree === 'function') {
      return tree(node, visited);
    }
  }
  initGenerator = initGenerator || (() => walk(getChildren, getTree()));
  return (
    <div>
      <GeneratorStepper
        hideFinish={true}
        init={() => {
          setVisited([]);
          return initGenerator(getChildren, getTree());
        }}
        onChange={(_node) => {
          if (_node) {
            setNode(_node);
            onNode?.(_node);
            setVisited([...visited, _node]);
          }
        }}
      />
      <Tree width={620} nodeRadius={10} dx={20} columns={[12, 12]} data={getTree()} hideJson={true} />
    </div>
  );
}
