import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import CssBaseline from '@material-ui/core/CssBaseline';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Pagination from '@material-ui/lab/Pagination';
import { makeStyles } from '@material-ui/core/styles';

import Navbar from "./Navbar"
import HistoryLogFormatter from "./utils/HistoryLogFormatter"
import {get_rows} from "../actions/history"

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  appBarSpacer: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    height: '100vh',
    overflow: 'auto',
  },
  container: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
  },
}));

const UserHistory = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [page, setPage] = useState(1)

  const historyState = useSelector((state) => state.history);

  useEffect(() => {
    const options = {
      page: page
    }
    dispatch(get_rows(options))
  },[page,dispatch])

  const pageChange = (event, value) => {
    setPage(value);
  };

  return (
    <div className={classes.root}>
      <CssBaseline />
      <Navbar page="userhistory"/>
      <main className={classes.content}>
        <div className={classes.appBarSpacer} />
        <Container maxWidth="lg" className={classes.container}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography component="h2" variant="h4" color="primary" gutterBottom>
                User History
              </Typography>
              {historyState.is_loaded && <>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Datetime</TableCell>
                      <TableCell>User</TableCell>
                      <TableCell>Log</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {historyState.rows.map((row,i) => (
                      <TableRow key={i}>
                        <TableCell>{new Date(row.created_at).toLocaleString()}</TableCell>
                        <TableCell>{row.user_name}</TableCell>
                        <TableCell><HistoryLogFormatter type={row.type} log={row.log}/></TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                <Pagination
                  showFirstButton
                  showLastButton
                  color="primary"
                  count={historyState.max_page}
                  boundaryCount={2}
                  page={page}
                  onChange={pageChange}/>
              </>}
            </Grid>
          </Grid>
        </Container>
      </main>
    </div>
  )
}

export default UserHistory;