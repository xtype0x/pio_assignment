import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { makeStyles } from '@material-ui/core/styles';
import alertify from 'alertifyjs';
import 'alertifyjs/build/css/alertify.css';

const useStyles = makeStyles((theme) => ({
  codeField: {
    "& input": {
      fontFamily: "source-code-pro, Menlo, Monaco, Consolas, 'Courier New',monospace"
    }
  }
}));

const FilterCodeDialog = (props) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const open = props.open, handleClose = props.handleClose, submit=props.submit
  const [val, setVal] = useState("")

  const saveEdited = () => {
    //check val
    var code;
    try {
      code = JSON.parse(val);
    } catch (e) {
      return alertify.error("Filter code is not valid")
    }
    if("group_by_campaign" in code && typeof code.group_by_campaign !== "boolean"){
      return alertify.error("Filter code is not valid")
    }
    if("filter_by_campaign" in code && Array.isArray(code.filter_by_campaign)){
      return alertify.error("Filter code is not valid")
    }
    if("filter_by_lineitem" in code && Array.isArray(code.filter_by_lineitem)){
      return alertify.error("Filter code is not valid")
    }

    submit(val)
    setVal("")
    handleClose()
  }

  return (
    <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title" fullWidth={true}>
      <DialogTitle id="form-dialog-title">Input Filter Code</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          value={val}
          className={classes.codeField}
          onChange={(event) => setVal(event.target.value)}
          id="filter-code"
          label="Filter Code"
          type="text"
          fullWidth
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          Cancel
        </Button>
        <Button onClick={saveEdited} color="primary">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default FilterCodeDialog;