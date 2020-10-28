import React, { Component } from 'react';
import './Navigation.css';
import {Link} from 'react-router-dom';
import ModalCambioContraseña from '../Usuario/cambiarContraseña';

import Axios from 'axios';

class Navigation extends Component {

    state={
        estadoCambioContraseña: false
    }
    
    cambiarEstadoModalContraseña = () => {
        this.setState({
            estadoCambioContraseña : !this.state.estadoCambioContraseña
        })
    }
   
    render(){
      return(
        <div className="Navigation">
            <nav class="navbar navbar-expand-lg navi">
                <div style={{width : '10%', textAlign : 'center', marginRight : '16px'}}>
                    <Link className="navbar-brand sistema" to="/index">Sistema</Link>
                </div>
                

                <div class="collapse navbar-collapse" style={{marginLeft : 0}} id="navbarSupportedContent">
                    <ul class="navbar-nav mr-auto">
                    <li class="nav-item active">
                        <Link className="nav-link" to="/index">Home</Link>
                    </li>
                    
                    {this.props.celdas.map(celda => {
                        return(
                            <li class="nav-item">
                                <Link class="nav-link" to={celda.url}>{celda.nombre}</Link>
                            </li>
                        )
                    })}
                   
                    </ul>
                </div>

                <div className="desplegable text-center" >
                    <li class="nav-item dropdown">
                        <a class="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                            {localStorage.getItem('nombre')}
                        </a>
                        <div class="subMenu dropdown-menu" aria-labelledby="navbarDropdown">
                            <a class="dropdown-item" href="#" onClick={this.cambiarEstadoModalContraseña}>Cambiar Contraseña</a>
                            <Link className="dropdown-item" to="/logout">Cerrar Sesión</Link>
                        </div>
                    </li> 
                </div> 
            </nav>
                    
            <ModalCambioContraseña
                estadoCambioContraseña = {this.state.estadoCambioContraseña}
                cambiarEstadoContraseña = {this.cambiarEstadoModalContraseña}
            />
        </div>
        
      );
    }
}


export default Navigation;