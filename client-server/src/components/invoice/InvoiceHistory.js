import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import List from '@material-ui/core/List';
import ListItemText from '@material-ui/core/ListItemText';
import Divider from '@material-ui/core/Divider';

import {get_history} from "../../actions/invoice"

const InvoiceHistory = () => {
  const dispatch = useDispatch();

  const invoiceState = useSelector((state) => state.invoice);

  useEffect(() => {
    dispatch(get_history())
  },[invoiceState.options,dispatch])

  return (
    <List>
      {invoiceState.history.map((h, i) => (
        <div key={i}>
          <ListItemText
            primary={
              <>
                {(h.type==="get_invoice"?"Get invoice":"Download invoice")}
                <small>[{new Date(h.created_at).toLocaleString()}]</small>
              </>
            }
            secondary={
              <>
                Filter code: 
                <code style={{background:"#cecece"}}>{JSON.stringify(h.log.options)}</code>
              </>
            }
          />
          <Divider component="li" />
        </div>
      ))}
    </List>
  )
}

export default InvoiceHistory