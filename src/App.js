import React from 'react';
import './App.css';
import { Route, BrowserRouter, Switch, Redirect } from 'react-router-dom';
import Home from './components/Homepage';
import Header from './components/Header';

function App() {
  return (
    <div>
      <Header/>
      <BrowserRouter>
          <Switch>
            <Route path='/home' component={Home} />
            <Redirect from="/" to="/home" />
          </Switch>
      </BrowserRouter>
  </div>

  );
}

export default App;
