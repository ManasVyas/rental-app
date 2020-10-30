import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { bindActionCreators } from "redux";
import {
  loadUsers,
  loadUserDetailsById,
  addUser,
  updateUser,
  updateUserStatus,
} from "../actions/userActions";

class User extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userList: [],
      user: {
        userId: null,
        userName: "",
        createdBy: 1,
        updatedBy: 1,
        deleteFlag: "A",
      },
      mode: "add",
    };
  }

  loadUsers = () => {
    this.props.loadUsers().then((response) => {
      if (response && response.data && response.data.data) {
        const userList = response.data.data;
        this.setState({ userList });
      }
    });
  };

  loadUserById = () => {
    const { user } = this.state;
    this.props.loadUserDetailsById(user.useId).then((response) => {
      if (response && response.data && response.data.data) {
        const user = response.data.data;
        this.setState({ user });
      }
    });
  };

  onSave = () => {
    const { user, mode } = this.state;
    let userPromise;
    if (mode === "add") {
      delete user.userId;
      userPromise = this.props.addUser(user);
    } else if (mode === "edit") userPromise = this.props.updateUser(user);
    userPromise.then(() => {
      this.loadUsers();
      this.onReset();
      this.setState({ mode: "add" });
    });
  };

  onEdit = (id) => {
    const { user } = this.state;
    user.userId = id;
    this.setState({ user, mode: "edit" }, this.loadUserById);
  };

  userStatusChange = (id, status) => {
    this.props.updateUserStatus(id, status).then((response) => {
      console.log("id, status", id, status);
      if (response && response.status === 200) {
        this.loadUsers();
      } else {
        // Error
      }
    });
  };

  onReset = () => {
    const { user } = this.state;
    user.userName = "";
    this.setState({ user });
  };

  onChange = (e) => {
    const { name, value } = e.target;
    const { user } = this.state;
    user[name] = value;
    this.setState({ user });
  };

  componentDidMount() {
    this.loadUsers();
  }

  render() {
    const { user, userList } = this.state;
    return (
      <div>
        <table>
          <thead>
            <tr>
              <th>User Id</th>
              <th>User name</th>
            </tr>
          </thead>
          <tbody>
            {userList.length === 0 ? (
              <tr>
                <td>No user found!</td>
              </tr>
            ) : (
              userList.map((user, index) => {
                return (
                  <tr key={index}>
                    <td>{user.userId}</td>
                    <td>{user.userName}</td>
                    <td>
                      <button onClick={() => this.onEdit(user.userId)}>
                        Edit
                      </button>
                    </td>
                    <td>
                      {user.deleteFlag === "A" ? (
                        <button
                          onClick={() =>
                            this.userStatusChange(user.userId, user.deleteFlag)
                          }
                        >
                          Delete
                        </button>
                      ) : (
                        <button
                          onClick={() =>
                            this.userStatusChange(user.userId, user.deleteFlag)
                          }
                        >
                          Restore
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
        <input value={user.userName} onChange={this.onChange} name="userName" />
        <button onClick={this.onSave}>Save</button>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    users: state.userReducer.users,
  };
};

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators(
    {
      loadUsers,
      loadUserDetailsById,
      addUser,
      updateUser,
      updateUserStatus,
    },
    dispatch
  );
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(User));
