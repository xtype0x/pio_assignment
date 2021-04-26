import {HISTORY_GET_ROWS} from "../actions/history"

const initialState = {
  rows: [],
  page: 1,
  max_page: 1,
  is_loaded: false,
  message: ""
}

export default function historyReducer(state = initialState, action ) {
  switch(action.type) {
    case HISTORY_GET_ROWS: {
      return {
        ...state,
        rows: action.payload.rows,
        page: action.payload.page,
        max_page: action.payload.max_page,
        is_loaded: true
      }
    }
    default:
      return {
        ...state
      };
  }
}
