import * as types from "../actions/actionTypes";

export default function userReducer(state = {}, action) {
  const newState = { ...state };
  switch (action.type) {
    case types.LOAD_ALL_USERS_SUCCESS:
      newState.users = action.users;
      return newState;
    case types.LOAD_USER_DETAILS_BY_ID_SUCCESS:
      newState.userDetailsById = action.userDetailsById;
      return newState;
    default:
      return state;
  }
}
