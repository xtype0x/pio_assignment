import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Redirect } from "react-router";
import Container from '@material-ui/core/Container';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Avatar from '@material-ui/core/Avatar';
import CssBaseline from '@material-ui/core/CssBaseline';
import AssignmentIcon from '@material-ui/icons/Assignment';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';

import {login, check_user} from "../actions/auth";

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(3),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

const Login = () => {
  const [name, setName] = useState("");
  const classes = useStyles();
  const dispatch = useDispatch();

  const auth = useSelector((state) => state.auth);
  
  useEffect(() => {
    dispatch(check_user())
  },[dispatch])

  const submit = (e) => {
    e.preventDefault()
    if (name === "") {
      alert("Please input name");
      return;
    }
    dispatch(login(name))
  }

  if(auth.user){
    return <Redirect to='/lineitems' />
  }
  if(!auth.is_loaded){
    return <div />
  }

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <AssignmentIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Login
        </Typography>

        <form className={classes.form} noValidate onSubmit={submit}>
          <TextField
            variant="outlined"
            required
            fullWidth
            id="name"
            label="Name"
            name="name"
            value={name}
            onChange={e => setName(e.target.value)}
            autoComplete="name"
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
            onClick={submit}
          >
            Login
          </Button>
        </form>
        <Grid container justify="flex-end">
          <Grid item>
            Just input name to login.
          </Grid>
        </Grid>
      </div>
    </Container>
  );
}

export default Login;
