import React from 'react';
import { countUnique } from '../ireal/analytics';
import D3Shell from './D3Shell';
import standards from '../../posts/ireal/jazz1350.json';
import iRealReader from 'ireal-reader';
import JSONViewer from './JSONViewer';
import barChart from './barChart';
import { normalizeProperty } from './statistics';

const { songs } = iRealReader(decodeURI(standards));

const property = 'key';

const toString = (n: number): string => n + '';

let set = countUnique(songs.map((song) => song[property]));

set = normalizeProperty('count', set);

/* const regularities = set.map(({ regularity }) =>
  Math.round(regularity * 10000)
);
const normalized = regularities.map(normalize(regularities)).map(toString); */

const data: any = set.sort((a, b) => b.count - a.count).slice(0, 10);

export default function DynamicFilter({ values }) {
  return (
    <>
      <JSONViewer src={set} />
      <D3Shell render={(container) => barChart({ container, data } as any)} />
    </>
  );
}
