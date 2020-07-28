import React from 'react';
import { Switch, Route, withRouter,BrowserRouter as Router } from 'react-router-dom';
import routes from './constants/routes';
import App from './containers/App';
import HomePage from './containers/HomePage';
import ImportForm from './containers/ImportForm';

export default () => (
  <App> 
    <Switch>
      <Route path={routes.HOME} component={ImportForm} />
      </Switch>
      <Switch>
      <Route path={routes.IMPORT} component={ImportForm} />
    </Switch>
    <Switch>
    <Route path={routes.IMPORTFORM} component={ImportForm} /> 
    </Switch>
  </App>
);
