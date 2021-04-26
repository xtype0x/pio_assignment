import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import clsx from 'clsx';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import CssBaseline from '@material-ui/core/CssBaseline';
import Paper from '@material-ui/core/Paper';
import Pagination from '@material-ui/lab/Pagination';
import GetAppIcon from '@material-ui/icons/GetApp';
import { makeStyles } from '@material-ui/core/styles';

import Navbar from "./Navbar"
import InvoiceTable from "./invoice/InvoiceTable"
import InvoiceFilterForm from "./invoice/InvoiceFilterForm"
import InvoiceHistory from "./invoice/InvoiceHistory"
import { set_table_page } from "../actions/invoice"

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
  paper: {
    padding: theme.spacing(2),
    display: 'flex',
    overflow: 'auto',
    flexDirection: 'column',
  },
  container: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
  },
  submit: {
    margin: theme.spacing(3, 1, 2),
  },
  minHeight: {
    height: 350,
  },
}));

const Invoice = () => {
  const classes = useStyles();
  const dispatch = useDispatch();

  const minHeightPaper = clsx(classes.paper, classes.minHeight);

  const numberFormatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 2
  });

  const invoiceState = useSelector((state) => state.invoice);

  const pageChange = (event, value) => {
    dispatch(set_table_page(value))
  };

  return (
    <div className={classes.root}>
      <CssBaseline />
      <Navbar page="invoice"/>
      <main className={classes.content}>
        <div className={classes.appBarSpacer} />
        <Container maxWidth="lg" className={classes.container}>
          <Typography component="h1" variant="h4" color="primary" gutterBottom>
            Invoice
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} md={8} lg={9}>
              <Paper className={minHeightPaper}>
                <InvoiceFilterForm />
              </Paper>
            </Grid>
            <Grid item xs={12} md={4} lg={3}>
              <Paper className={minHeightPaper}>
                <Typography component="h3" variant="h6" color="primary" gutterBottom>
                  History
                </Typography>
                <InvoiceHistory />
              </Paper>
            </Grid>
            {invoiceState.is_submit && <Grid item xs={12}>
                <Paper className={minHeightPaper}>
                  <Typography component="h3" variant="h6" color="primary" gutterBottom>
                    Result
                  </Typography>
                  <Typography component="h3" variant="h5" gutterBottom>
                    Grand Total: {numberFormatter.format(invoiceState.grand_total)}
                  </Typography>
                  <Pagination
                    showFirstButton
                    showLastButton
                    color="primary"
                    count={invoiceState.max_page}
                    boundaryCount={2}
                    page={invoiceState.page}
                    onChange={pageChange}/>
                  <InvoiceTable />
                </Paper>
              </Grid>}
          </Grid>
        </Container>
      </main>
    </div>
  )
}

export default Invoice;