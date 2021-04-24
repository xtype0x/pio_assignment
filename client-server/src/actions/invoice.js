import agent from "./agent";

export const INVOICE_GET_ROWS = 'INVOICE_GET_ROWS'
export const INVOICE_SORT_ROWS = 'INVOICE_SORT_ROWS'
export const INVOICE_SET_TABLE_PAGE = 'INVOICE_SET_TABLE_PAGE'
export const INVOICE_SEARCH_FILTER = 'INVOICE_SEARCH_FILTER'

export const get_rows = (options) => async (dispatch) => {
  const {data} = await agent.post("http://localhost:4000/invoice",options);

  dispatch({
    type: INVOICE_GET_ROWS,
    payload: {
      rows: data.data,
      page: options.page,
      max_page: data.total_page,
      grand_total: data.grand_total,
      options: options
    },
  });
};

export const sort_rows = (column) => async (dispatch) => {
  dispatch({
    type: INVOICE_SORT_ROWS,
    payload: {
      orderBy: column
    },
  });
}

export const set_table_page = (page) => async (dispatch) => {
  dispatch({
    type: INVOICE_SET_TABLE_PAGE,
    payload: {
      page: page
    }
  })
}

export const search_filter = (filter_type,q) => async (dispatch) => {
  let url = "";
  if(filter_type === "lineitem"){
    url = "http://localhost:4000/lineitem/search?q="+q;
  }else if(filter_type === "campaign"){
    url = "http://localhost:4000/campaign/search?q="+q;
  }
  const {data} = await agent.get(url);
  dispatch({
    type: INVOICE_SEARCH_FILTER,
    payload: {
      options: data,
      filter_type: filter_type
    }
  })
}
