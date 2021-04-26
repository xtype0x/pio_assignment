import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Redirect, Route } from "react-router";

import {check_user} from "../../actions/auth";

const AuthRoute = (props) => {
  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth);

  useEffect(() => {
    if(!auth.is_loaded)
      dispatch(check_user())
  },[auth.is_loaded,dispatch])
  if(!auth.is_loaded){
    return <div />
  }
  if (auth.is_loaded && !auth.user){
    return <Redirect to="/" />;
  }

  return <Route {...props} />;
};

export default AuthRoute;
