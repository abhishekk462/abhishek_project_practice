// @flow
import React, { Component } from 'react';
import Papa from 'papaparse';
import Encoding from 'encoding-japanese';


export default class FileInput extends Component {
    constructor(props) {
      super(props);
      this.handleSubmit = this.handleSubmit.bind(this);
      this.fileInput = React.createRef();
    }


    handleReflect(results) {
       console.log(results);
       this.props.onComplete(results);
      }

 
    handleSubmit(event) {
      event.preventDefault();
      const reader = new FileReader();
      reader.onload = (e) => {
        const codes = new Uint8Array(e.target.result);
        const encoding = Encoding.detect(codes);
        const unicodeString = Encoding.convert(codes, {
          to: 'unicode',
          from: encoding,
          type: 'string',
        });
        Papa.parse(unicodeString, {
          header: false,
          dynamicTyping: true,
          skipEmptyLines: true,
          complete: (results) => {
            this.handleReflect(results);
          },
        });
      };
      reader.readAsArrayBuffer(this.fileInput.current.files[0]);
    }
  
    render() {
      return (
        <form onSubmit={this.handleSubmit}>
          <label>
            Upload file:
            <input type="file" ref={this.fileInput} />
          </label>
          <br />
          <button type="submit">Submit</button>
        </form>
      );
    }
  }