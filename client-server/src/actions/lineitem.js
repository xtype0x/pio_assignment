import agent from "./agent";

export const LINEITEM_GET_ROWS = 'LINEITEM_GET_ROWS'
export const LINEITEM_SORT_ROWS = 'LINEITEM_SORT_ROWS'
export const LINEITEM_REVIEW = 'LINEITEM_REVIEW'
export const LINEITEM_ARCHIVE = 'LINEITEM_ARCHIVE'
export const LINEITEM_EDIT_ADJUSTMENTS = 'LINEITEM_EDIT_ADJUSTMENTS'
export const LINEITEM_GET_COMMENTS = 'LINEITEM_GET_COMMENTS'
export const LINEITEM_CREATE_COMMENT = 'LINEITEM_CREATE_COMMENT'
export const LINEITEM_CLEAR_MESSAGE = 'LINEITEM_CLEAR_MESSAGE'

export const get_rows = (options) => async (dispatch) => {
  const query = `?page=${options.page||1}&is_archived=${options.is_archived?1:0}&orderBy=${options.orderBy}&reverseOrder=${options.reverseOrder?"1":"0"}`
  const {data} = await agent.get("http://localhost:4000/lineitem"+query);

  dispatch({
    type: LINEITEM_GET_ROWS,
    payload: {
      rows: data.data,
      page: options.page,
      max_page: data.total_page
    },
  });
};

export const sort_rows = (column) => async (dispatch) => {
  dispatch({
    type: LINEITEM_SORT_ROWS,
    payload: {
      orderBy: column
    },
  });
}

export const review = (lid) => async (dispatch) => {
  const {data,err} = await agent.put("http://localhost:4000/lineitem/"+lid,{is_reviewed: true});

  dispatch({
    type: LINEITEM_REVIEW,
    payload: {
      lid: lid,
      lineitem: data.lineitem,
      error: err
    },
  });
}

export const archive = (lid) => async (dispatch) => {
  const {data,err} = await agent.put("http://localhost:4000/lineitem/"+lid,{is_archived: true});

  dispatch({
    type: LINEITEM_ARCHIVE,
    payload: {
      lid: lid,
      lineitem: data.lineitem,
      error: err
    },
  });
}

export const update_adjustments = (lid, adjustments) => async (dispatch) => {
  const {data,err} = await agent.put("http://localhost:4000/lineitem/"+lid,{adjustments: adjustments});

  dispatch({
    type: LINEITEM_EDIT_ADJUSTMENTS,
    payload: {
      lid: lid,
      lineitem: data.lineitem,
      error: err
    },
  });
}

export const get_comments = (lid) => async (dispatch) => {
  const {data} = await agent.get("http://localhost:4000/lineitem/"+lid+"/comment");

  dispatch({
    type: LINEITEM_GET_COMMENTS,
    payload: {
      comments: data
    }
  })
}

export const create_comment = (lid,content) => async (dispatch) => {
  const {data,err} = await agent.post("http://localhost:4000/lineitem/"+lid+"/comment",{content: content});

  dispatch({
    type: LINEITEM_CREATE_COMMENT,
    payload: {
      comment: data.comment,
      error: err
    }
  })
}

export const clear_message = () => async (dispatch) => {
  dispatch({
    type: LINEITEM_CLEAR_MESSAGE,
    payload: {
      
    },
  });
}