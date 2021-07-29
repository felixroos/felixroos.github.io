import Divider from "@material-ui/core/Divider"
import Grid from "@material-ui/core/Grid"
import IconButton from "@material-ui/core/IconButton"
import List from "@material-ui/core/List"
import ListItem from "@material-ui/core/ListItem"
import Slider from "@material-ui/core/Slider"
import Typography from "@material-ui/core/Typography"
import AddIcon from "@material-ui/icons/Add"
import CloseIcon from "@material-ui/icons/Close"
import React from "react"
import SimplePopover from "../common/Popover"

export function FrequencyPlotSettings({ state, setState }) {
  return (
    <SimplePopover placement="left-start">
      <Typography>Waves</Typography>
      {state.frequencies.length < 10 && (
        <IconButton
          edge="end"
          size="small"
          color="primary"
          aria-label="add"
          onClick={() =>
            setState({
              frequencies: state.frequencies.concat([
                [
                  (state.frequencies.length + 1) / 2,
                  1 / (state.frequencies.length + 1),
                  0,
                ],
              ]),
            })
          }
        >
          <AddIcon />
        </IconButton>
      )}
      <List dense={true}>
        {state.frequencies.map(([frequency, amplitude, phase], index) => (
          <React.Fragment key={index}>
            <Divider style={{ marginBottom: 10 }} />
            <ListItem>
              <Grid spacing={0} container style={{ width: 300 }}>
                <Grid item xs={2}>
                  <Typography>{frequency}Hz</Typography>
                </Grid>
                <Grid item xs={8}>
                  <Slider
                    min={0.5}
                    max={10}
                    step={0.1}
                    value={frequency}
                    onChange={(e, v) =>
                      setState({
                        frequencies: state.frequencies.map((_f, i) =>
                          i === index ? [v, _f[1], _f[2]] : _f
                        ),
                      })
                    }
                  />
                </Grid>
                <Grid item xs={2}>
                  {state.frequencies.length > 1 && (
                    <CloseIcon
                      onClick={() =>
                        setState({
                          frequencies: state.frequencies.filter(
                            (f, i) => i !== index
                          ),
                        })
                      }
                    />
                  )}
                </Grid>
                <Grid item xs={2}>
                  <Typography>{Math.round(amplitude * 100)}%</Typography>
                </Grid>
                <Grid item xs={10}>
                  <Slider
                    min={-1}
                    max={1}
                    step={0.1}
                    value={amplitude}
                    onChange={(e, v) =>
                      setState({
                        frequencies: state.frequencies.map((_f, i) =>
                          i === index ? [_f[0], v, _f[2]] : _f
                        ),
                      })
                    }
                  />
                </Grid>
                <Grid item xs={2}>
                  <Typography>
                    {!!phase && "+"}
                    {Math.round(phase)}°
                  </Typography>
                </Grid>
                <Grid item xs={10}>
                  <Slider
                    min={0}
                    max={180}
                    step={2}
                    value={phase}
                    onChange={(e, v) =>
                      setState({
                        frequencies: state.frequencies.map((_f, i) =>
                          i === index ? [_f[0], _f[1], v] : _f
                        ),
                      })
                    }
                  />
                </Grid>
              </Grid>
            </ListItem>
          </React.Fragment>
        ))}
      </List>
    </SimplePopover>
  )
}
