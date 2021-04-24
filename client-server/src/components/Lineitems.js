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
import {get_rows} from "../actions/lineitem";

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

const Lineitems = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [page, setPage] = useState(1)

  const lineitemProps = useSelector((state) => state.lineitem);

  useEffect(() => {
    const options = {
      page: page,
      is_archived: false
    }
    dispatch(get_rows(options))
  },[page])

  const pageChange = (event, value) => {
    setPage(value);
  };

  return (
    <div className={classes.root}>
      <CssBaseline />
      <Navbar page="lineitems"/>
      <main className={classes.content}>
        <div className={classes.appBarSpacer} />
        <Container maxWidth="lg" className={classes.container}>
          <Typography component="h2" variant="h4" color="primary" gutterBottom>
            Line-items
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              {lineitemProps.is_loaded && <>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>ID</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Name</TableCell>
                      <TableCell>Campaigns</TableCell>
                      <TableCell>Booked Amount</TableCell>
                      <TableCell>Actual Amount</TableCell>
                      <TableCell>Adjustments</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {lineitemProps.rows.map(row => (
                      <TableRow key={row.id}>
                        <TableCell>{row.id}</TableCell>
                        <TableCell>{row.is_reviewed?"Reviewed":"Not reviewed"}</TableCell>
                        <TableCell>{row.name}</TableCell>
                        <TableCell>{row.campaign_name}</TableCell>
                        <TableCell>{row.booked_amount}</TableCell>
                        <TableCell>{row.actual_amount}</TableCell>
                        <TableCell>{row.adjustments}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                <Pagination
                  showFirstButton
                  showLastButton
                  color="primary"
                  count={lineitemProps.max_page}
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

export default Lineitems;