import React from "react";

import Registartion from "./Components/Registration";
import Login from "./Components/Login";
import Home from "./Components/Home";
import history from "./history";

import "./App.css";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";

function Routes() {
  return (
    <Router history={history}>
      <div className="App">
        <nav className="navbar navbar-expand-lg navbar-light fixed-top">
          <div className="container">
            <Link className="navbar-brand" to={"/"}>
              Skotian
            </Link>
            <div className="collapse navbar-collapse" id="navbarTogglerDemo02">
              <ul className="navbar-nav ml-auto">
                <li className="nav-item">
                  <Link className="nav-link" to={"/login"}>
                    Login
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to={"/registartion"}>
                    Registartion
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to={"/home"}>
                    Home
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </nav>

        <div className="auth-wrapper">
          <div className="auth-inner">
            <Switch>
              <Route path="/login" component={Login} />
              <Route path="/registartion" component={Registartion} />
              <Route path="/home" component={Home} />
            </Switch>
          </div>
        </div>
      </div>
    </Router>
  );
}

export default Routes;
