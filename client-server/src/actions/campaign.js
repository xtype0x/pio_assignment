import agent from "./agent";

export const CAMPAIGN_GET_ROWS = 'CAMPAIGN_GET_ROWS'
export const CAMPAIGN_REVIEW = 'CAMPAIGN_REVIEW'
export const CAMPAIGN_SORT_ROWS = 'CAMPAIGN_SORT_ROWS'
export const CAMPAIGN_CLEAR_MESSAGE = 'CAMPAIGN_CLEAR_MESSAGE'

export const get_rows = (options) => async (dispatch) => {
  const query = `?page=${options.page||1}&orderBy=${options.orderBy}&reverseOrder=${options.reverseOrder?"1":"0"}`
  const {data} = await agent.get("http://localhost:4000/campaign"+query);

  dispatch({
    type: CAMPAIGN_GET_ROWS,
    payload: {
      rows: data.data,
      page: options.page,
      max_page: data.total_page
    },
  });
};

export const sort_rows = (column) => async (dispatch) => {
  dispatch({
    type: CAMPAIGN_SORT_ROWS,
    payload: {
      orderBy: column
    },
  });
}

export const review = (cid) => async (dispatch) => {
  const {data,err} = await agent.put("http://localhost:4000/campaign/"+cid,{is_reviewed: true});

  dispatch({
    type: CAMPAIGN_REVIEW,
    payload: {
      cid: cid,
      campaign: data.campaign,
      error: err
    },
  });
}

export const clear_message = () => async (dispatch) => {
  dispatch({
    type: CAMPAIGN_CLEAR_MESSAGE,
    payload: {
      
    },
  });
}
