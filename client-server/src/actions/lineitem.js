import agent from "./agent";

export const LINEITEM_GET_ROWS = 'LINEITEM_GET_ROWS'

export const get_rows = (options) => async (dispatch) => {
  const query = `?page=${options.page||1}&is_archived=${options.is_archived?1:0}`
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