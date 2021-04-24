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
import {get_rows} from "../actions/campaign";

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

const Campaigns = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [page, setPage] = useState(1)

  const campaignProps = useSelector((state) => state.campaign);

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
      <Navbar page="campaigns"/>
      <main className={classes.content}>
        <div className={classes.appBarSpacer} />
        <Container maxWidth="lg" className={classes.container}>
          <Typography component="h2" variant="h4" color="primary" gutterBottom>
            Campaigns
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              {campaignProps.is_loaded && <>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>ID</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Name</TableCell>
                      <TableCell>Line-item Count</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {campaignProps.rows.map(row => (
                      <TableRow key={row.id}>
                        <TableCell>{row.id}</TableCell>
                        <TableCell>{row.is_reviewed?"Reviewed":"Not reviewed"}</TableCell>
                        <TableCell>{row.name}</TableCell>
                        <TableCell>{row.lineitem_count}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                <Pagination
                  showFirstButton
                  showLastButton
                  color="primary"
                  count={campaignProps.max_page}
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

export default Campaigns;