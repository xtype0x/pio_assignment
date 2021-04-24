import {AUTH_LOGIN,AUTH_LOGOUT,AUTH_CHECK_USER} from "../actions/auth"

const initialState = {
  is_loaded: false,
  is_new: false,
  user: null
}

export default function authReducer(state = initialState, action ) {
  switch(action.type) {
    case AUTH_LOGIN:
      return {
        ...state,
        is_loaded: true,
        user: action.payload.user
      }
    case AUTH_CHECK_USER:
      return {
        ...state,
        is_loaded: true,
        user: action.payload.user?action.payload.user:null
      }
    case AUTH_LOGOUT:
      if(action.payload.message !== "logout"){
        return state
      }
      return {
        ...state,
        user: null
      }
    default: 
      return {
        ...state,
        is_new: false
      };
  }
}