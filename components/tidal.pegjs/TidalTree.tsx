import Tree from '../rhythmical/components/Tree';
import { mapAST } from '../rhythmical/tree/rhythmAST';
import { unifyPattern } from './queryPattern';

export const patternTypeColor = {
  group: 'steelblue',
  sequential: 'steelblue',
  string: 'tomato',
  number: 'salmon',
  speed: 'green',
  onestep: 'darkblue',
  leaf: 'lightblue',
};

function TidalTree({ pattern, mapFn, shouldRename = true }) {
  const data = mapAST(unifyPattern(pattern, shouldRename), (node) => {
    node = mapFn?.(node) || node;
    return {
      ...node,
      name: node.value ?? node.type,
      color: patternTypeColor[node.type],
    };
  });
  return <Tree width={620} nodeRadius={20} dx={80} columns={[12, 12]} data={data} hideJson={true} />;
}

export default TidalTree;
