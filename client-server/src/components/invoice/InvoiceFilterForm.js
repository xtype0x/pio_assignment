import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import clsx from 'clsx';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import CssBaseline from '@material-ui/core/CssBaseline';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import GetAppIcon from '@material-ui/icons/GetApp';
import { makeStyles } from '@material-ui/core/styles';

import MultiSelector from "./MultiSelector"
import FilterCodeDialog from "./FilterCodeDialog"
import { get_rows,download_file } from "../../actions/invoice"

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
    minHeight: 300,
  },
}));

const InvoiceFilterForm = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [filterCodeDialogOpen, setFilterCodeDialog] = useState(false);

  const minHeightPaper = clsx(classes.paper, classes.minHeight);

  const invoiceState = useSelector((state) => state.invoice);

  const [campaignFilter, setCampaignFilter] = useState([])
  const [lineitemFilter, setLineitemFilter] = useState([])
  const [groupByCampaign, setGroupByCampaign] = useState(false)

  const handleCheckbox = (e) => {
    setGroupByCampaign(e.target.checked)
  }

  const submit = (e) => {
    e.preventDefault()
    const options = {
      group_by_campaign: groupByCampaign,
      filter_by_lineitem: lineitemFilter.length>0?lineitemFilter.map(item => item.id):undefined,
      filter_by_campaign: campaignFilter.length>0?campaignFilter.map(item => item.id):undefined
    }
    dispatch(get_rows(options))
  }

  const filter_code_submit = (code) => {
    const options = JSON.parse(code)
    dispatch(get_rows(options))
  }

  const download = (file_type) => {
    const options = {
      group_by_campaign: groupByCampaign,
      filter_by_lineitem: lineitemFilter.length>0?lineitemFilter.map(item => item.id):undefined,
      filter_by_campaign: campaignFilter.length>0?campaignFilter.map(item => item.id):undefined
    }
    dispatch(download_file(file_type,options))
  }

  return (
    <form noValidate autoComplete="off" onSubmit={submit}>
      <Typography component="h3" variant="h6" color="primary" gutterBottom>
        Filters
      </Typography>
      <Grid item xs={12}>
        <MultiSelector filter_type="lineitem" value={lineitemFilter} setValue={setLineitemFilter}/>
      </Grid>
      <Grid item xs={12}>
        <MultiSelector filter_type="campaign" value={campaignFilter} setValue={setCampaignFilter}/>
      </Grid>
      <Grid item xs={12}>
        <FormControlLabel
          control={
            <Checkbox
              checked={groupByCampaign}
              onChange={handleCheckbox}
              name="campaign"
              color="primary"
            />
          }
          label="Group by Campaign"
        />
      </Grid>
      <Button
        type="submit"
        variant="contained"
        color="primary"
        className={classes.submit}
        onClick={submit}
      >
        Submit
      </Button>
      <Button
        type="button"
        variant="contained"
        color="secondary"
        className={classes.submit}
        onClick={() => setFilterCodeDialog(true)}
      >
        Use Filter Code
      </Button>
      <Button
        type="button"
        variant="contained"
        color="default"
        className={classes.submit}
        startIcon={<GetAppIcon />}
        onClick={(e)=>download("csv")}
      >
        Download Invoice (CSV)
      </Button>
      <Button
        type="button"
        variant="contained"
        color="default"
        className={classes.submit}
        startIcon={<GetAppIcon />}
        onClick={(e)=>download("xlsx")}
      >
        Download Invoice (Xlsx)
      </Button>
      <FilterCodeDialog 
        open={filterCodeDialogOpen}
        handleClose={() => setFilterCodeDialog(false)}
        submit={filter_code_submit}
      />
    </form>
  )
}

export default InvoiceFilterForm;