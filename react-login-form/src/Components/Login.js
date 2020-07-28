import React, { Component } from "react";

export default class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fields: {},
      errors: {},
      userData: {},
      username: "",
      password: "",
    };
  }
  handleChange = (e) => {
    let fields = this.state.fields;
    console.log("fields1111111", fields.username);
    fields[e.target.name] = e.target.value;
    this.setState({
      fields,
    });
  };

  submituserLoginForm = (e) => {
    e.preventDefault();
    if (this.validateLoginForm()) {
      let fields = {};
      fields["username"] = "";
      fields["password"] = "";
      this.setState({
        fields: fields,
      });
      this.props.history.push("/home");
    }
  };

  loginForm(username, password) {
    let usernamestore = this.state.fields;
    let passwordstore = this.state.fields;
    console.log("username0000", usernamestore);
    console.log("password", passwordstore);
    let errors = {};
    let userdetails = JSON.parse(localStorage.getItem("document"));
    console.log("userdetails-username", userdetails.username);
    console.log("password-details", userdetails.password);
    console.log("usernamestore", usernamestore);
    console.log("passwordstore", passwordstore);
    if (
      usernamestore == userdetails.username &&
      passwordstore == userdetails.password
    )
      console.log("successfully login");
    else console.log("please enter valid credential");
  }

  validateLoginForm() {
    let fields = this.state.fields;
    let errors = {};
    let formIsValid = true;

    if (!fields["username"]) {
      formIsValid = false;
      errors["username"] = "Please enter your username.";
    }

    if (typeof fields["username"] !== "undefined") {
      if (!fields["username"].match(/^[a-zA-Z ]*$/)) {
        formIsValid = false;
        errors["username"] = "Please enter alphabet characters only.";
      }
    }

    if (!fields["password"]) {
      formIsValid = false;
      errors["password"] = "Please enter your password.";
    }

    if (typeof fields["password"] !== "undefined") {
      if (
        !fields["password"].match(
          /^.*(?=.{8,})(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%&]).*$/
        )
      ) {
        formIsValid = false;
        errors["password"] = "Password incorrect please check once";
      }
    }

    this.setState({
      errors: errors,
    });
    return formIsValid;
  }
  render() {
    return (
      <form
        method="post"
        name="userLoginForm"
        onSubmit={this.submituserLoginForm}
      >
        <h3>Login</h3>

        <div className="form-group">
          <label>User Name</label>
          <input
            type="username"
            name="username"
            className="form-control"
            placeholder="Abhishek"
            onChange={this.handleChange}
          />
          <div className="errorMsg">{this.state.errors.username}</div>
        </div>

        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            name="password"
            className="form-control"
            placeholder="Abhi@#123"
            onChange={this.handleChange}
          />
          <div className="errorMsg">{this.state.errors.password}</div>
        </div>

        <div className="form-group">
          <div className="custom-control custom-checkbox">
            <input
              type="checkbox"
              className="custom-control-input"
              id="customCheck1"
            />
            <label className="custom-control-label" htmlFor="customCheck1">
              Remember me
            </label>
          </div>
        </div>

        <button type="submit" className="btn btn-primary btn-block">
          Submit
        </button>
        <p className="forgot-password text-right">
          Forgot <a href="/">password?</a>
        </p>
      </form>
    );
  }
}
