// @flow 
import React, { Component } from "react";
import { Link,Switch,Route, BrowserRouter as Router,NavLink} from "react-router-dom";
import ReactTable from "react-table";
import Excel from 'exceljs';
import path from 'path';
import routes from "../../constants/routes";
import styles from "./Home.css";
import FileInput from "../FileInput";
import TitleBar from "../TitleBar";
import "react-table/react-table.css";
import ExcelDownload from '../ExcelDownload';
 //import ImportForm from '../../containers/ImportForm';
import ImportForm from '../Importtable/import.js'
import Import from '../Importtable/import.js';
import Modal from '../AlertModal/Modal.js';
import DwnModal from '../AlertModal/DwnModal.js';
import {
  Button,
  Form,
  Grid,
  Header,
  Message,
  Segment,
} from 'semantic-ui-react';
// type Props = {};

export default class Home extends Component {
  // props: Props;
  constructor(props) {
    super(props);
      this.state = {
        isModalShowing: false
}
    
  }

  openModalHandler = () => {
    this.setState({
      isModalShowing: true
    });
  }
  
  closeModalHandler = () => {
    this.setState({
      isModalShowing: false
    });
  }
  




  render() {
    return (
  
      <div className={styles.container} data-tid="container">
        <TitleBar />
        { this.state.isModalShowing ? <div onClick={this.closeModalHandler} className="back-drop"></div> : null }
          <div className={`ui two column grid ${styles.pdp_assort}`}>


<Grid.Row columns={2} id={styles.row}>
      <Grid.Column>
      <div className={`column ${styles.pdp_assortlist}`}>Assort List</div>
      </Grid.Column>
      <Grid.Column>
      <Link to = '/importForm' className={`ui green button ${styles.pdp_button}`}>ADD NEW</Link>
      </Grid.Column>
    </Grid.Row>

            <div className="row">
              <div className={`ui centered two column grid ${styles.pdp_grid}`}>
                <div className="row">
                  <div className="column">
                        <div className={`left floated column ${styles.pdp_ftitle}`}>
                          File Title
                        </div>
                        <label className={styles.pdp_subtitle}>01.02.2019 tuesday</label>
                    </div>
                    <div className={`column ${styles.pdp_iconlign}`}>
                    <DwnModal
                    className="modal"
                    show={this.state.isModalShowing}
                    close={this.closeModalHandler}>
                        Maybe aircrafts fly very high because they don't want to be seen in plane sight?
                   </DwnModal>
                      <Modal 
                    className="modal"
                    show={this.state.isModalShowing}
                    close={this.closeModalHandler}>
                        Maybe aircrafts fly very high because they don't want to be seen in plane sight?
                </Modal>
                    </div>   
                </div>
                <hr></hr>
            </div>
          </div>

           <div className="row">
              <div className={`ui centered two column grid ${styles.pdp_grid}`}>
                <div className="row">
                  <div className="column">
                        <div className={`left floated column ${styles.pdp_ftitle}`}>
                          File Title
                        </div>
                        <label className={styles.pdp_subtitle}>01.02.2019 tuesday</label>
                   </div>
                   <div className={`column ${styles.pdp_iconlign}`}>
                   <DwnModal
                    className="modal"
                    show={this.state.isModalShowing}
                    close={this.closeModalHandler}>
                        Maybe aircrafts fly very high because they don't want to be seen in plane sight?
                   </DwnModal>
                      <Modal
                    className="modal"
                    show={this.state.isModalShowing}
                    close={this.closeModalHandler}>
                      
                </Modal>
                   
                   </div>   
                 </div>
                  <hr></hr>
             </div>
           </div>

           <div className="row">
              <div className={`ui centered two column grid ${styles.pdp_grid}`}>
                <div className="row">
                  <div className="column">
                        <div className={`left floated column ${styles.pdp_ftitle}`}>
                          File Title
                        </div>
                        <label className={styles.pdp_subtitle}>01.02.2019 tuesday</label>
                   </div>
                   <div className={`column ${styles.pdp_iconlign}`}>
                   <DwnModal
                    className="modal"
                    show={this.state.isModalShowing}
                    close={this.closeModalHandler}>
                        Maybe aircrafts fly very high because they don't want to be seen in plane sight?
                   </DwnModal>
                      <Modal
                    className="modal"
                    show={this.state.isModalShowing}
                    close={this.closeModalHandler}>
                       
                </Modal>
                   </div>   
                 </div>
                  <hr></hr>
             </div>
           </div>

           <div className="row">
              <div className={`ui centered two column grid ${styles.pdp_grid}`}>
                <div className="row">
                  <div className="column">
                        <div className={`left floated column ${styles.pdp_ftitle}`}>
                          File Title
                        </div>
                        <label className={styles.pdp_subtitle}>01.02.2019 tuesday</label>
                   </div>
                   <div className={`column ${styles.pdp_iconlign}`}>
                   <DwnModal
                    className="modal"
                    show={this.state.isModalShowing}
                    close={this.closeModalHandler}>
                        Maybe aircrafts fly very high because they don't want to be seen in plane sight?
                   </DwnModal>
                      <Modal
                    className="modal"
                    show={this.state.isModalShowing}
                    close={this.closeModalHandler}>
                       
                </Modal>
                   </div>   
                 </div>
                  <hr></hr>
              </div>
           </div>
           
           <div className="row">
              <div className={`ui centered two column grid ${styles.pdp_grid}`}>
                <div className="row">
                  <div className="column">
                        <div className={`left floated column ${styles.pdp_ftitle}`}>
                          File Title
                        </div>
                        <label className={styles.pdp_subtitle}>01.02.2019 tuesday</label>
                   </div>
                   <div className={`column ${styles.pdp_iconlign}`}>
                   <DwnModal
                    className="modal"
                    show={this.state.isModalShowing}
                    close={this.closeModalHandler}>
                        Maybe aircrafts fly very high because they don't want to be seen in plane sight?
                   </DwnModal>
                      <Modal
                    className="modal"
                    show={this.state.isModalShowing}
                    close={this.closeModalHandler}>
                       
                </Modal>   
                  </div>   
                </div>
                  <hr></hr>
              </div>
            </div>
           
           <Switch>  
            {/* <Route path="/importForm" component={ImportForm} />  */}
          {/* <Route path="/forms" component={Formlist} /> 
          <Route path="/form/view" component={Formview}/> */}
       </Switch> 
        
           
          </div>
        </div> 
       
      
    );
  }
}
