import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import CssBaseline from '@material-ui/core/CssBaseline';
import Button from '@material-ui/core/Button';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Pagination from '@material-ui/lab/Pagination';
import { makeStyles } from '@material-ui/core/styles';
import alertify from 'alertifyjs';
import 'alertifyjs/build/css/alertify.css';

import Navbar from "./Navbar"
import {get_rows,review, sort_rows,clear_message} from "../actions/campaign";

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
  visuallyHidden: {
    border: 0,
    clip: 'rect(0 0 0 0)',
    height: 1,
    margin: -1,
    overflow: 'hidden',
    padding: 0,
    position: 'absolute',
    top: 20,
    width: 1,
  },
}));

const Campaigns = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [page, setPage] = useState(1)

  const campaignState = useSelector((state) => state.campaign);

  const headCells = [
    { id: 'id', numeric: false, disablePadding: false, label: 'id' },
    { id: 'is_reviewed', numeric: false, disablePadding: false, label: 'Status' },
    { id: 'name', numeric: false, disablePadding: false, label: 'Name' },
    { id: 'lineitem_count', numeric: false, disablePadding: false, label: 'Line-item Count' },
  ]
  const order = (campaignState.reverseOrder?"desc":"asc")

  useEffect(() => {
    if(campaignState.message){
      alertify.success(campaignState.message)
      dispatch(clear_message())
    }
  },[campaignState.message])

  useEffect(() => {
    const options = {
      page: page,
      orderBy: campaignState.orderBy,
      reverseOrder: campaignState.reverseOrder
    }
    dispatch(get_rows(options))
  },[page,campaignState.orderBy,campaignState.reverseOrder])

  const pageChange = (event, value) => {
    setPage(value);
  };

  const sortHandler = (orderBy) => (event) => {
    dispatch(sort_rows(orderBy))
  }

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
              {campaignState.is_loaded && <>
                <Table>
                  <TableHead>
                    <TableRow>
                      {headCells.map((headCell) => (
                        <TableCell
                          key={headCell.id}
                          align={headCell.numeric ? 'right' : 'left'}
                          padding={headCell.disablePadding ? 'none' : 'default'}
                          sortDirection={campaignState.orderBy === headCell.id ? order : false}
                        >
                          <TableSortLabel
                            active={campaignState.orderBy === headCell.id}
                            direction={campaignState.orderBy === headCell.id ? order : 'asc'}
                            onClick={sortHandler(headCell.id)}
                          >
                            {headCell.label}
                            {campaignState.orderBy === headCell.id ? (
                              <span className={classes.visuallyHidden}>
                                {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                              </span>
                            ) : null}
                          </TableSortLabel>
                        </TableCell>
                      ))}
                      <TableCell>Operation</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {campaignState.rows.map(row => (
                      <TableRow key={row.id}>
                        <TableCell>{row.id}</TableCell>
                        <TableCell style={{color: (row.is_reviewed?"green":"orange")}}>{row.is_reviewed?"Reviewed":"Not reviewed"}</TableCell>
                        <TableCell>{row.name}</TableCell>
                        <TableCell>{row.lineitem_count}</TableCell>
                        <TableCell>{!row.is_reviewed && <Button variant="contained" color="primary" onClick={() => dispatch(review(row.id))}>Reviewed</Button>}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                <Pagination
                  showFirstButton
                  showLastButton
                  color="primary"
                  count={campaignState.max_page}
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