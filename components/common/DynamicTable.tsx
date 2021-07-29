import clsx from 'clsx';
import React, { useEffect, useState } from 'react';
import { makeStyles, createStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import JSONViewer from './JSONViewer';
import Toolbar from '@material-ui/core/Toolbar';
import {
  Typography,
  Tooltip,
  IconButton,
  Theme,
  lighten
} from '@material-ui/core';

const useStyles = makeStyles({
  table: {
    minWidth: 400
  },
  visuallyHidden: {
    border: 0,
    clip: 'rect(0 0 0 0)',
    height: 1,
    margin: -1,
    overflow: 'hidden',
    padding: 0,
    position: 'absolute',
    top: 20,
    width: 1
  }
});

declare type Order = 'asc' | 'desc';

declare interface FieldConfig {
  property: string;
  label?: string;
  sort?: (a, b) => number;
  defaultOrder?: Order;
  resolve?: (row?: Object, index?: number, rows?: Object[]) => any;
  desc?: boolean;
  heading?: React.ReactNode;
  display?: (value: any) => React.ReactNode;
  [key: string]: any;
}

export default function DynamicTable({
  cols: _cols,
  rows: _rows,
  debug = false,
  orderedBy = '',
  heading = ''
}: {
  cols: Array<string | FieldConfig>;
  rows: Object[];
  debug?: boolean;
  orderedBy?: string;
  heading?: React.ReactNode;
}) {
  const [rows, setRows] = useState(_rows);
  useEffect(() => {
    setRows(_rows);
  }, [_rows]);
  const classes = useStyles();
  // unify field
  const cols: FieldConfig[] = _cols
    .map((field) => (typeof field === 'string' ? { property: field } : field))
    .map((field) => ({
      align: 'left',
      label: field.property,
      display: (value) => value,
      defaultOrder: 'asc',
      resolve: (row) => row[field.property],
      ...field
    }));
  let defaultOrder: Order = 'asc';
  if (orderedBy) {
    defaultOrder =
      cols.find(({ property }) => property === orderedBy)?.defaultOrder ||
      'asc';
  }
  const [order, setOrder] = useState<Order>(defaultOrder);
  const [orderBy, setOrderBy] = useState(orderedBy || '');
  function handleSort({ property, sort, resolve, defaultOrder }: FieldConfig) {
    let sorted = [...rows.sort((a, b) => sort(resolve(a), resolve(b)))];
    let _order = order;
    if (orderBy === property) {
      _order = order === 'asc' ? 'desc' : 'asc';
    } else {
      _order = defaultOrder;
    }
    if (_order !== defaultOrder) {
      sorted.reverse();
    }
    setOrder(_order);
    setOrderBy(property);
    setRows(sorted);
  }
  return (
    <>
      {debug && <JSONViewer src={rows} collapsed={false} />}
      <TableContainer component={Paper}>
        {heading && <EnhancedTableToolbar numSelected={0} heading={heading} />}
        <Table
          className={classes.table}
          size="small"
          aria-label="a dense table"
        >
          <TableHead>
            <TableRow>
              {cols.map((field) => {
                const {
                  property,
                  label,
                  align,
                  heading,
                  sort,
                  defaultOrder
                } = field;
                return (
                  <TableCell
                    style={{ cursor: 'pointer' }}
                    key={property}
                    align={align}
                  >
                    <TableSortLabel
                      active={orderBy === property}
                      direction={orderBy === property ? order : defaultOrder}
                      onClick={() => sort && handleSort(field)}
                    >
                      {heading || label}
                      {orderBy === property ? (
                        <span className={classes.visuallyHidden}>
                          {order === 'desc'
                            ? 'sorted descending'
                            : 'sorted ascending'}
                        </span>
                      ) : null}
                    </TableSortLabel>
                  </TableCell>
                );
              })}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row, index) => (
              <TableRow key={index}>
                {cols.map(({ property, align, display, resolve }) => (
                  <TableCell
                    key={property}
                    component="th"
                    scope="row"
                    align={align}
                  >
                    {display(resolve(row, index, rows))}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}
const useToolbarStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      paddingLeft: theme.spacing(2),
      paddingRight: theme.spacing(1)
    },
    highlight:
      theme.palette.type === 'light'
        ? {
            color: theme.palette.secondary.main,
            backgroundColor: lighten(theme.palette.secondary.light, 0.85)
          }
        : {
            color: theme.palette.text.primary,
            backgroundColor: theme.palette.secondary.dark
          },
    title: {
      flex: '1 1 100%'
    }
  })
);
interface EnhancedTableToolbarProps {
  numSelected: number;
  heading: string;
}
const EnhancedTableToolbar = (props: EnhancedTableToolbarProps) => {
  const classes = useToolbarStyles();
  const { numSelected, heading = '' } = props;

  return (
    <Toolbar
      className={clsx(classes.root, {
        [classes.highlight]: numSelected > 0
      })}
    >
      {numSelected > 0 ? (
        <Typography
          className={classes.title}
          color="inherit"
          variant="subtitle1"
          component="div"
        >
          {numSelected} selected
        </Typography>
      ) : (
        <Typography
          className={classes.title}
          variant="h6"
          id="tableTitle"
          component="div"
        >
          {heading}
        </Typography>
      )}
      {/* {numSelected > 0 ? (
        <Tooltip title="Delete">
          <IconButton aria-label="delete">
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      ) : (
        <Tooltip title="Filter list">
          <IconButton aria-label="filter list">
            <FilterListIcon />
          </IconButton>
        </Tooltip>
      )} */}
    </Toolbar>
  );
};

export const sortString = (a, b) => ('' + a).localeCompare(b);
export const sortNumber = (a, b) => a - b;
export const sortBoolean = (a, b) => (a && !b ? -1 : 1);
