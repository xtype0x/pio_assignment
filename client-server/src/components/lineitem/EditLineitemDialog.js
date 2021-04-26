import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';

import {update_adjustments} from "../../actions/lineitem";

const EditLineitemDialog = (props) => {
  const dispatch = useDispatch();
  const open = props.open, handleClose = props.handleClose, lid = props.lid;
  const [val, setVal] = useState(0)

  const lineitemState = useSelector((state) => state.lineitem);
  const editingLineitem = lineitemState.rows.find(row => row.id === lid)

  useEffect(() => {
    if(editingLineitem){
      const adj = +editingLineitem.adjustments
      setVal(adj)
    }
  },[editingLineitem,open])
  

  const saveEdited = () => {
    dispatch(update_adjustments(lid,val))
    handleClose()
  }

  return (
    <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title" fullWidth={true}>
      <DialogTitle id="form-dialog-title">Edit Lineitem - {editingLineitem?editingLineitem.name:""}</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          value={val}
          onChange={(event) => setVal(event.target.value)}
          id="adjustments"
          label="Adjustments"
          type="number"
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

export default EditLineitemDialog;