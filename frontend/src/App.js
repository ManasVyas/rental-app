import React from "react";
import { Route, Switch, NavLink } from "react-router-dom";
import "./App.css";

import User from "./components/User.js";

function App() {
  return (
    <div className="App">
      <nav>
        <ul>
          <li>
            <NavLink to="/user">User</NavLink>
          </li>
        </ul>
      </nav>
      <Switch>
        <Route exact path="/user" component={User} />
      </Switch>
    </div>
  );
}

export default App;
