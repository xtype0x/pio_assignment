import {
  LINEITEM_GET_ROWS,
  LINEITEM_SORT_ROWS,
  LINEITEM_CLEAR_MESSAGE,
  LINEITEM_REVIEW,
  LINEITEM_ARCHIVE,
  LINEITEM_EDIT_ADJUSTMENTS,
  LINEITEM_GET_COMMENTS,
  LINEITEM_CREATE_COMMENT
} from "../actions/lineitem"


const initialState = {
  rows: [],
  page: 1,
  max_page: 1,
  orderBy: 'id',
  reverseOrder: false,
  comments: [],
  is_loaded: false
}

export default function lineitemReducer(state = initialState, action ) {
  switch(action.type) {
    case LINEITEM_GET_ROWS:{
      return {
        ...state,
        rows: action.payload.rows,
        page: action.payload.page,
        max_page: action.payload.max_page,
        is_loaded: true
      }
    }
    case LINEITEM_SORT_ROWS: {
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
    case LINEITEM_REVIEW: {
      let rows = state.rows, message = ""
      if(!action.payload.error){
        const lid = action.payload.lid;
        const ind = rows.findIndex(row => row.id === lid)
        if(ind !== -1){
          rows[ind].is_reviewed = action.payload.lineitem.is_reviewed
          message = rows[ind].name+" reviewed"
        }
      }
      return {
        ...state,
        rows: rows,
        message: message?message: ""
      }
    }
    case LINEITEM_ARCHIVE: {
      let rows = state.rows, message = ""
      if(!action.payload.error){
        const lid = action.payload.lid;
        const ind = rows.findIndex(row => row.id === lid)
        if(ind !== -1){
          message = rows[ind].name+" archived"
          rows.splice(ind,1)
        }
      }
      return {
        ...state,
        rows: rows,
        message: message?message: ""
      }
    }
    case LINEITEM_EDIT_ADJUSTMENTS: {
      let rows = state.rows, message = ""
      if(!action.payload.error){
        const lid = action.payload.lid;
        const ind = rows.findIndex(row => row.id === lid)
        if(ind !== -1){
          message = rows[ind].name+" updated"
          rows[ind].adjustments = action.payload.lineitem.adjustments
        }
      }
      return {
        ...state,
        rows: rows,
        message: message?message: ""
      }
    }
    case LINEITEM_GET_COMMENTS: {
      return {
        ...state,
        comments: action.payload.comments
      }
    }
    case LINEITEM_CREATE_COMMENT: {
      return {
        ...state,
        comments: state.comments.concat(action.payload.comment)
      }
    }
    case LINEITEM_CLEAR_MESSAGE: {
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