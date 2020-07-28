// @flow 
import React, { Component } from "react";
import { Link } from "react-router-dom";
//import ReactTable from "react-table";
//import Excel from 'exceljs';
//import path from 'path';
import routes from "../../constants/routes";
import styles from "./tablelist.css";
//import FileInput from "../FileInput";
//import TitleBar from "../TitleBar";
//import "react-table/react-table.css";
//import ExcelDownload from '../ExcelDownload';
import {
  Button,
  Form,
  Grid,
  Header,
  Message,
  Segment,
} from 'semantic-ui-react';
// type Props = {};

export default class List extends Component {
  // props: Props;
  constructor(props) {
    super(props);
    this.state = { data: [], columns: [] };
    this.workbook= new Excel.Workbook();
    const templatePath = path.join(__dirname , '../','Template_File/shimamura_1.xlsx');
    console.log(templatePath); 
    this.workbook.xlsx.readFile( templatePath);
  }

  parseCompleteHandle = results => {
    console.log(results);
    this.setState({
      data: this.getRows(results.data),
      columns: this.getColumns(results.data)
    });
  };

  getColumns(data) {
    let datacol = data[0];
    let dataColArr = [];
    datacol.forEach(col => {
      dataColArr.push({
        Header: col,
        accessor: col
      });
    });
    return dataColArr;
  }

  getRows(data) {
    let datacols = data[0];
    let datarows = data;
    let dataRowArr = [];
    datarows.forEach((row, idx) => {
      if (idx > 0) {
        var result = row.reduce(function(result, field, index) {
          result[datacols[index]] = field;
          return result;
        }, {});
        dataRowArr.push(result);
      }
    });
    return dataRowArr;
  }

  downloadExcel = ()=>{
    try {
      let savePath = path.join(__dirname , '../','Template_File/test.xlsx');
      console.log(savePath); 
      this.workbook.xlsx.writeFile(savePath).then(()=>{
        console.log('done!');
      });
    } catch (error) {
      console.log(error);
    }
  
  }
  
  render() {
    return (
      <div className={styles.container} data-tid="container">
        <TitleBar />
        <h2>PDP</h2>
        
        <Button color="blue" fluid size="large">asdfdsf</Button>
        <FileInput
          onInputChange={this.onInputChange}
          onComplete={this.parseCompleteHandle}
        />
        <ExcelDownload onClick={this.downloadExcel } />
        <ReactTable
          data={this.state.data}
          columns={this.state.columns}
          defaultPageSize={10}
          className="-striped -highlight"
        />
      </div>
    );
  }
}
