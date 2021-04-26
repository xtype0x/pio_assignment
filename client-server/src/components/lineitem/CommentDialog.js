import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import TextField from '@material-ui/core/TextField';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import List from '@material-ui/core/List';
import ListItemText from '@material-ui/core/ListItemText';
import Divider from '@material-ui/core/Divider';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';

import {get_comments,create_comment} from "../../actions/lineitem"

const CommentDialog = (props) => {
  const dispatch = useDispatch();
  const open = props.open, handleClose = props.handleClose, lid = props.lid;
  const [newComment, setNewComment] = useState("")

  const lineitemState = useSelector((state) => state.lineitem);
  const editingLineitem = lineitemState.rows.find(row => row.id === lid)

  useEffect(() => {
    if(open && editingLineitem){
      dispatch(get_comments(lid))
    }
  },[editingLineitem,lid,open,dispatch])

  const submit = (e) => {
    e.preventDefault()
    dispatch(create_comment(lid,newComment))
    setNewComment("")
  }

  return (
    <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title" fullWidth={true} maxWidth="md">
      <DialogTitle id="form-dialog-title">Comments - {editingLineitem?editingLineitem.name:""}</DialogTitle>
      <DialogContent>
        <Paper style={{padding: 10, maxHeight: 400, overflow:"scroll"}}>
          <List>
            {lineitemState.comments.map((comment, i) => (
              <div key={i}>
                <ListItemText
                  primary={"["+new Date(comment.created_at).toLocaleString()+"] "+comment.user_name+" :"}
                  secondary={comment.content}
                />
                <Divider component="li" />
              </div>
            ))}
          </List>
        </Paper>
        <form style={{padding: 10,}} noValidate onSubmit={submit}>
          <TextField
            id="new-comment"
            label="New comment"
            value={newComment}
            onChange={(event) => setNewComment(event.target.value)}
            fullWidth
            rows={4}
            multiline
            type="text"
            variant="filled"
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            style={{margin: 10}}
            onClick={submit}
          >
            Submit
          </Button>
        </form>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default CommentDialog;