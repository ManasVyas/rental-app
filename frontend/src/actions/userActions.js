import * as types from "./actionTypes";
import UserApi from "../api/UserApi";

export const loadUsersSuccess = (users) => {
  return {
    type: types.LOAD_ALL_USERS_SUCCESS,
    users,
  };
};
export const loadUserDetailsByIdSuccess = (userDetailsById) => {
  return {
    type: types.LOAD_USER_DETAILS_BY_ID_SUCCESS,
    userDetailsById,
  };
};
export const addUserSuccess = () => {
  return {
    type: types.ADD_USER_SUCCESS,
  };
};
export const updateUserSuccess = () => {
  return {
    type: types.UPDATE_USER_SUCCESS,
  };
};
export const updateUserStatusSuccess = () => {
  return {
    type: types.UPDATE_USER_STATUS_SUCCESS,
  };
};

export const loadUsers = (deleteFlag = 1) => {
  return async (dispatch) => {
    try {
      const users = await UserApi.getUsers(deleteFlag);
      dispatch(loadUsersSuccess(users));
      return users;
    } catch (error) {
      return error;
    }
  };
};
export const loadUserDetailsById = (userId) => {
  return async (dispatch) => {
    try {
      const userDetailsById = await UserApi.getUserDetailsById(userId);
      dispatch(loadUserDetailsByIdSuccess(userDetailsById));
      return userDetailsById;
    } catch (error) {
      return error;
    }
  };
};
export const addUser = (userDetails) => {
  return async (dispatch) => {
    try {
      const user = await UserApi.addUser(userDetails);
      dispatch(addUserSuccess());
      return user;
    } catch (error) {
      return error;
    }
  };
};
export const updateUser = (userDetails) => {
  return async (dispatch) => {
    try {
      const user = await UserApi.updateUser(userDetails);
      dispatch(updateUserSuccess());
      return user;
    } catch (error) {
      return error;
    }
  };
};
export const updateUserStatus = (userId, status) => {
  return async (dispatch) => {
    try {
      const user = await UserApi.updateUserStatus(userId, status);
      dispatch(updateUserStatusSuccess());
      return user;
    } catch (error) {
      return error;
    }
  };
};
