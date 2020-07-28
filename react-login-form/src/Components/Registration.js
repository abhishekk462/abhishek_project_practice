import React, { Component } from "react";
import Home from "./Home";
import history from "./../history";

export default class Registartion extends Component {
  constructor(props) {
    super(props);
    this.state = {
      newdata1: {},
      fields: {},
      errors: {},
    };
  }
  // React Life Cycle

  handleChange = (e) => {
    let fields = this.state.fields;
    fields[e.target.name] = e.target.value;
    this.setState({
      fields,
    });
  };

  submituserRegistrationForm = (e) => {
    e.preventDefault();
    if (this.validateForm()) {
      let fields = {};
      fields["fullname"] = "";
      fields["emailid"] = "";
      fields["mobileno"] = "";
      fields["username"] = "";
      fields["password"] = "";

      this.setState({ fields: fields });
      this.props.history.push("/login");
      localStorage.setItem("document", JSON.stringify(this.state.fields));
    }
  };
  componentDidMount() {
    const userData = JSON.parse(localStorage.getItem("document"));
    this.setState({ newdata1: userData });

    if (localStorage.getItem("document")) {
      this.setState({
        fullname: userData.fullname,
        emailid: userData.emailid,
        mobileno: userData.mobileno,
        username: userData.username,
        password: userData.password,
      });
    } else {
      this.setState({
        fullname: "",
        emailid: "",
        mobileno: "",
        username: "",
        password: "",
      });
    }
  }
  validateForm() {
    let fields = this.state.fields;
    let errors = {};
    let formIsValid = true;

    if (!fields["fullname"]) {
      formIsValid = false;
      errors["fullname"] = "*Please enter your name.";
    }

    if (typeof fields["username"] !== "undefined") {
      if (!fields["username"].match(/^[a-zA-Z ]*$/)) {
        formIsValid = false;
        errors["username"] = "*Please enter alphabet characters only.";
      }
    }

    if (!fields["emailid"]) {
      formIsValid = false;
      errors["emailid"] = "*Please enter your email-ID.";
    }

    if (typeof fields["emailid"] !== "undefined") {
      //regular expression for email validation
      var pattern = new RegExp(
        /^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i
      );
      if (!pattern.test(fields["emailid"])) {
        formIsValid = false;
        errors["emailid"] = "*Please enter valid email-ID.";
      }
    }

    if (!fields["mobileno"]) {
      formIsValid = false;
      errors["mobileno"] = "*Please enter your mobile no.";
    }

    if (typeof fields["mobileno"] !== "undefined") {
      if (!fields["mobileno"].match(/^[0-9]{10}$/)) {
        formIsValid = false;
        errors["mobileno"] = "*Please enter valid mobile no.";
      }
    }

    if (!fields["username"]) {
      formIsValid = false;
      errors["username"] = "*Please enter your username.";
    }
    if (!fields["password"]) {
      formIsValid = false;
      errors["password"] = "*Please enter your password.";
    }

    if (typeof fields["password"] !== "undefined") {
      if (
        !fields["password"].match(
          /^.*(?=.{8,})(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%&]).*$/
        )
      ) {
        formIsValid = false;
        errors["password"] =
          "*Please enter strong password must be follow as upper,lower and special character.";
      }
    }

    this.setState({
      errors: errors,
    });
    return formIsValid;
  }

  render() {
    let newdata1 = this.state.newdata1;
    console.log("55555555", newdata1);
    return (
      <div className="main-registration-container">
        <div className="register">
          <h3>Registration page</h3>
          <form
            method="post"
            name="userRegistrationForm"
            onSubmit={this.submituserRegistrationForm}
          >
            <label>Name</label>
            <input
              type="text"
              name="fullname"
              placeholder="abhishek"
              value={this.state.fields.fullname}
              onChange={this.handleChange}
            />
            <div className="errorMsg">{this.state.errors.fullname}</div>
            <label>Email ID:</label>
            <input
              type="text"
              name="emailid"
              placeholder="abhi@gmail.com"
              value={this.state.fields.emailid}
              onChange={this.handleChange}
            />
            <div className="errorMsg">{this.state.errors.emailid}</div>
            <label>Mobile No:</label>
            <input
              type="text"
              name="mobileno"
              placeholder="8210459547"
              value={this.state.fields.mobileno}
              onChange={this.handleChange}
            />
            <label>User Name:</label>
            <input
              type="text"
              name="username"
              placeholder="abhi"
              value={this.state.fields.username}
              onChange={this.handleChange}
            />
            <div className="errorMsg">{this.state.errors.username}</div>
            <label>Password</label>
            <input
              type="password"
              name="password"
              placeholder="Abhi@#123"
              value={this.state.fields.password}
              onChange={this.handleChange}
            />
            <div className="errorMsg">{this.state.errors.password}</div>
            <input type="submit" className="button" value="Register" />
          </form>
        </div>
      </div>
    );
  }
}
