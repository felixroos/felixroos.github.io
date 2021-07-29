import Card from "@material-ui/core/Card"
import CardContent from "@material-ui/core/CardContent"
import Fab from "@material-ui/core/Fab"
import Popper from "@material-ui/core/Popper"
import SettingsIcon from "@material-ui/icons/Settings"
import React, { useEffect } from "react"
import CloseIcon from "@material-ui/icons/Close"

export default function SimplePopover(props) {
  const [anchorEl, setAnchorEl] = React.useState(null)
  const { placement } = props
  const handleClick = (event) => {
    setAnchorEl(anchorEl ? null : event.currentTarget)
    event.preventDefault()
    event.stopPropagation()
  }
  /* useEffect(() => {
    const handleClick = () => setAnchorEl(null)
    window.addEventListener("click", handleClick)
    return () => {
      window.removeEventListener("click", handleClick)
    }
  }, []) */

  const open = Boolean(anchorEl)
  const id = open ? "simple-popover" : undefined

  return (
    <div>
      <Fab
        color="primary"
        aria-label="add"
        onClick={handleClick}
        aria-describedby={id}
      >
        {open ? <CloseIcon /> : <SettingsIcon />}
      </Fab>
      <Popper
        onClick={(e) => e.stopPropagation()}
        placement={placement || "left-start"}
        id={id}
        open={open}
        anchorEl={anchorEl}
      >
        <Card elevation={3}>
          <CardContent style={{ maxHeight: 500, overflow: "auto" }}>
            {props.children}
          </CardContent>
        </Card>
      </Popper>
    </div>
  )
}
