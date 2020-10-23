import React, { Component } from 'react';
import './Navigation.css';
import {Link} from 'react-router-dom';

class Navigation extends Component {

   
    render(){
      return(
        <div className="Navigation">
            <nav class="navbar navbar-expand-lg navi">
                <div style={{width : '10%', textAlign : 'center', marginRight : '16px'}}>
                    <Link className="navbar-brand sistema" to="/">Sistema</Link>
                </div>
                

                <div class="collapse navbar-collapse" style={{marginLeft : 0}} id="navbarSupportedContent">
                    <ul class="navbar-nav mr-auto">
                    <li class="nav-item active">
                        <Link className="nav-link" to="/">Home</Link>
                    </li>
                    
                    {this.props.celdas.map(celda => {
                        return(
                            <li class="nav-item">
                                <Link class="nav-link" to={celda.url}>{celda.nombre}</Link>
                            </li>
                        )
                    })}
                   
                    </ul>
                    <div className="text-center" style={{position:'absolute', right:'10px'}}>
                        <Link to="/logout" className="btn btn-outline-primary">Cerrar Sesion</Link>
                    </div>  
                    
                </div>
                </nav>
        </div>
        
      );
    }
}


export default Navigation;