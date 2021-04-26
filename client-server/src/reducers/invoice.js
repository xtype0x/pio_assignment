import {
  INVOICE_GET_ROWS,
  INVOICE_DOWNLOAD_FILE,
  INVOICE_SORT_ROWS,
  INVOICE_SET_TABLE_PAGE,
  INVOICE_SEARCH_FILTER
} from "../actions/invoice"

const initialState = {
  rows: [],
  page: 1,
  max_page: 1,
  num_per_rows: 20,
  orderBy: 'sub_total',
  reverseOrder: true,
  campaignfilterOptions: [],
  lineitemfilterOptions: [],
  options: {
    group_by_campaign: false
  },
  is_submit: false
}

export default function invoiceReducer(state = initialState, action ) {
  switch(action.type) {
    case INVOICE_GET_ROWS:{
      let rows = action.payload.rows
      let reverseOrder = true
      let orderBy = 'sub_total'
      rows.sort((a,b) => {
        if (b[orderBy] < a[orderBy]) {
          return reverseOrder?-1:1;
        }
        if (b[orderBy] > a[orderBy]) {
          return reverseOrder?1:-1;
        }
        return 0;
      })
      return {
        ...state,
        rows: rows,
        page: 1,
        max_page: action.payload.max_page,
        grand_total: action.payload.grand_total,
        options: action.payload.options,
        orderBy: orderBy,
        reverseOrder: reverseOrder,
        is_submit: true
      }
    }
    case INVOICE_DOWNLOAD_FILE: {
      return {
        ...state,
        options: action.payload.options
      }
    }
    case INVOICE_SORT_ROWS:{
      let rows = state.rows
      let reverseOrder = state.reverseOrder
      let orderBy = state.orderBy
      if(orderBy === action.payload.orderBy){
        reverseOrder = !reverseOrder
      }else{
        orderBy = action.payload.orderBy
        reverseOrder = false
      }
      rows.sort((a,b) => {
        if (b[orderBy] < a[orderBy]) {
          return reverseOrder?-1:1;
        }
        if (b[orderBy] > a[orderBy]) {
          return reverseOrder?1:-1;
        }
        return 0;
      })
      return {
        ...state,
        rows: rows,
        orderBy: orderBy,
        reverseOrder: reverseOrder,
      }
    }
    case INVOICE_SET_TABLE_PAGE: {
      return {
        ...state,
        page: action.payload.page
      }
    }
    case INVOICE_SEARCH_FILTER: {
      return {
        ...state,
        campaignfilterOptions: action.payload.filter_type === "campaign"?action.payload.options:[],
        lineitemfilterOptions: action.payload.filter_type === "lineitem"?action.payload.options:[],
      }
    }
    default:
      return {
        ...state
      };
  }
}