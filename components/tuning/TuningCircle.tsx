import React from 'react';
import { Switch } from '@material-ui/core';
import Slider from '@material-ui/core/Slider';
import * as Tone from 'tone';
import canUseDOM from '../canUseDOM';
import ConnectedCircle from '../common/ConnectedCircle';
import IntervalSet, { getLinks, getNodes } from './IntervalSet';
const { PolySynth, Synth } = Tone;

const harp =
  canUseDOM() &&
  new PolySynth({
    maxPolyphony: 6,
    voice: Synth,
    options: {
      volume: -10,
      oscillator: {
        type: 'triangle',
      },
    },
  }).toDestination();

export default function TuningCircle({ state, setState }) {
  const { ratios, toggle, focus, interval } = state;
  const base = 440;
  const nodes = getNodes(ratios, base, toggle ? 'cents' : 'ratios', focus);
  const links = getLinks(nodes, interval, base, focus);
  function onlyUnique(value, index, self) {
    return self.indexOf(value) === index;
  }
  function playItem(item) {
    const { link, node } = item;
    if (link) {
      let [from, to] = [link.source, link.target].map((id) => nodes.find((node) => node.id === id));
      let ratio = to.ratio / from.ratio;
      if (to.ratio < from.ratio) {
        ratio = ratio * 2;
      }
      const frequencies = [from.ratio * base, from.ratio * base * ratio];
      harp.triggerAttackRelease(frequencies, '4n', '+0.01');
    }
    if (node && node.ratio) {
      harp.triggerAttackRelease([node.ratio * base], '4n', '+0.01');
    }
  }
  const unique = links.map((l) => Math.round(l.value.frequency)).filter(onlyUnique);
  return (
    <>
      <label>
        ratios
        <Switch checked={toggle} color="default" onChange={(e) => setState({ toggle: e.target.checked })} />
        cents
      </label>
      <br />
      <ConnectedCircle
        onClick={(item) => {
          setState({ focus: item.link });
          playItem(item);
        }}
        onHover={({ link }) => setState({ focus: link })}
        nodeRadius={30}
        r={140}
        links={links}
        nodes={nodes}
      />
      <br />
      <label>
        steps: {interval} vs {ratios.length - interval}
        <br />
        <Slider
          min={1}
          max={Math.floor(ratios.length / 2)}
          step={1}
          style={{ width: 350 }}
          value={interval}
          onChange={(e, v) =>
            setState({
              interval: v,
            })
          }
        />
      </label>
      <br />
      <IntervalSet
        onClick={(link) => {
          playItem({ link });
          setState({ focus: link });
        }}
        onHover={(link) => setState({ focus: link })}
        links={links}
        view={toggle ? 'cents' : 'ratios'}
        base={base}
        focus={focus}
      />
      <br />
      {unique.length === 1 && 'all steps are equally sized'}
      {unique.length !== 1 &&
        `there are ${unique.length} different ratios for ${interval} and ${ratios.length - interval} steps`}
    </>
  );
}
