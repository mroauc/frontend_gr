<<<<<<< HEAD
import React, { Component } from 'react';
import Routes from './routes';
import 'bootstrap/dist/js/bootstrap';


class App extends Component {
  render(){
    //localStorage.setItem('url',"http://104.236.118.82:8080");
     localStorage.setItem('url',"http://localhost:8080");
    return (
      
      <div className="App">
        <Routes />
      </div>
    );
  }
}

export default App;
=======
import React, { Component } from 'react';
import Routes from './routes';
import 'bootstrap/dist/js/bootstrap';


class App extends Component {
  render(){
    localStorage.setItem('url',"http://104.236.118.82:8080");
    //localStorage.setItem('url',"http://localhost:8080");
    return (
      
      <div className="App">
        <Routes />
      </div>
    );
  }
}

export default App;
>>>>>>> c5af4b258a31ff6b00f33b5d79bfb6d0e7a655d5
