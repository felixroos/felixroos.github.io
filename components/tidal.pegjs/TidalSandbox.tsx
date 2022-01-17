import { curry, pick } from 'ramda';
import Pattern from 'tidal.pegjs/dist/pattern.js';
import Player from '../rhythmical/components/Player';
import { unifyAST } from '../rhythmical/tree/rhythmAST';
import drums from '../../instruments/tidal';
import { piano } from '../../instruments/piano';
import { useEffect, useState } from 'react';
import produce from 'immer';
import Input from '../layout/Input';

// props per type that should be picked to be spread to the unified object
const customProps = {
  number: ['value'],
  string: ['value'],
  speed: ['rate'],
};

export const unifyPatternData = (patternData: Pattern) => {
  // console.log('unifyPatternData', patternData);
  const u = unifyAST(
    {
      getChildren: (node) => node.values || (node.value?.type ? [node.value] : null),
      map: ({ type, data, children }) => ({
        type,
        ...pick(customProps[type] || [], data),
        ...(children ? { children } : {}),
      }),
    },
    patternData
  );
  // console.log('unifiedPattern', u);
  return u;
};

// get value of fraction
const f = ({ n, d }) => n / d;
// convert tidal.pegjs event to rhythmical flat event
export const e =
  (duration, instrument) =>
  ({ value, arc: { start, end } }) => ({
    value,
    time: f(start) * duration,
    duration: (f(end) - f(start)) * duration,
    instrument,
  });

// query pattern for events
export const q = curry((start, end, duration, instrument: string, pattern: string) => {
  const p = Pattern(pattern);
  return p.query(start, end).map(e(duration, instrument));
});
// query pattern for events
export const qp = curry((start, end, duration, instrument: string, pattern: any) => {
  return pattern.query(start, end).map(e(duration, instrument));
});

// q(0, 1, 2, '[bd [hh hh] sn [hh hh]]')
// q(0, 2, 1, '<bd sn>')
// ['bd sn', 'hh*8'].map(q(0, 2, 2)).flat()

export const unifiedPattern = (pattern: string) => unifyPatternData(Pattern(pattern).__data);

// console.log('unifiedPattern', unifiedPattern('[[E3,G3,B3] [[F3,G3,Bb3] ~ <[F3,Ab3,Bb3] [F3,A3,Bb3]>]]'));

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

export const p2Data = {
  type: 'group',
  values: [
    {
      type: 'number',
      value: 0,
    },
    {
      type: 'speed',
      rate: {
        type: 'number',
        value: 4,
      },
      value: {
        type: 'group',
        values: [
          {
            type: 'number',
            value: 1,
          },
          {
            type: 'number',
            value: 2,
          },
        ],
      },
    },
    {
      type: 'onestep',
      values: [
        {
          values: [
            {
              type: 'number',
              value: 5,
            },
            {
              type: 'number',
              value: 6,
            },
            {
              type: 'number',
              value: 7,
            },
          ],
          type: 'group',
        },
      ],
    },
    {
      type: 'number',
      value: 8,
    },
  ],
};

export const p2DataUnified = unifyPatternData(p2Data);

function TidalSandbox() {
  const duration = 3;
  const qDuration = 2;
  const [patterns, setPatterns] = useState([
    { instrument: 'drums', pattern: '[[[bd ~ bd] sn] [bd bd sn],hh*12]' },
    { instrument: 'piano', pattern: '[[C2 G1]*3 [<[Bb1 G1 Bb1] [Bb1 F1 Bb1]>]]' },
    { instrument: 'piano', pattern: '[[E3,G3,B3] [[F3,G3,Bb3] ~ <[F3,Ab3,Bb3] [F3,A3,Bb3]>]]' },
  ]);
  const patternField = curry((pattern, prop) => ({
    value: pattern[prop],
    onChange: (e) =>
      setPatterns(
        produce(patterns, (p) => {
          const index = patterns.indexOf(pattern);
          p[index][prop] = e.target.value;
        })
      ),
  }));
  const [events, setEvents] = useState([]);
  const query = (n) => {
    const _events = patterns.reduce((e, p, i) => {
      try {
        const patternEvents = q(n, qDuration, duration, p.instrument, p.pattern);
        return e.concat(patternEvents);
      } catch (err) {
        console.log('err in pattern', err, i);
        return e;
      }
    }, []);
    setEvents(_events);
  };
  useEffect(() => {
    query(0);
  }, [patterns]);

  return (
    <>
      <div className="space-y-1 mb-2">
        {patterns
          .map((p) => patternField(p))
          .map((register, i) => (
            <fieldset key={i} className="flex space-x-1 text-sm w-full">
              <div className="w-32">
                {!i && <label>instr</label>}
                <Input.Select options={['drums', 'piano']} {...register('instrument')} />
              </div>
              <div className="w-full">
                {!i && <label className="text-right">pattern</label>}
                <Input type="text" {...register('pattern')} />
              </div>
            </fieldset>
          ))}
      </div>
      <Player fold={true} instruments={{ drums, piano }} events={events} />
    </>
  ); // query={query}
}

export default TidalSandbox;

/*

cool patterns:

----

[[<bd bd*2> <sn [sn ~ ~ sn]>],[hh hh*2]*3]*2
[C2 [D2*4 <F2 [~ D2]>]]
[[[E3,G3]*2 [<[F3,G3] [F3,A3]> [~ [[F3,G3]*3]]]],[<[C5*6 [D5*5 B4*4 C5*3]] G4>]]

----

[[[bd ~ ~ bd] sn] [[bd ~ bd] ~  sn [~ bd]],hh*8]
[[C2 G1]*1 [<[Bb1 [G1 Bb1]] [D2 [F1 Bb1]]>]]
[[E3,G3,B3] [[F3,G3,Bb3] <[F3,Ab3,Bb3]*6 [F3,A3,Bb3]*3>]]

*/
