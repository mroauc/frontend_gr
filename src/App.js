import React, { Component } from 'react';
import Routes from './routes';
import 'bootstrap/dist/js/bootstrap';


class App extends Component {
  render(){
<<<<<<< HEAD
    // localStorage.setItem('url',"http://106:546:542:8080");
    localStorage.setItem('url',"http://localhost:8080");
=======
    //localStorage.setItem('url',"http://104.236.118.82:8080");
     localStorage.setItem('url',"http://localhost:8080");
>>>>>>> 1f523426fda7361cde4aba573a5e1c6bf9ccbc5e
    return (
      
      <div className="App">
        <Routes />
      </div>
    );
  }
}

export default App;