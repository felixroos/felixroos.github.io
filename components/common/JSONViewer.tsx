import React from 'react';
import canUseDOM from '../canUseDOM';
const ReactJson = canUseDOM() ? require('react-json-view').default : null;

export default function JSONViewer(props) {
  return ReactJson ? <ReactJson {...props} theme="monokai" /> : <>not a browser</>;
}
