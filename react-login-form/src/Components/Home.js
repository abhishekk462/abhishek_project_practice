import React from "react";
import history from "./../history";

export default class Home extends React.Component {
  state = {
    rows: [{}],
  };
  handleChange = (idx) => (e) => {
    const { name, value } = e.target;
    const rows = [...this.state.rows];
    rows[idx] = {
      [name]: value,
    };
    this.setState({
      rows,
    });
  };
  handleAddRow = () => {
    const item = {
      name: "",
      mobile: "",
    };
    this.setState({
      rows: [...this.state.rows, item],
    });
  };
  handleRemoveRow = () => {
    this.setState({
      rows: this.state.rows.slice(0, -1),
    });
  };
  handleRemoveSpecificRow = (idx) => () => {
    const rows = [...this.state.rows];
    rows.splice(idx, 1);
    this.setState({ rows });
  };
  render() {
    const userData = JSON.parse(localStorage.getItem("document"));
    return (
        <>
      <table className="table table-striped">
        <thead>
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>Email ID</th>
            <th>Mobile No</th>
            <th>User Name</th>
            <th>Password</th>
            <th>Add</th>
            <th>Delete</th>
          </tr>
        </thead>

        <tbody>
          {this.state.rows.map((item, idx) => (
            <tr id="addr0" key={idx}>
              <td>{idx}</td>

              <td
                value={this.state.rows[idx]}
                onChange={this.handleChange(idx)}
              >
                {userData.fullname}
              </td>
              <td
                value={this.state.rows[idx]}
                onChange={this.handleChange(idx)}
              >
                {userData.emailid}
              </td>
              <td
                value={this.state.rows[idx]}
                onChange={this.handleChange(idx)}
              >
                {userData.mobileno}
              </td>
              <td
                value={this.state.rows[idx]}
                onChange={this.handleChange(idx)}
              >
                {userData.username}
              </td>
              <td
                value={this.state.rows[idx]}
                onChange={this.handleChange(idx)}
              >
                {userData.password}
              </td>
              <td>
                <button
                  onClick={this.handleAddRow}
                  className="btn btn-primary btn-block"
                >
                  Add
                </button>
              </td>
              <td>
                <button
                  onClick={this.handleRemoveSpecificRow(idx)}
                  className="btn btn-primary btn-block"
                >
                  Delete
                </button>
               
              </td>
            </tr>
          ))}
        </tbody>
       
      </table>
      <button className="btn btn-primary btn-block" onClick={() =>this.props.history.push('/login')}>
      Back to Login
    </button>
     </>
    );
  }
}
