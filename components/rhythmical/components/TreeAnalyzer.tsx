import React, { useState } from 'react';
import JSONViewer from '../../common/JSONViewer';
import Tree from './Tree';
import Chip from '@material-ui/core/Chip';
import DoneIcon from '@material-ui/icons/Done';
import CloseIcon from '@material-ui/icons/Close';
import Grid from '@material-ui/core/Grid';
import { cluster, hierarchy, tree } from 'd3-hierarchy';

function getSiblings(node) {
  return node?.parent?.children?.map(({ data }) => data.name)?.filter((name) => name !== node.data.name);
}

export function TreeAnalyzer(props) {
  const theme = {
    selected: '#CA3F44',
    parent: '#9E9342', //'#DFDFDF'
    child: '#ACD556', //'#DFDFDF'
    sibling: '#72C07D', //'#DFDFDF'
    siblingLink: 'black', //'#DFDFDF'
    parentLink: 'black', //'#DFDFDF'
    childLink: 'black', //'#DFDFDF'
    default: '#DFDFDF',
  };
  const { data, hideJson, hideChips } = props;
  const [node, setNode] = useState<any>(hierarchy(data));
  const isActive = (type) =>
    ({
      parent: !!node.parent?.data?.name,
      selected: !!node,
      child: !!node.children?.length,
      sibling: !!getSiblings(node),
    }[type]);
  const controlColors = (types) => {
    return {
      /* onMouseEnter: () =>
        setTheme(types.reduce((theme, type) => ({ ...theme, [type]: activeTheme[type] }), inactiveTheme)),
      onMouseLeave: () => setTheme(inactiveTheme), */
      style: { backgroundColor: isActive(types[0]) ? theme[types[0]] : theme.default, marginBottom: 5 },
    };
  };
  const columns = props.columns || [8, 4];
  return (
    <Grid container>
      <Grid item xs={columns[0]}>
        <Tree data={data} onClick={(event, d) => setNode(d)} theme={theme} selected={node} {...props} />
      </Grid>
      {node && !hideChips && (
        <Grid item xs={columns[1]}>
          <Chip label={`selected node: ${node.data.name}`} {...controlColors(['selected'])} />
          <br />
          <Chip label={`parent: ${node.parent?.data?.name || 'none'}`} {...controlColors(['parent', 'parentLink'])} />
          <br />
          <Chip
            label={`siblings: ${getSiblings(node)?.join(', ') || 'none'}`}
            {...controlColors(['sibling', 'parent', 'siblingLink', 'parentLink'])}
          />
          <br />
          <Chip
            label={`children: ${node.children?.map(({ data }) => data.name)?.join(', ') || 'none'}`}
            {...controlColors(['child', 'childLink'])}
          />
          <br />
          <Chip label="is root" icon={!node.parent ? <DoneIcon /> : <CloseIcon />} style={{ marginBottom: 5 }} />
          <br />
          <Chip
            label="is leaf"
            icon={!node.children?.length ? <DoneIcon /> : <CloseIcon />}
            style={{ marginBottom: 5 }}
          />
          <br />
          {!hideJson && (
            <JSONViewer
              src={node.data}
              name={false}
              displayObjectSize={false}
              displayDataTypes={false}
              enableClipboard={false}
              collapsed={3}
            />
          )}
        </Grid>
      )}
    </Grid>
  );
}
