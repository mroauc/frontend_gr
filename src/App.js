import React, { Component } from 'react';
import Routes from './routes';
import 'bootstrap/dist/js/bootstrap';


class App extends Component {
  render(){
    localStorage.setItem('url',"104.236.118.82:8080");
    return (
      
      <div className="App">
        <Routes />
      </div>
    );
  }
}

export default App;