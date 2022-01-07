import * as React from 'react';
import toDot from 'jgf-dot';
import { graphviz } from '@hpcc-js/wasm/dist/index';

// to make this work, make sure to copy graphvizlib.wasm to public with:
// cp ./node_modules/@hpcc-js/wasm/dist/graphvizlib.wasm ./public

export function Graph({ json, editable, options, containerStyle }: any) {
  const width = options?.width || '600px';
  const height = options?.height || '300px';

  const [el, setEl] = React.useState<HTMLDivElement>();
  const [value, setValue] = React.useState<string>(JSON.stringify(json, null, 2));
  const renderGraph = async (jsonString) => {
    if (!el) {
      return;
    }
    try {
      const dot = toDot(JSON.parse(jsonString)); //.split('graph {').join('graph { node [width=0.4,height=0.4];');
      const svg = await graphviz.layout(dot, 'svg', 'dot'); //.split('<svg width=').join('');
      // TODO: find out why this does not work anymore with newer version of @hpcc-js/wasm
      el.innerHTML = svg;
    } catch (error) {
      console.log('invalid..');
      console.log(error);
    }
  };
  React.useEffect(() => {
    renderGraph(value);
  }, [el, value]);
  React.useEffect(() => {
    setValue(JSON.stringify(json, null, 2));
  }, [json]);
  return (
    <>
      <style>{`.graphviz-container > svg \{ width: 100%; height: 100% \}`}</style>
      <div className="graphviz-container max-w-full overflow-auto" ref={(e) => setEl(e)} style={{ width, height, ...containerStyle }}></div>
      {editable && (
        <textarea style={{ width: '100%', height: '600px' }} value={value} onChange={(e) => setValue(e.target.value)} />
      )}
    </>
  );
}

export default Graph;
