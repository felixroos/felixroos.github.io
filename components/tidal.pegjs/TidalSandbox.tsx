import Pattern from 'tidal.pegjs/dist/pattern.js';
import { unify } from '../rhythmical/tree/rhythmAST';

// export const p = Pattern('[C^7 [D-7 G7]]');
// export const p = Pattern('[A [B C]]');

export const unifyPatternData = (patternData: Pattern) => {
  return unify(
    {
      getChildren: (node) => node.values,
      map: ({ type, data: { value }, children }) => (children ? { type, children } : { type, value }),
    },
    patternData
  );
};

export const unifiedPattern = (pattern: string) => unifyPatternData(Pattern(pattern).__data);

// hard coded p.__data with "type" as first prop. Pattern throws "type" to end which is not so readable
export const pData = {
  type: 'group',
  values: [
    {
      type: 'string',
      value: 'A',
    },
    {
      type: 'group',
      values: [
        {
          type: 'string',
          value: 'B',
        },
        {
          type: 'string',
          value: 'C',
        },
      ],
    },
  ],
};

export const pDataUnified = {
  type: 'group',
  children: [
    {
      type: 'string',
      value: 'A',
    },
    {
      type: 'group',
      children: [
        {
          type: 'string',
          value: 'B',
        },
        {
          type: 'string',
          value: 'C',
        },
      ],
    },
  ],
};
