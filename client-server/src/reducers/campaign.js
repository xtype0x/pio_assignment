import {CAMPAIGN_GET_ROWS,CAMPAIGN_REVIEW,CAMPAIGN_SORT_ROWS,CAMPAIGN_CLEAR_MESSAGE} from "../actions/campaign"

const initialState = {
  rows: [],
  page: 1,
  max_page: 1,
  orderBy: 'id',
  reverseOrder: false,
  is_loaded: false,
  message: ""
}

export default function campaignReducer(state = initialState, action ) {
  switch(action.type) {
    case CAMPAIGN_GET_ROWS:{
      return {
        ...state,
        rows: action.payload.rows,
        page: action.payload.page,
        max_page: action.payload.max_page,
        is_loaded: true
      }
    }
    case CAMPAIGN_REVIEW: {
      var rows = state.rows, message = ""
      if(!action.payload.error){
        const cid = action.payload.cid;
        const ind = rows.findIndex(row => row.id === cid)
        if(ind !== -1){
          rows[ind].is_reviewed = action.payload.campaign.is_reviewed
          message = rows[ind].name+" reviewed"
        }
      }
      return {
        ...state,
        rows: rows,
        message: message?message: ""
      }
    }
    case CAMPAIGN_SORT_ROWS: {
      let reverseOrder = state.reverseOrder
      let orderBy = state.orderBy
      if(orderBy === action.payload.orderBy){
        reverseOrder = !reverseOrder
      }else{
        orderBy = action.payload.orderBy
        reverseOrder = false
      }
      return {
        ...state,
        orderBy: orderBy,
        reverseOrder: reverseOrder,
      }
    }
    case CAMPAIGN_CLEAR_MESSAGE: {
      return {
        ...state,
        message: ""
      }
    }
    default:
      return {
        ...state
      };
  }
}