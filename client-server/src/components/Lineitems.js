import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import CssBaseline from '@material-ui/core/CssBaseline';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Button from '@material-ui/core/Button';
import Badge from '@material-ui/core/Badge';
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
import EditLineitemDialog from "./lineitem/EditLineitemDialog"
import CommentDialog from "./lineitem/CommentDialog"
import {
  get_rows,
  sort_rows,
  clear_message,
  review,
  archive
} from "../actions/lineitem";

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

const Lineitems = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [page, setPage] = useState(1)
  const [tab, setTab] = useState(0)
  const [editingLineitem, setEditingLineitem] = useState(0)
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [commentLid, setCommentLid] = useState(0)
  const [commentDialogOpen, setCommentDialogOpen] = useState(false);

  const lineitemState = useSelector((state) => state.lineitem);

  const numberFormatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 2
  });

  const headCells = [
    { id: 'id', numeric: false, disablePadding: false, label: 'id' },
    { id: 'is_reviewed', numeric: false, disablePadding: false, label: 'Status' },
    { id: 'name', numeric: false, disablePadding: false, label: 'Name' },
    { id: 'campaign_name', numeric: false, disablePadding: false, label: 'Campaign' },
    { id: 'booked_amount', numeric: false, disablePadding: false, label: 'Booked Amount' },
    { id: 'actual_amount', numeric: false, disablePadding: false, label: 'Actual Amount' },
    { id: 'adjustments', numeric: false, disablePadding: false, label: 'Adjustments' },
    { id: 'comment_count', numeric: false, disablePadding: false, label: 'Comments' },
  ]
  const order = (lineitemState.reverseOrder?"desc":"asc")

  useEffect(() => {
    if(lineitemState.message){
      alertify.success(lineitemState.message)
      dispatch(clear_message())
    }
  },[lineitemState.message])

  useEffect(() => {
    const options = {
      page: page,
      is_archived: tab === 1,
      orderBy: lineitemState.orderBy,
      reverseOrder: lineitemState.reverseOrder
    }
    dispatch(get_rows(options))
  },[page,lineitemState.orderBy,lineitemState.reverseOrder,tab])

  const pageChange = (event, value) => {
    setPage(value);
  };

  const tabChange = (event, newValue) => {
    setTab(newValue);
  };

  const sortHandler = (orderBy) => (event) => {
    dispatch(sort_rows(orderBy))
  }

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
          <Tabs value={tab} onChange={tabChange} aria-label="tab">
            <Tab label="Active" />
            <Tab label="Archived" />
          </Tabs>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              {lineitemState.is_loaded && <>
                <Table>
                  <TableHead>
                    <TableRow>
                      {headCells.map((headCell) => (
                        <TableCell
                          key={headCell.id}
                          align={headCell.numeric ? 'right' : 'left'}
                          padding={headCell.disablePadding ? 'none' : 'default'}
                          sortDirection={lineitemState.orderBy === headCell.id ? order : false}
                        >
                          <TableSortLabel
                            active={lineitemState.orderBy === headCell.id}
                            direction={lineitemState.orderBy === headCell.id ? order : 'asc'}
                            onClick={sortHandler(headCell.id)}
                          >
                            {headCell.label}
                            {lineitemState.orderBy === headCell.id ? (
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
                    {lineitemState.rows.map(row => (
                      <TableRow key={row.id}>
                        <TableCell>{row.id}</TableCell>
                        <TableCell style={{color: (row.is_reviewed?"green":"orange")}}>{row.is_reviewed?"Reviewed":"Not reviewed"}</TableCell>
                        <TableCell>{row.name}</TableCell>
                        <TableCell>{row.campaign_name}</TableCell>
                        <TableCell>{numberFormatter.format(row.booked_amount)}</TableCell>
                        <TableCell>{numberFormatter.format(row.actual_amount)}</TableCell>
                        <TableCell>{numberFormatter.format(row.adjustments)}</TableCell>
                        <TableCell>
                          <Badge badgeContent={row.comment_count} color="primary" invisible={row.comment_count==0}>
                            <Button 
                              variant="contained" 
                              style={{marginBottom: 5}} 
                              color="secondary"
                              onClick={() => {
                                setCommentLid(row.id)
                                setCommentDialogOpen(true)
                              }}>
                              Comments
                            </Button>
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {!(row.is_reviewed || row.is_archived) && <>
                            <Button 
                              variant="contained" 
                              style={{marginBottom: 5}} 
                              color="primary" 
                              onClick={() => {
                                setEditingLineitem(row.id)
                                setEditDialogOpen(true);
                              }}>
                              Edit
                            </Button>
                            <Button variant="contained" style={{marginBottom: 5}} color="primary" onClick={() => dispatch(review(row.id))}>Review</Button>
                          </>}
                          {!(row.is_archived) && <Button variant="contained" color="primary" onClick={() => dispatch(archive(row.id))}>Archive</Button>}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                <Pagination
                  showFirstButton
                  showLastButton
                  color="primary"
                  count={lineitemState.max_page}
                  boundaryCount={2}
                  page={page}
                  onChange={pageChange}/>
              </>}
            </Grid>
          </Grid>
          <EditLineitemDialog 
            lid={editingLineitem}
            open={editDialogOpen}
            handleClose={() => setEditDialogOpen(false)}
          />
          <CommentDialog
            lid={commentLid}
            open={commentDialogOpen}
            handleClose={() => setCommentDialogOpen(false)}
          />
        </Container>
      </main>
    </div>
  )
}

export default Lineitems;