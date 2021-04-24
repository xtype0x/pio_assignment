import agent from "./agent";

export const AUTH_LOGIN = 'AUTH_LOGIN';
export const AUTH_LOGOUT = 'AUTH_LOGOUT';
export const AUTH_CHECK_USER = 'AUTH_CKECH_USER';

export const login = (name) => async (dispatch) => {
  const {data} = await agent.post("http://localhost:4000/login",{name: name});

  dispatch({
    type: AUTH_LOGIN,
    payload: {user: data.user, is_new: data.is_new},
  });
};

export const check_user = () => async (dispatch) => {
  const {data} = await agent.get("http://localhost:4000/user/status");

  dispatch({
    type: AUTH_CHECK_USER,
    payload: data,
  });
}

export const logout = () => async (dispatch) => {
  const {data} = await agent.get("http://localhost:4000/logout");

  dispatch({
    type: AUTH_LOGOUT,
    payload: data
  });
}