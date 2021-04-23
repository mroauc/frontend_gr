import React, { Component } from 'react';
import Routes from './routes';
import 'bootstrap/dist/js/bootstrap';


class App extends Component {
  render(){
    // localStorage.setItem('url',"http://106:546:542:8080");
    localStorage.setItem('url',"http://localhost:8080");
    return (
      
      <div className="App">
        <Routes />
      </div>
    );
  }
}

export default App;