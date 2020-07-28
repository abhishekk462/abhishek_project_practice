// @flow
import React, { Component } from 'react';

export default class ExcelDownload extends Component {
    constructor(props) {
      super(props);
      this.handleSubmit = this.handleSubmit.bind(this);
    }
 
    handleSubmit(event) {
      event.preventDefault();
      this.props.onClick();
    }
  
    render() {
      return (
        <form onSubmit={this.handleSubmit}>
          <button type="submit">Download Excel</button>
        </form>
      );
    }
  }