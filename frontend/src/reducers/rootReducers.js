import { connectRouter } from "connected-react-router";
import { createBrowserHistory as createHistory } from "history";
import { combineReducers } from "redux";

import userReducer from "./userReducer";

const history = createHistory();

const rootReducer = combineReducers({
  userReducer,
  router: connectRouter(history),
});
export default rootReducer;
