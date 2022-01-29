import produce from 'immer';
import { curry } from 'ramda';
import { useEffect, useState } from 'react';
import { piano } from '../../instruments/piano';
import drums from '../../instruments/tidal';
import Input from '../layout/Input';
import Player from '../rhythmical/components/Player';
import { queryPattern } from './queryPattern';
import { q } from './tidalAST';

function TidalSandbox() {
  const duration = 3;
  const qDuration = 2;
  const [patterns, setPatterns] = useState([
    { instrument: 'drums', pattern: '[[[bd ~ bd] sn] [bd bd sn],hh*12]' },
    { instrument: 'piano', pattern: '[[C2 G1]*3 [<[Bb1 G1 Bb1] [Bb1 F1 Bb1]>]]' },
    { instrument: 'piano', pattern: '[[E3,G3,B3] [[F3,G3,Bb3] ~ <[F3,Ab3,Bb3] [F3,A3,Bb3]>]]' },
    /* { instrument: 'drums', pattern: '[[[bd ~ bd] sn] [bd bd sn],hh]' },
    { instrument: 'piano', pattern: '[[C2 G1] [<[Bb1 G1 Bb1] [Bb1 F1 Bb1]>]]' },
    { instrument: 'piano', pattern: '[[E3,G3,B3] [[F3,G3,Bb3] ~ <[F3,Ab3,Bb3] [F3,A3,Bb3]>]]' }, */
    /* { instrument: 'drums', pattern: 'bd <sn [sn sn sn]>' },
    { instrument: 'piano', pattern: '<c3 b2 a2 g2 f2 e2 g2>' },
    { instrument: 'piano', pattern: '<c2 d2 e3 f3 g3 a3>' }, */
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
        const useNewQuerying = false;
        const patternEvents = useNewQuerying
          ? queryPattern(p.pattern, n, true).map((e) => ({
              ...e,
              instrument: p.instrument,
              time: e.time * duration,
              duration: e.duration * duration,
            }))
          : q(n, qDuration, duration, p.instrument, p.pattern);
        /* console.log(
          'pp',
          patternEvents.map((e) => e.value)
        ); */
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
      <Player
        fold={true}
        instruments={{ drums, piano }}
        events={events}
        duration={duration}
        center={0}
        query={(n) => {
          // console.log('q', n);
          query(n);
        }}
      />
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
