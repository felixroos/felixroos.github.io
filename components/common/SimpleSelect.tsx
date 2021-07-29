import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
}));

export default function SimpleSelect({
  onChange,
  value,
  values,
  labels,
  label,
}: {
  labels?: string[];
  values: any[];
  onChange: (value: any) => void;
  value: any;
  label?: string;
}) {
  const classes = useStyles();
  const options = values.map((value, index) => [value, labels?.[index] || value]);
  const handleChange = (event) => onChange(event.target.value);
  return (
    <FormControl className={classes.formControl}>
      {label && <InputLabel id="demo-simple-select-label">{label}</InputLabel>}
      <Select labelId="demo-simple-select-label" id="demo-simple-select" value={value} onChange={handleChange}>
        {options.map(([value, label], index) => (
          <MenuItem value={value} key={index}>
            {label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}
