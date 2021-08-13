import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Switch from '@material-ui/core/Switch';
import { max } from 'd3-array';
import React, { useState } from 'react';
import { Path } from './extendBestPath';
import PathGraph from './PathGraph';
import PathTree from './PathTree';

// TODO: add json view
// TODO: button group to change view to tree | graph | json
// TODO: add undo button
// TODO: find out why width sometimes is too big

export default ({ paths, width, height, maxHeight, noScroll, getValue, getColor, view: initialView }: any) => {
  const [view, setView] = useState(initialView);
  height = height || 800;
  maxHeight = maxHeight || 800;

  const Content = ({ height }) => (
    <>
      {view === 'tree' && (
        <PathTree
          width={width}
          height={height}
          paths={paths}
          getColor={(a) => getColor(a)}
          getValue={(a, b) => getValue(a, b)}
        />
      )}
      {view === 'graph' && (
        <PathGraph
          width={width}
          height={height}
          paths={paths}
          getColor={(a) => getColor(a)}
          getValue={(a, b) => getValue(a, b)}
          includeStartNode={true}
          showCalculation={true}
          showDuplicates={true}
        />
      )}
    </>
  );
  const controls = (
    <label>
      tree
      <Switch
        checked={view === 'graph'}
        color="primary"
        onChange={(e) => setView(e.target.checked ? 'graph' : 'tree')}
      />
      graph
    </label>
  );
  const levelHeight = 80;
  const dynamicHeight = (max(paths || [], (p: Path) => p.path.length + 1) || 1) * levelHeight;
  if (noScroll) {
    return (
      <>
        <Card elevation={3}>
          <CardContent style={{ width: '100%', overflow: 'auto', textAlign: 'center' }}>
            <Content height={dynamicHeight} />
          </CardContent>
        </Card>
      </>
    );
  }
  const h = height ? Math.min(dynamicHeight + 50, height) : dynamicHeight;
  return (
    <>
      <Card elevation={3}>
        <CardContent style={{ height: h, textAlign: 'center', overflow: 'auto' }}>
          <Content height={Math.min(maxHeight, dynamicHeight)} />
        </CardContent>
      </Card>
    </>
  );
};
