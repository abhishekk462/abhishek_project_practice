// @flow
import React, { Component } from 'react';
import { app, BrowserWindow, remote } from 'electron';
import styles from  './TitleBar.css';
import close_icon from './close_icon24.png';
import icon_swot from './icon_swot.png';
import maximize_icon from './maximize_icon24.png';
import minimize_icon from './minimize_icon24.png';

export default class TitleBar extends Component {
    constructor(props) {
      super(props);
      this.TitleBar = React.createRef();
    }

   MinWindow(e) {
      var window = remote.getCurrentWindow();
      window.minimize();
  };

  // Maximize window
  MaxWindow(e) {
      var window = remote.getCurrentWindow();
      if(window.isMaximized()){
          window.unmaximize();
      }else{
          window.maximize();
      }
  };

  // Close app
 closeWindow(e) {
   var window = remote.getCurrentWindow();
    window.close();
  };
    render() {
      return (
        <div id={styles.titlebar}>
        <div id={styles.title}> <img  src={icon_swot } alt="icon_swot "/></div><li id={styles.titletxt}> SWOT</li> 
         <div id={styles.titlebarbtns}>
             
              {/* <div className="ui buttons"></div>
              <button className=" ui button" id={styles.menubtn} onClick={this.MinWindow}>
              <li ><img  src={minimize_icon } /></li>
              </button>
              <button className=" ui button"id={styles.menubtn}  onClick={this.MaxWindow}>
              <li ><img  src={maximize_icon }/></li>
              </button>
              <button className=" ui button"id={styles.menubtn}  onClick={this.closeWindow}>
              <li ><img  src={close_icon } /></li>
              </button> */}

              <div className="ui buttons">
  <button className="ui button" id={styles.menubtn} onClick={this.MinWindow}>
    <i ><img  src={minimize_icon } /></i>
  </button>
  <button className="ui button" id={styles.menubtn} onClick={this.MaxWindow}>
    <i><img  src={maximize_icon }/></i>
  </button>
  <button className="ui button" id={styles.menubtn} onClick={this.closeWindow}>
    <i ><img  src={close_icon } /></i>
  </button>
</div>
         </div>
             </div>
    );
    }
  }