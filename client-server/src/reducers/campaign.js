import {CAMPAIGN_GET_ROWS} from "../actions/campaign"

const initialState = {
  rows: [],
  page: 1,
  max_page: 1,
  is_loaded: false
}

export default function campaignReducer(state = initialState, action ) {
  switch(action.type) {
    case CAMPAIGN_GET_ROWS:
      return {
        ...state,
        rows: action.payload.rows,
        page: action.payload.page,
        max_page: action.payload.max_page,
        is_loaded: true
      }
    default:
      return {
        ...state
      };
  }
}