import React from 'react';
import styles from "./Modal.css";

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
const modal = (props) => {
    return (
        
        <Modal trigger={<i className="trash alternate icon outline"id={styles.dwnIcon}></i> } closeIcon>
       
       
        <Modal.Actions id={styles.Modelbtn}>
        <Header id={styles.header} content='Do you want to delete ?' />
          <Button  id={styles.Nobtn} color='red'>No
            {/* <Icon name='remove' /> No */}
          </Button>
          <Button   id={styles.Nobtn} color='green'>Yes
            {/* <Icon name='checkmark' /> Yes */}
          </Button>
        </Modal.Actions>
        
      </Modal>






    )
}

export default modal;
