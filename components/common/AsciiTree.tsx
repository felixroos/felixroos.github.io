import React from 'react';
import * as treeify from 'treeify';

export function AsciiTree({ node }) {
  return (
    <>
      {node && <pre style={{ lineHeight: '20px' }}>{treeify.asTree(node, true)}</pre>}
      {node && typeof node === 'number' && <pre>: {node}</pre>}
    </>
  );
}
