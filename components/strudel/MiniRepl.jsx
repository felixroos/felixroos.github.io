import React, { useState } from 'react';
import { Tone, getDefaultSynth } from '@strudel.cycles/tone';
import useRepl from './useRepl.mjs';
import CodeMirror /* , { markEvent } */ from './CodeMirror';

// eval stuff start
import { extend } from '@strudel.cycles/eval';
import * as strudel from '@strudel.cycles/core/strudel.mjs';
import gist from '@strudel.cycles/core/gist.js';
import { mini } from '@strudel.cycles/mini/mini.mjs';
import * as toneHelpers from '@strudel.cycles/tone/tone.mjs';
import * as voicingHelpers from '@strudel.cycles/tonal/voicings.mjs';
import * as uiHelpers from '@strudel.cycles/tone/ui.mjs';
import * as drawHelpers from '@strudel.cycles/tone/draw.mjs';
import euclid from '@strudel.cycles/core/euclid.mjs';
import '@strudel.cycles/tone/tone.mjs';
import '@strudel.cycles/midi/midi.mjs';
import '@strudel.cycles/tonal/voicings.mjs';
import '@strudel.cycles/tonal/tonal.mjs';
import '@strudel.cycles/xen/xen.mjs';
import '@strudel.cycles/xen/tune.mjs';
import '@strudel.cycles/core/euclid.mjs';
import '@strudel.cycles/tone/pianoroll.mjs';
import '@strudel.cycles/tone/draw.mjs';
import { classNames } from '../layout/classNames.js';
import canUseDOM from '../canUseDOM';

extend(
  /* Tone,   */ strudel,
  strudel.Pattern.prototype.bootstrap(),
  toneHelpers,
  voicingHelpers,
  drawHelpers,
  uiHelpers,
  {
    gist,
    euclid,
    mini,
    Tone,
  },
);
// eval stuff end

const defaultSynth = canUseDOM() && getDefaultSynth();

function MiniRepl({ tune = '"c3"', maxHeight = 500 }) {
  const [editor, setEditor] = useState();
  const { code, setCode, activateCode, activeCode, setPattern, error, cycle, dirty, log, togglePlay, hash, pending } =
    useRepl({
      tune,
      defaultSynth,
      autolink: false,
      // onDraw: useCallback(markEvent(editor), [editor]),
    });
  const lines = code.split('\n').length;
  const lineHeight = 20;
  const height = Math.min(lines * lineHeight + lineHeight, maxHeight);
  return (
    <div className="rounded-md overflow-hidden bg-slate-500 border border-gray-500">
      <div className="flex justify-between bg-slate-700 border-t border-slate-500">
        <div className="flex">
          <button
            className={classNames(
              'w-16 flex items-center justify-center p-1 bg-slate-700 border-r border-slate-500  text-white hover:bg-slate-600',
              cycle.started ? 'animate-pulse' : '',
            )}
            onClick={() => togglePlay()}
          >
            {pending ? (
              <>
                <small>loading..</small>
                {/* <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 animate-pulse"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10"
                  />
                </svg> */}
              </>
            ) : !cycle.started ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                  clipRule="evenodd"
                />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
            )}
          </button>
          <button
            className={classNames(
              'w-16 flex items-center justify-center p-1 border-slate-500  hover:bg-slate-600',
              dirty
                ? 'bg-slate-700 border-r border-slate-500 text-white'
                : 'bg-slate-600 text-slate-400 cursor-not-allowed',
            )}
            onClick={() => activateCode()}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path
                fillRule="evenodd"
                d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>
        <div className="text-right p-1 text-sm">{error && <span className="text-red-200">{error.message}</span>}</div>{' '}
      </div>
      <div className="flex space-y-0 overflow-auto" style={{ height }}>
        {/* <textarea
          className="w-full bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-300 outline-none"
          wrap="off"
          spellCheck="false"
          style={{ fontFamily: 'monospace', lineHeight: `${lineHeight}px` }}
          value={code}
          onChange={(e) => setCode(e.target.value)}
        /> */}
        <CodeMirror value={code} onChange={setCode} />
      </div>
    </div>
  );
}

export default MiniRepl;
