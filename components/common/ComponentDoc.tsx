import React, { Fragment, useState } from 'react';
import JSONViewer from './JSONViewer';
import NestedGrid from '../graphs/NestedGrid';
import ArrowRightIcon from '@material-ui/icons/ArrowRight';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Collapse from '@material-ui/core/Collapse';
import { makeStyles } from '@material-ui/core/styles';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';

const useStyles = makeStyles((  ) => ({
  root: {
    /* width: '100%',
    maxWidth: 360, */
    // backgroundColor: theme.palette.background.paper,
    backgroundColor: '#ddd',
  },
  nested: {
    paddingLeft: theme.spacing(6),
    backgroundColor: '#efefef',
  },
}));

export default function ComponentDoc({ json }) {
  const classes = useStyles();

  const [opened, setOpened] = useState([]);
  const isOpen = (i) => opened.includes(i);
  const toggleOpen = (i) => setOpened(isOpen(i) ? opened.filter((_i) => _i !== i) : opened.concat([i]));
  const property = (name, required) => (required ? <strong>{name}</strong> : <>{name}?</>);
  const { displayName, props } = json;
  return (
    <div>
      {/* <h2>{displayName}</h2> */}
      {/* <JSONViewer
        src={props}
        name={false}
        displayObjectSize={false}
        displayDataTypes={false}
        enableClipboard={false}
        collapsed={1}
      /> */}
      <List component="nav" dense={true} className={classes.root}>
        {Object.entries(props).map(([name, prop]: any, i) => (
          <React.Fragment key={i}>
            <ListItem button onClick={() => toggleOpen(i)}>
              <ListItemText
                primary={
                  <>
                    {property(name, prop.required)}: <i>{prop.tsType?.raw}</i>
                  </>
                }
                secondary={prop.description}
              />
              {/* <ListItemText secondary={prop.description} /> */}
              {prop.tsType?.elements?.length && <>{isOpen(i) ? <ExpandLess /> : <ExpandMore />}</>}
            </ListItem>
            {prop.tsType?.elements?.length && (
              <Collapse in={isOpen(i)} timeout="auto" unmountOnExit>
                <List component="div" dense={true}>
                  {prop.tsType?.elements?.map((el, j) => (
                    <Fragment key={j}>
                      {/* el.name */}
                      {/* el.type */}
                      {/* <small>{el.raw}</small> */}
                      {el.signature?.properties?.map((p, k) => (
                        <ListItem button key={k} className={classes.nested}>
                          <ListItemText
                            primary={
                              <>
                                {property(p.key?.name || p.key, p.value?.required)}: <i>{p.value?.name}</i>
                              </>
                            }
                          />
                        </ListItem>
                      ))}
                    </Fragment>
                  ))}
                </List>
              </Collapse>
            )}
          </React.Fragment>
        ))}
      </List>
    </div>
  );
}
