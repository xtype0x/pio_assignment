import { combineReducers } from 'redux';

import authReducer from "./auth"
import lineitemReducer from "./lineitem"
import campaignReducer from "./campaign"
import invoiceReducer from "./invoice"
import historyReducer from "./history"

export default combineReducers({
   auth: authReducer,
   lineitem: lineitemReducer,
   campaign: campaignReducer,
   invoice: invoiceReducer,
   history: historyReducer
});