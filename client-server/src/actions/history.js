import agent from "./agent";

export const HISTORY_GET_ROWS = "HISTORY_GET_ROWS"

export const get_rows = (options) => async (dispatch) => {
  const query = `?page=${options.page||1}`
  const {data} = await agent.get("http://localhost:4000/history"+query);

  dispatch({
    type: HISTORY_GET_ROWS,
    payload: {
      rows: data.data,
      page: options.page,
      max_page: data.total_page
    }
  })
}
