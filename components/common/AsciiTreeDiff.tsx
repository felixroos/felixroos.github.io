import React from 'react';
import ReactDiffViewer from 'react-diff-viewer';
import * as treeify from 'treeify';

// TODO: is this even used?

export function AsciiTreeDiff({ before, after }) {
  return <ReactDiffViewer oldValue={treeify.asTree(before, true)} newValue={treeify.asTree(after, true)} />;
}
