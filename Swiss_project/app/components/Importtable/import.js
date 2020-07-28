// @flow
import React, { Component } from "react";
const { app,dialog } = require('electron').remote;
import { Link } from "react-router-dom";
import zipdir from 'zip-dir';
import path from 'path';
import fs from 'fs';
import Excel from 'exceljs';
import _ from 'lodash';
import Papa from 'papaparse';
import Zip from 'jszip';
import routes from "../../constants/routes";
import styles from "./import.css";
import FileInput from "../FileInput";
import TitleBar from "../TitleBar";
import FooterBar from "../FooterBar";
import pdpUploadIcon from './upload_icon.png';
import bckbtn from './back_icon24.png';
import Encoding from 'encoding-japanese';
import Dropzone from 'react-dropzone'
import Modal from '../AlertModal/Modal.js';
import DwnModal from '../AlertModal/DwnModal.js';
import importconfig from "../../constants/importconfig";
import areaList from "../../constants/areaList";

import {
  Button,
  Form,
  Grid,
  Header,
  Dropdown,
  Image,
  Message,
  TextArea,
  Segment,
  Dimmer,
  Loader,
} from 'semantic-ui-react';
import { callbackify } from "util";

// UI data
const Shimamura_data = importconfig.Column.Shimamura.map(e => JSON.stringify(e).replace(/{|}/g, '')).join('\n')
const NipponExpress_data = importconfig.Column.NipponExpress.map(e => JSON.stringify(e).replace(/{|}/g, '')).join('\n')
const shopArea_data = importconfig.ShopArea.MainArea.map(e => JSON.stringify(e).replace(/{|}/g, '')).join('\n')
const StoreArea_data = importconfig.ShopArea.SubArea.Shimamura.map(e => JSON.stringify(e).replace(/{|}/g, '')).join('\n')

const Main_ShopArea = importconfig.ShopArea.MainArea.map(e => JSON.stringify(e).replace(/{|}/g, '')).join('\n')
const Shimamura_Sub_ShopArea = importconfig.ShopArea.SubArea.Shimamura.map(e => JSON.stringify(e).replace(/{|}/g, '')).join('\n')
const Avail_Sub_ShopArea = importconfig.ShopArea.SubArea.Avail.map(e => JSON.stringify(e).replace(/{|}/g, '')).join('\n')
const Birthday_Sub_ShopArea = importconfig.ShopArea.SubArea.Birthday.map(e => JSON.stringify(e).replace(/{|}/g, '')).join('\n')
const Chamber_Sub_ShopArea = importconfig.ShopArea.SubArea.Chamber.map(e => JSON.stringify(e).replace(/{|}/g, '')).join('\n')
const Divalo_Sub_ShopArea = importconfig.ShopArea.SubArea.Divalo.map(e => JSON.stringify(e).replace(/{|}/g, '')).join('\n')

// File Data
// const templatePath = path.join(__dirname , '../','Template_File/');
// const outputFilePath = path.join(__dirname, '../', `Output_File/`);
const templatePath = path.join('./','Template_File/');
const outputFilePath = path.join('./', `Output_File/`);
const savePath_CheckList = path.join(outputFilePath, `checklist/`);
const savePathHeader_wo = savePath_CheckList;
const savePathHeader_pl = savePath_CheckList;
const savePath_ForSWISS = path.join(outputFilePath, `forSWISS/`);
const savePathHeader_swiss_assort = path.join(savePath_ForSWISS, `assort_ptn_`);
const savePath_swiss_solid_mix = path.join(savePath_ForSWISS, `solid.xlsx`);
const savePath_Zip_Default = path.resolve(app.getPath("desktop"), "Shimamura.zip");

// Test Store
const testStore = areaList.TestStore;

// Error Text
const errorDisplayText = "An unexpected error occurred."

export default class Import extends Component {
  constructor(props) {
    super(props)

    // User Setting Data
    this.state = {
      files: [],
      showUploadLable:true,
      showFiles:true,
      rawdata:null,
      convertedData:null,
      value:"shimamamura",
      NipponExpress_data:Shimamura_data,
      shopArea_data:shopArea_data,



      UI_OutputType:importconfig.OutputType[0].value,
      UI_OutputFormat:importconfig.OutputFormat[0].value,
      UI_ShopArea:Main_ShopArea,
      UI_TranferType:importconfig.TransferType[0].value,
      UI_CurrentDate: new Date().toISOString().substring(0, 10),
      showLoader: false,
      loaderMessage: 'Reading CSV...',
      error_flg: false
    }

    this.outputType = this.outputType.bind(this);
    this.outputFormat = this.outputFormat.bind(this);
    this.tranferType = this.tranferType.bind(this);
  }

handleChange = (date) => {
  console.log("UI_CurrentDate", date.target.value)
  this.state.UI_CurrentDate = date.target.value;
  this.setState({
    UI_CurrentDate: date.target.value
  });
}
outputType = (e)=> {
  this.state.UI_OutputType = e.target.value;
  this.setState({UI_OutputType: e.target.value});
  this.setState_UI_ShopArea();
}
outputFormat = (e) => {
  this.state.UI_OutputFormat = e.target.value;
  this.setState({UI_OutputFormat: e.target.value});
  this.setState_UI_ShopArea();
}
setState_UI_ShopArea = () => {
  if (this.state.UI_OutputFormat === importconfig.OutputFormat[0].value)
  {
    this.state.UI_ShopArea = Main_ShopArea;
    this.setState({UI_ShopArea: Main_ShopArea});
  }
  else if (this.state.UI_OutputFormat === importconfig.OutputFormat[1].value)
  {
    if (this.state.UI_OutputType === importconfig.OutputType[0].value)
    {
      this.state.UI_ShopArea = Shimamura_Sub_ShopArea;
      this.setState({UI_ShopArea: Shimamura_Sub_ShopArea});
    }
    else if (this.state.UI_OutputType === importconfig.OutputType[1].value)
    {
      this.state.UI_ShopArea = Avail_Sub_ShopArea;
      this.setState({UI_ShopArea: Avail_Sub_ShopArea});
    }
    else if (this.state.UI_OutputType === importconfig.OutputType[2].value)
    {
      this.state.UI_ShopArea = Birthday_Sub_ShopArea;
      this.setState({UI_ShopArea: Birthday_Sub_ShopArea});
    }
    else if (this.state.UI_OutputType === importconfig.OutputType[3].value)
    {
      this.state.UI_ShopArea = Chamber_Sub_ShopArea;
      this.setState({UI_ShopArea: Chamber_Sub_ShopArea});
    }
    else if (this.state.UI_OutputType === importconfig.OutputType[4].value)
    {
      this.state.UI_ShopArea = Divalo_Sub_ShopArea;
      this.setState({UI_ShopArea: Divalo_Sub_ShopArea});
    }
    else
    {
      this.state.UI_ShopArea = "";
      this.setState({UI_ShopArea: ""});
    }
  }
  else
  {
    this.state.UI_ShopArea = "";
    this.setState({UI_ShopArea: ""});
  }
}
tranferType = (e) => {
  // alert(e.target.tranferType);
  this.state.UI_TranferType = e.target.value;
  this.setState({UI_TranferType: e.target.value});

  this.setState({tranferType: e.target.value});
  if(e.target.value==="Shimamura"){
    this.setState({NipponExpress_data:Shimamura_data})
  }
  else{
    this.setState({NipponExpress_data:NipponExpress_data})

  }
}
parseCompleteHandle = results => {
  console.log(results);
  this.setState({
    rawdata: results.data
  });
};
multiGroupBy = (array, group, ...restGroups) => {
  if(!group) {
    return array;
  }
  const currGrouping = _.groupBy(array, group);
  if(!restGroups.length) {
    return currGrouping;
  }
  return _.transform(currGrouping, (result, value, key) => {
    result[key] = this.multiGroupBy(value, ...restGroups);
  }, {});
};

refresh_output_file = () => {
  // alert(outputFilePath);
  this.delete_directory(savePath_CheckList);
  this.delete_directory(savePath_ForSWISS);
  this.delete_directory(outputFilePath);

  fs.mkdirSync(outputFilePath);
  fs.mkdirSync(savePath_CheckList);
  fs.mkdirSync(savePath_ForSWISS);
}
delete_directory = (path) => {
  if (fs.existsSync(path)) {
    fs.readdirSync(path).forEach(function(file, index){
      var curPath = path + "/" + file;
      if (fs.lstatSync(curPath).isDirectory()) { // recurse
        // this.delete_directory(curPath);
      } else { // delete file
        fs.unlinkSync(curPath);
      }
    });
    fs.rmdirSync(path);
  }
}

convert_input_data = () => {
  const now_raw_data = this.state.rawdata
  console.log("now_raw_data[0].length", now_raw_data[0].length);

  if (this.state.UI_TranferType === importconfig.TransferType[1].value) {

    // check data
    if (now_raw_data[0].length === importconfig.Column.NipponExpress.length) {
      console.log("importconfig.Column.NipponExpress.length", importconfig.Column.NipponExpress.length);

      // input data (Nippon Express)
      this.state.convertedData = now_raw_data;
      this.setState({
        convertedData: now_raw_data
      });
    } else {
      console.error("input file error");
      this.state.error_flg = true;
    }
  } else {

    // check data
    if (now_raw_data[0].length === importconfig.Column.Shimamura.length) {
      console.log("importconfig.Column.Shimamura.length", importconfig.Column.Shimamura.length);

      // input data (Shimamura)
      const now_converted_data = new Array;

      // add header
      now_converted_data.push(importconfig.Column.NipponExpress);

      // set data

      // set (get from Column index)
      const set_index = 0;
      const get_index = 1;
      const noDataCol_1 = [undefined];
      const lastCenterCodeCol = [8];
      const noDataCol_2 = [undefined];
      const businessTypeCol = [18];
      const departmentCol = [19];
      const dateFromCol = [11];
      const dateToCol = [11];
      const styleNoCol = [23];
      const nameCol = [24];
      const sizeCol = [25];
      const colorCol = [32];
      const itemCodeCol = [20, 21];

      // each store
      const storeCount = 200;
      const startStoeNumberCol = 48;
      const storeNumberCol_offset = 51;
      // const itemCountCol;

      const colList = [
        noDataCol_1,
        lastCenterCodeCol,
        noDataCol_2,
        businessTypeCol,
        departmentCol,
        dateFromCol,
        dateToCol,
        styleNoCol,
        nameCol,
        sizeCol,
        colorCol,
        itemCodeCol,
      ];

      _.each(now_raw_data, (raw_data, raw_index) => {
        if (raw_index > 0) {
          const common_data = new Array;

          // set data from another one
          _.each(colList, (col_data, col_index) => {
            if (col_data.length === 1) {
              if (col_data[0] !== undefined) {
                common_data.push(raw_data[col_data[0]]);
              } else {
                common_data.push("null_data");
              }
            } else if (col_data.length === 2) {
              common_data.push(
                ("000" + raw_data[col_data[0]] ).slice(-3) +
                "-" +
                ("0000"+ raw_data[col_data[1]] ).slice(-4)
              );
            }
          });

          // set data (select data)
          for (let storeNumber = 0; storeNumber < storeCount; ++storeNumber) {
            // storeNumber
            const data_store_number = raw_data[startStoeNumberCol] + storeNumber;
            // count
            const data_count = raw_data[storeNumberCol_offset + storeNumber];

            if (data_count > 0) {
              const one_data = common_data.concat();

              one_data.push(data_store_number);
              one_data.push(data_count);

              // push data
              now_converted_data.push(one_data);
            }
          }
        }
      });

      this.state.convertedData = now_converted_data;
      this.setState({
        convertedData: now_converted_data
      });
    } else {
      console.error("input file error");
      this.state.error_flg = true;
    }

  }

  if (this.state.error_flg === false) {
    // if data has multi "style no," i have to convert multi "style no" into one "style no."
    this.convert_multi_style_no_data();
  }
}
convert_multi_style_no_data = () => {
  const rows = this.state.convertedData;
  let old_style = undefined;
  let need_to_convert_only_one_style_no = false;

  // check whether data has multi style no.
  for(let i = 0; i < rows.length; ++i) {
    const row = rows[i];
    if (i > 0) {
      const style = row[7];
      if (old_style !== undefined) {
        if (style !== old_style) {
          need_to_convert_only_one_style_no = true;
          break;
        }
      }
      old_style = style;
    }
  }

  console.log("need_to_convert_only_one_style_no", need_to_convert_only_one_style_no);

  if (need_to_convert_only_one_style_no) {
    const style_color_list = {};

    rows.forEach((row, idx) => {
      if (idx > 0) {
        const style = row[7];
        const color = row[10];
        const sku_id = row[11];
        const sku_list = {
          'old_style': style.trim(),
          'new_style': undefined,
          'new_color': style.trim() + "-" + color.trim(),
        };

        style_color_list[sku_id] = sku_list;
      }
    });

    // make only one style no
    let new_only_one_style_no = "";
    for (let sku_id in style_color_list) {
      if (new_only_one_style_no !== "") {
        new_only_one_style_no += "-";
      }
      new_only_one_style_no += style_color_list[sku_id].old_style;
    }
    console.log("new_only_one_style_no", new_only_one_style_no);

    // update new_style
    for (let sku_id in style_color_list) {
      style_color_list[sku_id].new_style = new_only_one_style_no;
    }
    console.log("style_color_list", style_color_list);

    // change all style and color data
    for(let i = 0; i < rows.length; ++i) {
      const row = rows[i];
      if (i > 0) {
        // const style = row[7];
        // const color = row[10];
        const sku_id = row[11];
        row[7] = style_color_list[sku_id].new_style;
        row[10] = style_color_list[sku_id].new_color;
      }
    }
  }
}

make_excel_data = () => {
  try {
    const pattern_list = {};
    this.make_excel_data_pattern_list(pattern_list);

    const unique_pattern_list = new Array();
    this.make_excel_data_unique_pattern_list(unique_pattern_list, pattern_list);

    const unique_pattern_carton_count = {};
    _.each(unique_pattern_list, (pattrn, pattrnid) => {
      this.make_excel_data_unique_pattern_carton_count(pattrn, pattrnid, unique_pattern_carton_count);
    });
    this.unique_pattern_carton_count = unique_pattern_carton_count;
    console.log("unique_pattern_carton_count", unique_pattern_carton_count);

    const test_store_list = new Array();
    this.make_excel_data_test_store_list(unique_pattern_list, pattern_list, test_store_list);

    this.make_excel_data_other(unique_pattern_list);

  } catch (error) {
    console.log(error);
  }
}
make_excel_data_pattern_list = (pattern_list) => {

  if (this.state.UI_OutputFormat === importconfig.OutputFormat[0].value)
  {
    // main area
    this.func_make_excel_data_main_area(pattern_list);
  }
  else if (this.state.UI_OutputFormat === importconfig.OutputFormat[1].value)
  {
    let subdata_store;

    // sub area
    if (this.state.UI_OutputType === importconfig.OutputType[0].value)
    {
      // Shimamura
      console.log("subdata_store:Shimamura");
      subdata_store = areaList.SubSubArea_Shimamura;
      this.func_make_excel_data_sub_area(pattern_list, subdata_store);
    }
    else if (this.state.UI_OutputType === importconfig.OutputType[1].value)
    {
      // Avail
      console.log("subdata_store:Avail");
      subdata_store = areaList.SubSubArea_Avail;
      this.func_make_excel_data_sub_area(pattern_list, subdata_store);
    }
    else if (this.state.UI_OutputType === importconfig.OutputType[2].value)
    {
      // Birthday
      console.log("subdata_store:Birthday");
      subdata_store = areaList.SubSubArea_Birthday;
      this.func_make_excel_data_sub_area(pattern_list, subdata_store);
    }
    else if (this.state.UI_OutputType === importconfig.OutputType[3].value)
    {
      // Chamber
      console.log("subdata_store:Chamber");
      subdata_store = areaList.SubSubArea_Chamber;
      this.func_make_excel_data_sub_area(pattern_list, subdata_store);
    }
    else if (this.state.UI_OutputType === importconfig.OutputType[4].value)
    {
      // Divalo
      console.log("subdata_store:Divalo");
      subdata_store = areaList.SubSubArea_Divalo;
      this.func_make_excel_data_sub_area(pattern_list, subdata_store);
    }
    else
    {
      console.log("pattern_list is null");
    }
  }
  else
  {
    console.log("pattern_list is null");
  }
}
func_make_excel_data_main_area = (pattern_list) => {
  const rows = this.state.convertedData;
  let styleNo;

  // main area list
  rows.forEach((row, idx) => {
    if (idx > 0) {
      const destination_1 = row[1];
      const sku_id = row[11];
      const destination_2 = row[12];
      const pcs = row[13];
      const style = row[7];
      const size = row[9];
      const color = row[10];
      const sku_list = {
        'style': style,
        'size': size,
        'color': color,
        'pcs': pcs
      };
      styleNo = style;

      if (pattern_list[destination_1] === undefined) {
        pattern_list[destination_1] = {};
      }
      if (pattern_list[destination_1][destination_2] === undefined) {
        pattern_list[destination_1][destination_2] = {};
      }
      pattern_list[destination_1][destination_2][sku_id] = sku_list;
    }
  });
  console.log("pattern_list(main area list)", pattern_list);
  this.state.pattern_list = pattern_list;
  this.setState({
    pattern_list: pattern_list
  });
  this.styleNo = styleNo;
}
func_make_excel_data_sub_area = (pattern_list, subdata_store) => {
  const rows = this.state.convertedData;
  let styleNo;

  rows.forEach((row, idx) => {
    if (idx > 0) {
      const destination_1 = row[1];
      const sku_id = row[11];
      const destination_2 = row[12];
      const pcs = row[13];
      const style = row[7];
      const size = row[9];
      const color = row[10];
      const sku_list = {
        'style': style,
        'size': size,
        'color': color,
        'pcs': pcs
      };
      styleNo = style;

      // convert main area into sub area
      let temp_dest;

      for (let sub_data in subdata_store) {
        for (let subsub_data in subdata_store[sub_data]) {
          const subsub_Data = subdata_store[sub_data][subsub_data];
          const store_start = subsub_Data.start;
          const store_end = subsub_Data.end;
          if ((store_start <= destination_2) && (destination_2 <= store_end)) {
            temp_dest = subsub_Data.number;
          }
        }
      }
      const sub_destination_1 = temp_dest;
      if (pattern_list[sub_destination_1] === undefined) {
        pattern_list[sub_destination_1] = {};
      }
      if (pattern_list[sub_destination_1][destination_2] === undefined) {
        pattern_list[sub_destination_1][destination_2] = {};
      }
      pattern_list[sub_destination_1][destination_2][sku_id] = sku_list;
    }
  });
  console.log("pattern_list(sub_area_list)", pattern_list);
  this.state.pattern_list = pattern_list;
  this.setState({
    pattern_list: pattern_list
  });
  this.styleNo = styleNo;
}
make_excel_data_unique_pattern_list = (unique_pattern_list, pattern_list) => {
  // delete duplicate
  let pre_dest_number;
  for (let temp_dest_1 in pattern_list) {
    for (let temp_dest_2 in pattern_list[temp_dest_1]) {
      if (pre_dest_number === undefined) {
        pre_dest_number = temp_dest_2;
        // insert first pattern
        unique_pattern_list.push(pattern_list[temp_dest_1][temp_dest_2]);
      } else {
        // check all pattern
        let add_flg = true;
        const now_data = pattern_list[temp_dest_1][temp_dest_2];
        for (let i = 0; i < unique_pattern_list.length; ++i) {
          const pre_pattern = unique_pattern_list[i];
          let all_same_flg = true;
          for (let temp_sku_id in pattern_list[temp_dest_1][temp_dest_2]) {
            if (pre_pattern[temp_sku_id].pcs !== now_data[temp_sku_id].pcs) {
              all_same_flg = false;
              break;
            }
          }
          if (all_same_flg === true) {
            add_flg = false;
            break;
          }
        }
        if (add_flg) {
          unique_pattern_list.push(now_data);
        }
      }
    }
  }
  this.state.unique_pattern_list = unique_pattern_list;
  this.setState({
    unique_pattern_list
  });
  console.log("unique_pattern_list", unique_pattern_list);
}
make_excel_data_unique_pattern_carton_count = (unique_pattrn, unique_pattrnid, unique_pattern_carton_count) => {
  let pattern_list = this.state.pattern_list;

  _.each(pattern_list,(areaPattern, areaIndex)=>{
    let ctnCount = 0;
    _.each(areaPattern,(pattern, patternId) => {
      let all_same = true;
      for (let key in unique_pattrn){
        if (pattern[key].pcs !== unique_pattrn[key].pcs) {
            all_same = false;
            break;
        }
      }
      if (all_same) {
        ctnCount +=1;
      }
    });
    if (unique_pattern_carton_count[areaIndex] === undefined) {
      unique_pattern_carton_count[areaIndex] = {};
    }
    unique_pattern_carton_count[areaIndex][unique_pattrnid] = ctnCount;
  })
}
make_excel_data_test_store_list = (unique_pattern_list, pattern_list, test_store_list) => {

  let test_store_one_data = {};


  this.test_store_list = test_store_list;
  console.log("test_store_list", test_store_list);
}
make_excel_data_other = (unique_pattern_list) => {
  // unique data list
  const size_list = new Set();
  const color_list = new Set();
  // sum pattern pcs
  const pattern_carton_pcs = new Array();
  _.each(unique_pattern_list, (pattrn, pattrnid) => {
    let pcs_sum = 0;
    _.each(pattrn, (sku, skuId) => {
      size_list.add(sku.size);
      color_list.add(sku.color);
      pcs_sum += sku.pcs;
    });
    pattern_carton_pcs.push(pcs_sum);
  });
  this.size_list = size_list;
  this.color_list = color_list;
  this.pattern_carton_pcs = pattern_carton_pcs;
  console.log("size_list", size_list);
  console.log("color_list", color_list);
  console.log("pattern_carton_pcs", pattern_carton_pcs);
}

make_excel = async () => {

  try {
    this.setState({showLoader:true, loaderMessage:'Converting...'});
    let unique_pattern_list = this.state.unique_pattern_list;

    // make book 'assort work oder'
    for(const [pattrnid, pattrn] of unique_pattern_list.entries()) {
      await this.make_excel_book_wo(pattrn, pattrnid);
    }

    // make book 'packing list'
    await this.make_excel_book_pl();

    // make book 'assort data for swiss'
    for(const [pattrnid, pattrn] of unique_pattern_list.entries()) {
       await this.make_excel_book_swiss_assort(pattrnid);
    }

    // make book 'solid or mix data for swiss'
    await this.make_excel_book_swiss_solid_mix();

    await this.sleep(10000);
    this.setState({showLoader:false});

    if (this.state.error_flg) {
      alert(errorDisplayText);
    } else {
      // make zip
      this.make_zip();
    }


  } catch (error) {
    console.log(error);
  }

}
make_excel_book_wo = (pattrn, pattrnid) => {
  const savePath_wo = savePathHeader_wo+ this.state.UI_OutputType +"_ptn_"+ (pattrnid + 1).toString() + ".xlsx";
  const pattern_workbook = new Excel.Workbook();
  const templateFile = path.join(templatePath, this.state.UI_OutputType, "/", this.state.UI_OutputFormat + "_template.xlsx");
  console.log("templateFile", templateFile);
  pattern_workbook.xlsx.readFile(templateFile).then((result_a) => {
    // make 'PT'
    console.log('PT', pattrnid);
    const pattern_currentWorksheet = pattern_workbook.getWorksheet('PT');
    this.func_put_pt(pattrn, pattern_currentWorksheet);

    // make areawise '9990' ...
    console.log('areawise', pattrnid);
    this.func_put_area_checklist(pattrn, pattrnid, pattern_workbook);

    pattern_workbook.xlsx.writeFile(savePath_wo).then((result_b) => {
      console.log('response', pattrnid);
    }).catch((onRejected) => {
      console.error('##### make_excel_book_wo #####');
      // console.error('template file name', templateFile);
      console.error('error write file name ', savePath_wo);
      console.error(onRejected);
      this.state.error_flg = true;
    });
  }).catch((onRejected) => {
    console.error('##### make_excel_book_wo #####');
    console.error('error template read file name', templateFile);
    console.error(onRejected);
    this.state.error_flg = true;
  });
}
func_put_pt = (sku_list, pattern_currentWorksheet) => {
  let rowOffset = 4;
  let pcsCount =0;
  _.each(sku_list,(sku, skuId) => {
                pcsCount +=sku.pcs;
                pattern_currentWorksheet.getCell(`A${rowOffset.toString()}`).value = sku.style.trim();
                pattern_currentWorksheet.getCell(`B${rowOffset.toString()}`).value = skuId.trim();
                pattern_currentWorksheet.getCell(`C${rowOffset.toString()}`).value = sku.size.toString().trim();
                pattern_currentWorksheet.getCell(`D${rowOffset.toString()}`).value = sku.color.trim();
                pattern_currentWorksheet.getCell(`F${rowOffset.toString()}`).value = sku.pcs;
                rowOffset +=1;
            });
  pattern_currentWorksheet.getCell("F1").value = pcsCount;
};
func_put_area_checklist = (sku_list, pattrnid, pattern_workbook) => {
  let pattern_list = this.state.pattern_list;
  _.each(pattern_list,(areaPattern, areaIndex)=>{
    // console.log("areaIndex", areaIndex);
    let pattern_currentWorksheet = pattern_workbook.getWorksheet(areaIndex.toString());

    if (testStore != areaIndex) {
      let rowOffset = 4;
      let colOffset = 0;
      let ctnCount = 0;
      let patternStyle = "";
      const cellStyle = pattern_currentWorksheet.getCell("A4").style;
      const serialCols = ["A","B","C","D","E","F","G","H","I","J"];
      _.each(areaPattern,(pattern, patternId) => {
                  let all_same = true;
                  for (let key in sku_list){
                    if (pattern[key].pcs !== sku_list[key].pcs) {
                        all_same = false;
                        break;
                    }
                  }
                  if (all_same) {
                    const cellnumber = `${serialCols[colOffset]}${rowOffset.toString()}`;
                    pattern_currentWorksheet.getCell(cellnumber).value = _.padStart(patternId.toString(),4,'0');
                    pattern_currentWorksheet.getCell(cellnumber).style = cellStyle;
                    if((serialCols.length-1)==colOffset)
                    {
                      rowOffset +=1;
                      colOffset =0;
                    }
                    else
                    {
                      colOffset +=1;
                    }
                    if(ctnCount === 0){ patternStyle = pattern[Object.keys(pattern)[0]].style; }
                    ctnCount +=1;
                  }
              });
              pattern_currentWorksheet.getCell("C3").value = patternStyle;
              pattern_currentWorksheet.getCell("H1").value = ctnCount;
              pattern_currentWorksheet.state = 'show';
              if(ctnCount === 0){
                pattern_currentWorksheet.getCell("A4").value = "";
                pattern_currentWorksheet.unMergeCells("A4");
                pattern_currentWorksheet.properties.tabColor = undefined;
              }
              else
              {
                pattern_currentWorksheet.properties.tabColor = {argb:'FFFF0000'};
              }
    } else {
      // console.log("Test Store");
      _.each(areaPattern,(pattern, patternId) => {
        let all_same = true;
        for (let key in sku_list){
          if (pattern[key].pcs !== sku_list[key].pcs) {
              all_same = false;
              break;
          }
        }
        if (all_same) {
          this.func_put_test_area_checklist(sku_list, pattern_currentWorksheet);
        }
      });
    }
  })
};
func_put_test_area_checklist = (sku_list, pattern_currentWorksheet) => {
  let rowOffset = 4;
  let pcsCount =0;
  _.each(sku_list,(sku, skuId) => {
                pcsCount +=sku.pcs;
                pattern_currentWorksheet.getCell(`F${rowOffset.toString()}`).value = sku.pcs;
                rowOffset +=1;
            });
  pattern_currentWorksheet.getCell("F1").value = pcsCount;
  pattern_currentWorksheet.properties.tabColor = {argb:'FFFF0000'};
};
make_excel_book_pl = () => {
  const workbook= new Excel.Workbook();
  const templateFile = path.join(templatePath, this.state.UI_OutputType, "/", this.state.UI_OutputFormat + "_template.xlsx");
  console.log("templateFile", templateFile);
  workbook.xlsx.readFile(templateFile).then((result_a) => {
    // make 'PL'
    console.log('PL');
    const currentWorksheet = workbook.getWorksheet('PL');
    this.func_put_pl(currentWorksheet);
    const savePath_plfile = savePathHeader_pl + this.state.UI_OutputType + "_PL.xlsx";

    // need to await
    workbook.xlsx.writeFile(savePath_plfile).then((result_b) => {
      console.log('response', result_b);
    }).catch((onRejected) => {
      console.error('##### make_excel_book_pl #####');
      // console.error('template file name', templateFile);
      console.error('error write file name ', savePath_plfile);
      console.error(onRejected);
      this.state.error_flg = true;
    });
  }).catch((onRejected) => {
    console.error('##### make_excel_book_pl #####');
    console.error('error template read file name', templateFile);
    console.error(onRejected);
    this.state.error_flg = true;
  });
}
func_put_pl = (currentWorksheet) => {
  let size_list = this.size_list;
  let color_list = this.color_list;
  let unique_pattern_carton_count = this.unique_pattern_carton_count;
  let styleNo = this.styleNo;
  let unique_pattern_list = this.state.unique_pattern_list;
  let pattern_carton_pcs = this.pattern_carton_pcs;
  // console.log("size_list", size_list);
  // console.log("color_list", color_list);
  // console.log("unique_pattern_carton_count", unique_pattern_carton_count);
  // console.log("styleNo", styleNo);
  // console.log("unique_pattern_list", unique_pattern_list);
  // console.log("pattern_carton_pcs", pattern_carton_pcs);

  let rowOffset = 0;
  let pcsCount =0;
  let count = 0;

  // size setting
  const sizeCols = ["H","I","J","K","L","M","N","O"];
  count = 0;
  rowOffset = 10;
  size_list.forEach((size) => {
    console.log("size", size);
    const cell_ref = sizeCols[count] + rowOffset;
    console.log("cell_ref", cell_ref);
    currentWorksheet.getCell(cell_ref).value = size.toString().trim();
    count += 1;
  });

  // carton setting
  const storeNumberCol = "A";
  const startCartonCol = "B";
  const endCartonCol = "D";
  const styleNoCol = "F";
  const colorCol = "G";
  const totalCartonCol = "P";
  const loopRowsCount = color_list.size;
  let cell_ref;
  let pattern_data;
  let rowIndex = 0;
  let startCount = 1;
  let endCount = 0;
  let color_count = 0;
  let size_count = 0;
  let color_rowIndex = 0;
  let pattern_count = 0;
  count = 0;
  rowOffset = 11;
  for (let store_number in unique_pattern_carton_count) {
    if (testStore != store_number) {
      for (let pattern_number in unique_pattern_carton_count[store_number]) {
        pattern_count = unique_pattern_carton_count[store_number][pattern_number];

        if (pattern_count !== 0) {
          // ##### set for now #####
          pattern_data = unique_pattern_list[pattern_number];
          rowIndex = (rowOffset + (loopRowsCount * count));

          // storenumber
          cell_ref = storeNumberCol + rowIndex;
          currentWorksheet.getCell(cell_ref).value = store_number;
          // startCount
          cell_ref = startCartonCol + rowIndex;
          currentWorksheet.getCell(cell_ref).value = startCount;
          // endCount
          cell_ref = endCartonCol + rowIndex;
          endCount += pattern_count;
          currentWorksheet.getCell(cell_ref).value = endCount;
          // styleNo
          cell_ref = styleNoCol + rowIndex;
          currentWorksheet.getCell(cell_ref).value = styleNo.trim();
          // color
          color_count = 0;
          color_list.forEach((color) => {
            color_rowIndex = rowIndex + color_count;
            cell_ref = colorCol + color_rowIndex;
            currentWorksheet.getCell(cell_ref).value = color.trim();
            // pattern size count
            size_count = 0;
            size_list.forEach((size) => {
              for (let sku_id in pattern_data) {
                if (pattern_data[sku_id].size === size) {
                  if (pattern_data[sku_id].color === color) {
                    cell_ref = sizeCols[size_count] + color_rowIndex;
                    currentWorksheet.getCell(cell_ref).value = pattern_data[sku_id].pcs;
                  }
                }
              }
              size_count += 1;
            });
            color_count += 1;
          });

          // total
          cell_ref = totalCartonCol + rowIndex;
          currentWorksheet.getCell(cell_ref).value = pattern_carton_pcs[pattern_number];

          // ----- set for next -----
          startCount = endCount + 1;
          count += 1;
        }
      }
    } else {
      // console.log("Test Store");
      // don't add now Test Store Add Last.
    }
  }

  // Test Store
  for (let pattern_number in unique_pattern_carton_count[testStore]) {
    pattern_count = unique_pattern_carton_count[testStore][pattern_number];

    if (pattern_count !== 0) {
      // ##### set for top #####
      pattern_data = unique_pattern_list[pattern_number];
      rowIndex = (rowOffset + (loopRowsCount * count));

      // storenumber
      cell_ref = storeNumberCol + rowIndex;
      currentWorksheet.getCell(cell_ref).value = testStore;

      // color size count
      let color_size_count = 0;
      color_list.forEach((color) => {
        // pattern size count
        size_count = 0;
        size_list.forEach((size) => {
          for (let sku_id in pattern_data) {
            if (pattern_data[sku_id].size === size) {
              if (pattern_data[sku_id].color === color) {
                // set each row index
                color_rowIndex = rowIndex + color_size_count;

                // startCount
                cell_ref = startCartonCol + color_rowIndex;
                currentWorksheet.getCell(cell_ref).value = startCount;
                // endCount
                cell_ref = endCartonCol + color_rowIndex;
                currentWorksheet.getCell(cell_ref).value = startCount;
                // styleNo
                cell_ref = styleNoCol + color_rowIndex;
                currentWorksheet.getCell(cell_ref).value = styleNo.trim();
                // color
                cell_ref = colorCol + color_rowIndex;
                currentWorksheet.getCell(cell_ref).value = color.trim();
                // size
                cell_ref = sizeCols[size_count] + color_rowIndex;
                currentWorksheet.getCell(cell_ref).value = pattern_data[sku_id].pcs;
                // total
                cell_ref = totalCartonCol + color_rowIndex;
                currentWorksheet.getCell(cell_ref).value = pattern_data[sku_id].pcs;

                // ----- set for next -----
                startCount += 1;
              }
            }
          }
          size_count += 1;
          color_size_count += 1;
        });
      });
    }
  }
};
make_excel_book_swiss_assort = async (pattrnid) => {
  const savePath_swiss_assort = savePathHeader_swiss_assort + (pattrnid + 1).toString() + ".xlsx";
  const workbook = new Excel.Workbook();
  const currentWorksheet = workbook.addWorksheet("Sheet1");

  // make 'swiss assort'
  console.log("swiss assort");
  await this.func_put_swiss_assort(pattrnid, currentWorksheet);

  workbook.xlsx.writeFile(savePath_swiss_assort).then((result) => {
    console.log('response', result);
  }).catch((onRejected) => {
    console.error('##### make_excel_book_swiss_assort #####');
    console.error('error file name ', savePath_swiss_assort);
    console.error(onRejected);
    this.state.error_flg = true;
  });
}
func_put_swiss_assort = (pattrnid, currentWorksheet) => {
  let unique_pattern_list_one = this.state.unique_pattern_list[pattrnid];
  let unique_pattern_carton_count = this.unique_pattern_carton_count;
  let color_list = this.color_list;
  // console.log("unique_pattern_list_one", unique_pattern_list_one);
  // console.log("unique_pattern_carton_count", unique_pattern_carton_count);
  // console.log("color_list", color_list);

  const col_BarCode =   ["A", "Bar code"];
  const col_StyleNo =   ["B", "StyleNo."];
  const col_Color =     ["C", "COLOR"];
  const col_Size =      ["D", "SIZE"];
  const col_SetNo =     ["E", "Set No."];
  const col_PcsQty_a =  ["F", "Pcs QTY"];
  const col_PacQty_b =  ["G", "Pac QTY"];
  const col_CtnQty_c =  ["H", "CTN QTY"];
  const col_TotalPcs =  ["I", "Total Pcs"];
  const col_SendTo =    ["J", "Send To"];

  let cell_ref;
  let rowOffset = 1;

  // set header

  // Bar code
  cell_ref = col_BarCode[0] + rowOffset;
  currentWorksheet.getCell(cell_ref).value = col_BarCode[1];
  // StyleNo.
  cell_ref = col_StyleNo[0] + rowOffset;
  currentWorksheet.getCell(cell_ref).value = col_StyleNo[1];
  // COLOR
  cell_ref = col_Color[0] + rowOffset;
  currentWorksheet.getCell(cell_ref).value = col_Color[1];
  // SIZE
  cell_ref = col_Size[0] + rowOffset;
  currentWorksheet.getCell(cell_ref).value = col_Size[1];
  // Set No.
  cell_ref = col_SetNo[0] + rowOffset;
  currentWorksheet.getCell(cell_ref).value = col_SetNo[1];
  // Pcs QTY
  cell_ref = col_PcsQty_a[0] + rowOffset;
  currentWorksheet.getCell(cell_ref).value = col_PcsQty_a[1];
  // Pac QTY
  cell_ref = col_PacQty_b[0] + rowOffset;
  currentWorksheet.getCell(cell_ref).value = col_PacQty_b[1];
  // CTN QTY
  cell_ref = col_CtnQty_c[0] + rowOffset;
  currentWorksheet.getCell(cell_ref).value = col_CtnQty_c[1];
  // Total Pcs
  cell_ref = col_TotalPcs[0] + rowOffset;
  currentWorksheet.getCell(cell_ref).value = col_TotalPcs[1];
  // Send To
  cell_ref = col_SendTo[0] + rowOffset;
  currentWorksheet.getCell(cell_ref).value = col_SendTo[1];

  // set data

  let rowIndex = 0;
  let count = 0;
  let pattern_count = 0;
  rowOffset = 2;
  color_list.forEach((color) => {

    for (let store_number in unique_pattern_carton_count) {
      pattern_count = unique_pattern_carton_count[store_number][pattrnid];

      if (pattern_count !== 0) {
        _.each(unique_pattern_list_one, (sku, key) => {

          if (sku.color === color) {
            rowIndex = rowOffset + count;

            // Bar code

            // StyleNo.
            cell_ref = col_StyleNo[0] + rowIndex;
            currentWorksheet.getCell(cell_ref).value = sku.style.trim();
            // COLOR
            cell_ref = col_Color[0] + rowIndex;
            currentWorksheet.getCell(cell_ref).value = sku.color.trim();
            // SIZE
            cell_ref = col_Size[0] + rowIndex;
            currentWorksheet.getCell(cell_ref).value = sku.size.toString().trim();
            // Set No.
            cell_ref = col_SetNo[0] + rowIndex;
            currentWorksheet.getCell(cell_ref).value = store_number;
            // Pcs QTY
            cell_ref = col_PcsQty_a[0] + rowIndex;
            currentWorksheet.getCell(cell_ref).value = sku.pcs;
            // Pac QTY
            cell_ref = col_PacQty_b[0] + rowIndex;
            currentWorksheet.getCell(cell_ref).value = 1;
            // CTN QTY
            cell_ref = col_CtnQty_c[0] + rowIndex;
            currentWorksheet.getCell(cell_ref).value = pattern_count;
            // Total Pcs
            cell_ref = col_TotalPcs[0] + rowIndex;
            currentWorksheet.getCell(cell_ref).value = (sku.pcs * pattern_count);
            // Send To

            // for next
            count += 1;
          }
        });
      }
    }
  });
};
make_excel_book_swiss_solid_mix = async () => {
  const workbook = new Excel.Workbook();
  const currentWorksheet = workbook.addWorksheet("Sheet1");

  // make 'swiss solid or mix'
  console.log("swiss solid or mix");
  await this.func_put_swiss_solid_mix(currentWorksheet);

  workbook.xlsx.writeFile(savePath_swiss_solid_mix).then((result) => {
    console.log('response', result);
  }).catch((onRejected) => {
    console.error('##### make_excel_book_swiss_solid_mix #####');
    console.error('error file name ', savePath_swiss_solid_mix);
    console.error(onRejected);
    this.state.error_flg = true;
  });
}
func_put_swiss_solid_mix = (currentWorksheet) => {
  let unique_pattern_list_one = this.state.unique_pattern_list[0];
  // console.log("unique_pattern_list_one", unique_pattern_list_one);

  const col_ID =        ["A", "ID"];
  const col_StyleNo =   ["B", "Style No."];
  const col_OrderID =   ["C", "OrderID"];
  const col_SKUID =     ["D", "SKUID"];
  const col_Color =     ["E", "Color"];
  const col_Size =      ["F", "Size"];
  const col_PacQTY =    ["G", "Pac QTY."];
  const col_Pcs_Ctn =   ["H", "pcs/CTN"];
  const col_Customer =  ["I", "Customer"];

  let cell_ref;
  let rowOffset = 1;

  // set header

  // ID
  cell_ref = col_ID[0] + rowOffset;
  currentWorksheet.getCell(cell_ref).value = col_ID[1];
  // Style No.
  cell_ref = col_StyleNo[0] + rowOffset;
  currentWorksheet.getCell(cell_ref).value = col_StyleNo[1];
  // OrderID
  cell_ref = col_OrderID[0] + rowOffset;
  currentWorksheet.getCell(cell_ref).value = col_OrderID[1];
  // SKUID
  cell_ref = col_SKUID[0] + rowOffset;
  currentWorksheet.getCell(cell_ref).value = col_SKUID[1];
  // Color
  cell_ref = col_Color[0] + rowOffset;
  currentWorksheet.getCell(cell_ref).value = col_Color[1];
  // Size
  cell_ref = col_Size[0] + rowOffset;
  currentWorksheet.getCell(cell_ref).value = col_Size[1];
  // Pac QTY.
  cell_ref = col_PacQTY[0] + rowOffset;
  currentWorksheet.getCell(cell_ref).value = col_PacQTY[1];
  // pcs/CTN
  cell_ref = col_Pcs_Ctn[0] + rowOffset;
  currentWorksheet.getCell(cell_ref).value = col_Pcs_Ctn[1];
  // Customer
  cell_ref = col_Customer[0] + rowOffset;
  currentWorksheet.getCell(cell_ref).value = col_Customer[1];

  // set data

  let rowIndex = 0;
  let count = 0;
  rowOffset = 2;
  _.each(unique_pattern_list_one, (sku, key) => {
    rowIndex = rowOffset + count;

    // ID

    // Style No.
    cell_ref = col_StyleNo[0] + rowIndex;
    currentWorksheet.getCell(cell_ref).value = sku.style.trim();
    // OrderID

    // SKUID

    // Color
    cell_ref = col_Color[0] + rowIndex;
    currentWorksheet.getCell(cell_ref).value = sku.color.trim();
    // Size
    cell_ref = col_Size[0] + rowIndex;
    currentWorksheet.getCell(cell_ref).value = sku.size.toString().trim();
    // Pac QTY.
    cell_ref = col_PacQTY[0] + rowIndex;
    currentWorksheet.getCell(cell_ref).value = 1;
    // pcs/CTN

    // Customer

    // for next
    count += 1;
  });
};

make_zip = () => {
  console.log("Asking zip location");
  var userChosenPath = dialog.showSaveDialog({ defaultPath: savePath_Zip_Default });
  if(userChosenPath){
    zipdir(outputFilePath, { saveTo: userChosenPath }, function (err, buffer) {
      alert("Output file saved successfully");
    });
  }
}

sleep = (milliseconds) => {
  return new Promise(resolve => setTimeout(resolve, milliseconds))
}

downloadExcel = ()=>{
  try {
    this.state.error_flg = false;
    this.refresh_output_file();
    this.convert_input_data();
    if (this.state.error_flg) {
      alert(errorDisplayText);
    } else {
      this.make_excel_data();
      this.make_excel();
    }

  } catch (error) {
    console.log(error);
  }

}

onDrop(files) {
  this.setState({files});
  this.setState({showLoader:true, loaderMessage:'Reading CSV...'});
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
        console.log("Parsed Data", results);
        this.setState({rawdata: results.data, showLoader:false});
      },
    });
  };
  reader.readAsArrayBuffer(files[0]);
}
onConvert()
{
  this.downloadExcel();
}
onCancel() {
  this.setState({
    files: [],
    showUploadLable:true
  });
}
operation()
{
  this.setState({
    showUploadLable:false
  })
}

render() {
  const {Shimamura_data,NipponExpress_data,shopArea_data}=this.state;
    const files = this.state.files.map(file => (
      <li key={file.name}>
        {file.name} - {file.size} bytes
      </li>
    ))
    var someDate = new Date();
    someDate.setDate(someDate.getDate() + 3);
    var date = someDate.toISOString().substr(0, 10);


    return (

      <div className={styles.container} data-tid="container">
       <TitleBar />
        <Segment basic className={styles.section}>
        <Dimmer active={this.state.showLoader} inverted >
          <Loader size='large' className={styles.loaderMessage} >{this.state.loaderMessage}</Loader>
        </Dimmer>
        <Dropzone
          onDrop={this.onDrop.bind(this)}
          onFileDialogCancel={this.onCancel.bind(this)}
        >
          {({getRootProps, getInputProps}) => (
            <div {...getRootProps()}>
              <input {...getInputProps()} />
        <div id={styles.header} onClick={()=>this.operation()}>
          <div className="ui center aligned icon header" id={styles.hdicon} >
          <img  src={pdpUploadIcon} alt="Logo" onClick={()=>this.operation()}/>
          {
            this.state.showUploadLable?
            <p id={styles.hdtxt}><span id={styles.hd1text}>Choose a file</span> <span id={styles.hd2text}>or drag it here</span></p>
            :null
            }
            {
            this.state.showFiles?
            <aside >
              <ul id={styles.files}>{files}</ul>
            </aside>
            :null
            }
              </div>
            </div>
            </div>
              )}
            </Dropzone>

        <div className="ui grid" id={styles.left} >
        <div className="eight wide column">
        <label>Output Type</label>
        <select  className="ui fluid search dropdown" value={this.state.StoreArea_data} id={styles.dropdown}  name="members" onChange={this.outputType}>
        {importconfig.OutputType.map((data, key) => {
          return (

          <option key={key} value={data.value}>{data.value}</option>
         )
        })}
        </select>
        <div className={styles.pdp_outForm}>
        <label>Output Format</label>
        <select  className="ui fluid search dropdown" id={styles.dropdown}  name="members" onChange={this.outputFormat}>
        {importconfig.OutputFormat.map((data,key) => {
          return (
          <option key={key} value={data.value}>{data.value}</option>
         )
        })}
       </select>
       </div>
       <div className={styles.pdp_outForm}>
        <label> Transfer Type</label>
        <select className="ui fluid search dropdown" id={styles.dropdown}  onChange={this.tranferType}>
        {importconfig.TransferType.map((data, key) => {
          return (
          <option key={key} value={data.value}>{data.value}</option> )
        })}
        </select>
         </div>
         <div  className={styles.pdp_creatdate}>
        <label id={styles.para} > Created Date</label><br/>
          <div className="ui input">
            <input id={styles.date} type="date" placeholder="date" defaultValue={this.state.UI_CurrentDate} onChange={this.handleChange} /></div>
            </div>
          </div>
          <div className="eight wide column">
          <p id={styles.right}> Column</p>
                <TextArea id={styles.textarea}placeholder='' style={{ minHeight: 100 }} value={this.state.NipponExpress_data}></TextArea>
            <div id={styles.right1}> Shop Area</div>
                <TextArea id={styles.textarea} placeholder='' style={{ minHeight: 100 }}  value={this.state.UI_ShopArea} ></TextArea>

        </div>
        <Button className="ui centered green button" id={styles.btn} onClick={ async () => { this.onConvert()}} >CONVERT</Button>
        </div>
        </Segment>
        <FooterBar ></FooterBar>
        </div>
    );
}


}
