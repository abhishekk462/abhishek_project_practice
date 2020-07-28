import React, { Component } from "react";
import {
    Button,
    Form,
    Modal,
    Grid,
    Icon,
    Header,
    Message,
    Segment,
  } from 'semantic-ui-react';
  import styles from "./Modal.css";

  export default class dwnmodal extends Component{
    constructor(props) {
      super(props);
      this.dwnmodal = React.createRef();
    }

    render() {
    return (
        
        <Modal open={ this.props.openDownload }  closeOnEscape={true} closeOnDimmerClick={true} closeIcon >
     
        <Modal.Actions id={styles.dwnbtngrp}>
        <Header id={styles.header} content='Download' />
       
          <Button  id={styles.dwnModalbtn}>CheckList</Button>
          <Button  id={styles.dwnModalbtn}>SWISS Input</Button>
          <Button  id={styles.dwnModalbtn}>Both</Button>
        
        </Modal.Actions>
        
      </Modal>






    )
}
  }