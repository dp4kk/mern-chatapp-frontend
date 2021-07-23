import React from 'react'
import {BrowserRouter as Router,Switch,Route} from 'react-router-dom'
import Login from './Pages/Login';
import Register from './Pages/Register';
import DataContext from './contexts/DataContext'
import PrivateRoute from './extras/PrivateRoute'
import Dashboard from './Pages/Dashboard';
import ChatroomPage from './Pages/ChatroomPage';
import { CssBaseline } from '@material-ui/core';
const App=()=>{
return (
  <React.Fragment>
    <CssBaseline />
    <Router>
      <DataContext>
        <Switch>
          <Route path="/login" component={Login} />
          <Route path="/register" component={Register} />
          <PrivateRoute exact path="/" component={Dashboard} />
          <PrivateRoute path="/chatroom/:id" component={ChatroomPage} />
        </Switch>
      </DataContext>
    </Router>
  </React.Fragment>
);
}

export default App;
