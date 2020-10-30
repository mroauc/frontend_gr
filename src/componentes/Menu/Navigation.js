import React, { Component } from 'react';
import './Navigation.css';
import {Link} from 'react-router-dom';
import ModalCambioContraseña from '../Usuario/cambiarContraseña';

import Axios from 'axios';

class Navigation extends Component {

    state={
        celdaSeleccionada: 'Home',
        estadoCambioContraseña: false
    }
    
    cambiarEstadoModalContraseña = () => {
        this.setState({
            estadoCambioContraseña : !this.state.estadoCambioContraseña
        })
    }

    seleccionarCelda = (nombre_celda) => {
        console.log(nombre_celda);
        localStorage.setItem("celda",nombre_celda);
    }

    menu = (nombre) => {
        if(localStorage.getItem("celda").includes(nombre)){
            console.log("queeeee");
            return "seleccionado"
        } 
        else{
            return ""
        }
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

                    <Link style={{textDecoration: 'none'}} to="/index" onClick={() => {this.seleccionarCelda("Home")}}>
                        <li class={"nav-item active " + this.menu("Home")}>
                            <a className="nav-link" to="/index">Home</a>
                        </li> 
                    </Link>
                     
                    {this.props.celdas.map(celda => {
                        return(
                            <Link style={{textDecoration: 'none'}} to={celda.url}>
                                <li style={{zIndex:100}} class={"nav-item " + this.menu(celda.nombre)} id={celda.nombre} onClick={() => {this.seleccionarCelda(celda.nombre)}}>
                                    <a class="nav-link" to={celda.url}>{celda.nombre}</a>
                                </li>
                            </Link>
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