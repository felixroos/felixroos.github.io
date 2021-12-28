import React, { useState } from 'react';
import GeneratorStepper from '../common/GeneratorStepper';
import chordScales from '../sets/chordScales';
import scaleChroma from '../sets/scaleChroma';
import scaleDifference from '../sets/scaleDifference';
import scaleModes from '../sets/scaleModes';
import { generateAstar, Target } from './astar';
import ReactDiffViewer, { DiffMethod } from 'react-diff-viewer';
import stringifyCompact from '../common/stringifyCompact';
import connectionGraph from './connectionGraph';
import { Graph } from './Graphviz';
import scaleColor from '../sets/scaleColor';
import { Card, CardContent } from '@material-ui/core';

export default function AstarChordScaleFinder({ chords, scales, showJson }) {
  scales = scales || scaleModes('major', 'harmonic minor', 'melodic minor');
  const graph = chords.map((chord) => chordScales(chord, scales, true));
  const getNodeID = (level, scale) => `${level}.${scale}`;
  const start = graph[0].map((scale) => getNodeID(0, scale));
  const lastLvl = graph.length - 1;
  const end = graph[lastLvl].map((scale) => getNodeID(lastLvl, scale));
  const colorDiff = (source, target) => {
    return source && scaleChroma(source) !== scaleChroma(target) ? 1 : 0;
  };
  const scaleTargets = (graph) => (nodeID) => {
    const [lvl, source] = nodeID.split('.');
    const level = parseInt(lvl);
    if (level >= graph.length - 1) {
      return [];
    }
    return graph[level + 1].map(
      (target): Target => [
        getNodeID(level + 1, target),
        scaleDifference(source, target) + colorDiff(source, target) /* + 1 ,
      graph.length - level - 1 */,
      ]
    );
  };

  const [value, setValue] = useState<any>();
  const [previous, setPrevious] = useState<any>();

  return (
    <div className="not-prose">
      <GeneratorStepper
        init={() => generateAstar(start, end, scaleTargets(graph))}
        onChange={(current, previous) => {
          setValue(current);
          setPrevious(previous);
        }}
      />
      {showJson && (
        <ReactDiffViewer
          compareMethod={DiffMethod.LINES}
          oldValue={stringifyCompact(previous || value || {})}
          newValue={stringifyCompact(value || {})}
          splitView={false}
          showDiffOnly={false}
          useDarkTheme={true}
          hideLineNumbers={true}
        />
      )}
      {value && (
        <Card elevation={3}>
          <CardContent style={{ width: '100%', overflow: 'auto', textAlign: 'center' }}>
            <Graph
              options={{ height: 300 }}
              json={{
                graph: {
                  directed: true,
                  ...connectionGraph(value, {
                    createNode(node) {
                      const scale = node.label.split('.')[1];
                      return {
                        ...node,
                        label: scale || node.label,
                        fillcolor: scale ? scaleColor(scale) : 'white',
                        /* shape: 'rect', */
                        style: 'filled',
                      };
                    },
                    createEdge(edge) {
                      const isOpen = value.open.find(
                        ([source, target]) => (source || 'start') === edge.source && target === edge.target
                      );
                      const isWinner = Array.isArray(value.winner) && value.winner.includes(edge.target);
                      if (isWinner) {
                        return {
                          ...edge,
                          color: 'red',
                        };
                      }
                      return { ...edge, color: isOpen ? 'black' : '#aaaaaa' };
                    },
                  }),
                },
              }}
            />
          </CardContent>
        </Card>
      )}
    </div>
  );
}
