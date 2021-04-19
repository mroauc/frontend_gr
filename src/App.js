import React, { Component } from 'react';
import Routes from './routes';
import 'bootstrap/dist/js/bootstrap';


class App extends Component {
  render(){
    localStorage.setItem('url',"104.236.118.82:8080");
<<<<<<< HEAD
    // localStorage.setItem('url', "http://localhost:8080");
=======
    // localStorage.setItem('url',"http://localhost:8080");
>>>>>>> d8f10c80cbb47161e9dd51f3ee8bbe89c296fef0
    return (
      
      <div className="App">
        <Routes />
      </div>
    );
  }
}

export default App;