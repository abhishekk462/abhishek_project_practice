import React from 'react';
import Routes from './Routes'
import './App.css'

import { BrowserRouter as Router } from "react-router-dom";


const App = props => {
  return (
    <Router>
   <Routes/>

    
  </Router>
  );
}

export default App;

