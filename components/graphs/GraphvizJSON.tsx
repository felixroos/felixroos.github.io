/* import { Graphviz } from 'graphviz-react';
import toDot from 'jgf-dot';

export default function GraphvizJSON({ json, options }) {
  if (!json) {
    return;
  }
  const dot = toDot(json);
  const { width, height } = options || {};
  options = {
    ...(height ? { height } : {}),
    ...(width ? { width } : {}),
    fit: true,
    zoom: false,
    scale: 1,
    fade: false,
    zoomScaleExtent: [1, 2],
    keyMode: 'id',
    growEnteringEdges: true,
    useWorker: false,
  };
  return <Graphviz dot={dot} options={options} />;
} */



  // TODO: find out how to "inject" rankdir
  // https://github.com/jsongraph/json-graph-specification
  // https://github.com/jsongraph/jgf-dot
  // console.log('dot', dot);
  // consider switching to https://github.com/ts-graphviz/react
  // => no d3 dependency + supports rankdir
  // => maybe not the real graphviz, just a ts reimplementation