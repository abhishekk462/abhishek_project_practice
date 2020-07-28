// @flow
import React, { Component } from 'react';
import { app, BrowserWindow, remote } from 'electron';
import styles from  './FooterBar.css';

export default class FooterBar extends Component {
    constructor(props) {
      super(props);
      this.FooterBar = React.createRef();
    }

    render() {
      return (
        <div className={styles.footerbar}>
            <div className={styles.horizontalbar}> </div>
        </div>
    );
    }
  }