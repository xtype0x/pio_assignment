import React from 'react';
import { useSelector, useDispatch } from "react-redux";
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';

import {search_filter} from "../../actions/invoice"

const MultiSelector = (props) => {
  const dispatch = useDispatch();
  const value = props.value, setValue = props.setValue
  const [inputValue, setInputValue] = React.useState('');
  const [open, setOpen] = React.useState(false);

  const invoiceState = useSelector((state) => state.invoice);

  const filter_type = props.filter_type
  const LABELS = {
    'lineitem': "Line-item Filter",
    'campaign': "Campaign Filter",
  }
  var options = [];
  if(filter_type === "lineitem")
    options = invoiceState.lineitemfilterOptions
  else if(filter_type === "campaign")
    options = invoiceState.campaignfilterOptions

  React.useEffect(() => {

    if (inputValue === '') {
      return undefined;
    }

    dispatch(search_filter(filter_type,inputValue))

  }, [value,inputValue,dispatch,filter_type]);

  return (
    <Autocomplete
      multiple
      style={{ width: "100%", marginTop: 10 }}
      open={open}
      onOpen={() => {
        setOpen(true);
      }}
      onClose={() => {
        setOpen(false);
      }}
      value={value}
      onInputChange={(event, newInputValue) => {
        setInputValue(newInputValue);
      }}
      onChange={(event, newValue) => {
        setValue(newValue);
      }}
      getOptionSelected={(option, value) => option.id === value.id}
      getOptionLabel={(option) => option.name}
      options={options}
      renderInput={(params) => (
        <TextField
          {...params}
          label={LABELS[filter_type]+ " (No input means no filter)"}
          variant="outlined"
        />
      )}
    />
  );
}

export default MultiSelector