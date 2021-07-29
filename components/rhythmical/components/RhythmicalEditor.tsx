import React from 'react';
import { useState } from 'react';
import CodeMirror from '../../common/CodeMirror';
import Player from './Player';
import drums from '../../../instruments/tidal';
import { piano } from '../../../instruments/piano';
import { renderRhythmObject } from '../rhythmical';
import { inheritProperty } from '../features/inherit';
import prettier from 'prettier';
import * as jsonParser from 'prettier/parser-babel';
import { tieReducer } from '../reducers';

export default function RhythmicalEditor() {
  const [json, setJson] = useState({
    duration: 4,
    parallel: [
      {
        instrument: 'piano',
        color: 'green',
        sequential: [
          [
            ['Db3', 'Db3'],
            ['Db3', 'B2', 'A2'],
          ],
          ['G2', 'G2', 'G2', { sequential: ['_', 'A2', 'B2'], duration: 2 }],
        ],
      },
      {
        color: 'steelblue',
        instrument: 'drums',
        parallel: [
          ['bd', 'sn', 'bd', 'sn'],
          [
            ['hh', 'hh', 'hh', 'hh'],
            ['hh', 'hh', 'hh', 'hh', 'hh'],
          ],
        ],
      },
    ],
  });
  const format = (_json) => prettier.format(JSON.stringify(_json), { parser: 'json', plugins: [jsonParser] });
  const [string, setString] = useState(format(json));
  const render = () => renderRhythmObject({ ...json }, [inheritProperty('instrument')]).reduce(tieReducer(), []);
  return (
    <>
      <Player instruments={{ drums, piano }} events={render()} />
      <CodeMirror
        className="rhythmical-editor"
        value={string}
        onChange={(_, __, value) => {
          setString(value);
          try {
            const _json = JSON.parse(value);
            setJson(_json);
          } catch (error) {
            console.error('error', error);
          }
        }}
        options={{
          mode: 'javascript',
          theme: 'material',
          lineNumbers: false,
        }}
      />
      <button
        onClick={() => {
          console.log('format', format(json));
          setString(format(json));
        }}
      >
        format
      </button>
    </>
  );
}

/*

// so könnte es eines tages aussehen:

{
  "duration": 4,
  "parallel": [
    {
      "instrument": "piano",
      "color": "green",
      "sequential": [
       "Db3 Db3 . Db3 B2 A2",
       "G2 G2 G2 [_ A2 B2]*2"
       ]
    },
    {
      "color": "steelblue",
      "instrument": "drums",
      "parallel": [
        "bd sn bd sn",
        "hh hh hh hh . hh hh hh hh hh"
      ]
    }
  ]
}

*/
