import React from 'react';
// import { Controlled as CodeMirror2 } from 'react-codemirror2';
import canUseDOM from '../canUseDOM';
if (canUseDOM()) {
  try {
    require('codemirror/lib/codemirror.css');
    require('codemirror/theme/material.css');
    require('codemirror/theme/neat.css');
    require('codemirror/mode/xml/xml.js');
    require('codemirror/mode/javascript/javascript.js');
  } catch (error) {
    console.log('cannot load codemirror css', error);
  }
}

export default function CodeMirror({ value, onChange, options }: any) {
  options = options || {
    mode: 'javascript',
    theme: 'material',
    lineNumbers: true,
  };
  return null;
  // return <CodeMirror2 value={value} options={options} onBeforeChange={onChange} />;
}
