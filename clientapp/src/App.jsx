import './App.css';
import * as React from 'react';
import { Header } from './components/header/header';
import 'bootstrap/dist/css/bootstrap.min.css';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import Login from './components/Login';
import Analytics from './components/Analytics';
import { createContext, useReducer } from 'react';


class App extends React.Component {
  render() {

    return (

      <Router>

        <div className="App">
          {/* <nav className="navbar navbar-expand-lg navbar-light bg-light">
          <ul className="navbar-nav mr-auto"> */}
          {/* <li><Link to={'/'} className="nav-link"> Login </Link></li>
            <li><Link to={'/Analytics'} className="nav-link"> Analytics </Link></li> */}
          {/* </ul>
          </nav> */}
          <Switch>
            <Route exact path='/' component={Login} />
            <Route exact path='/Analytics' component={Analytics} />
          </Switch>
        </div>
      </Router>
    );
  }
}

export default App;