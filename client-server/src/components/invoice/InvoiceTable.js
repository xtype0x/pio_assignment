import { useSelector, useDispatch } from "react-redux";
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import { makeStyles } from '@material-ui/core/styles';

import { sort_rows } from "../../actions/invoice"

const NUMS_PER_ROWS = 20

const useStyles = makeStyles((theme) => ({
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

const InvoiceTable = () => {
  const classes = useStyles();
  const dispatch = useDispatch();

  const invoiceState = useSelector((state) => state.invoice);

  const numberFormatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 2
  });

  let headCells = []
  if(!invoiceState.options.group_by_campaign){
    headCells.push({ id: 'name', numeric: false, disablePadding: false, label: 'Name' })
  }
  headCells.push({ id: 'campaign_name', numeric: false, disablePadding: false, label: 'Camapign Name' })
  headCells.push({ id: 'sub_total', numeric: false, disablePadding: false, label: 'Billable Amount' })

  const order = (invoiceState.reverseOrder?"desc":"asc")

  const sortHandler = (orderBy) => (event) => {
    dispatch(sort_rows(orderBy))
  }

  const start = (invoiceState.page-1)*NUMS_PER_ROWS, end = invoiceState.page*NUMS_PER_ROWS

  return (
    <Table>
      <TableHead>
        <TableRow>
          {headCells.map((headCell) => (
            <TableCell
              key={headCell.id}
              align={headCell.numeric ? 'right' : 'left'}
              padding={headCell.disablePadding ? 'none' : 'default'}
              sortDirection={invoiceState.orderBy === headCell.id ? order : false}
            >
              <TableSortLabel
                active={invoiceState.orderBy === headCell.id}
                direction={invoiceState.orderBy === headCell.id ? order : 'asc'}
                onClick={sortHandler(headCell.id)}
              >
                {headCell.label}
                {invoiceState.orderBy === headCell.id ? (
                  <span className={classes.visuallyHidden}>
                    {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                  </span>
                ) : null}
              </TableSortLabel>
            </TableCell>
          ))}
        </TableRow>
      </TableHead>
      <TableBody>
        {invoiceState.rows.slice(start,end).map((row,i) => (
          <TableRow key={i}>
            {!invoiceState.options.group_by_campaign && <TableCell>{row.name}</TableCell>}
            <TableCell>{row.campaign_name}</TableCell>
            <TableCell>{numberFormatter.format(row.sub_total)}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

export default InvoiceTable;
