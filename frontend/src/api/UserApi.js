import axios from "axios";
import config from "../config.json";

class UserApi {
  static getUsers = async (deleteFlag) => {
    try {
      const response = await axios.get(
        `${config.Backend_URL}user/all/${deleteFlag}`
      );
      return response;
    } catch (error) {
      return error;
    }
  };

  static getUserDetailsById = async (userId) => {
    try {
      const response = await axios.get(`${config.Backend_URL}user/${userId}`);
      return response;
    } catch (error) {
      return error;
    }
  };

  static addUser = async (userDetails) => {
    try {
      const response = await axios.post(
        `${config.Backend_URL}user/add`,
        userDetails
      );
      return response;
    } catch (error) {
      return error;
    }
  };

  static updateUser = async (userDetails) => {
    try {
      const response = await axios.post(
        `${config.Backend_URL}user/update`,
        userDetails
      );
      return response;
    } catch (error) {
      return error;
    }
  };

  static updateUserStatus = async (userId, status) => {
    try {
      const req =
        status === "A"
          ? axios.delete(`${config.Backend_URL}user/remove/${userId}`)
          : axios.post(`${config.Backend_URL}user/activate/${userId}`);
      const response = await req;
      return response;
    } catch (error) {
      return error;
    }
  };
}
export default UserApi;
