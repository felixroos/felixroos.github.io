import React from 'react';
import canUseDOM from '../canUseDOM';
const ReactJson = canUseDOM() ? require('react-json-view').default : null;

export default function JSONViewer(props) {
  return ReactJson ? (
    <ReactJson {...props} theme="tomorrow" displayObjectSize={false} displayDataTypes={false} />
  ) : (
    <>not a browser</>
  );
}
