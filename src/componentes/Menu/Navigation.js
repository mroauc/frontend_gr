import Axios from 'axios';
import React, { Component } from 'react';
import './Navigation.css';
import {Link} from 'react-router-dom';
import ModalCambioContraseña from '../Usuario/cambiarContraseña';
import logoUCM from '../../imgs/UCM.png'
import ModalCambioColor from '../Usuario/cambiarColor';

class Navigation extends Component {

    state={
        celdaSeleccionada: 'Home',
        estadoCambioContraseña: false,
        estadoCambioColor: false
    }
    
    cambiarEstadoModalContraseña = () => {
        this.setState({
            estadoCambioContraseña : !this.state.estadoCambioContraseña
        })
    }

    cambiarEstadoModalColor=()=>{
        this.setState({
            estadoCambioColor: !this.state.estadoCambioColor
        })
    }

    seleccionarCelda = (nombre_celda) => {
        localStorage.setItem("celda",nombre_celda);
    }

    menu = (nombre) => {
        if(localStorage.getItem("celda").includes(nombre)){
            return "seleccionado"
        } 
        else{
            return ""
        }
    }
   
    render(){
      return(
        <div className="Navigation">
            <nav className="navbar navbar-expand-lg navi">
                <div style={{width : '10%', textAlign : 'center', marginRight : '16px'}} onClick={() => {this.seleccionarCelda("Home")}}>
                    <Link className= {"navbar-brand sistema "+ this.menu("Sistema")} to="/index"><img src={logoUCM} style={{width: '80%'}}></img></Link>
                </div>
                

                <div className="collapse navbar-collapse" style={{marginLeft : 0}} id="navbarSupportedContent">
                    <ul className="navbar-nav mr-auto">

                    <Link style={{textDecoration: 'none'}} to="/index" onClick={() => {this.seleccionarCelda("Home")}}>
                        <li className={"nav-item active " + this.menu("Home")}>
                            <a className="nav-link" to="/index">Home</a>
                        </li> 
                    </Link>
                     
                    {this.props.celdas.map(celda => {
                        return(
                            <Link style={{textDecoration: 'none'}} to={celda.url}>
                                <li style={{zIndex:100}} className={"nav-item " + this.menu(celda.nombre)} id={celda.nombre} onClick={() => {this.seleccionarCelda(celda.nombre)}}>
                                    <a className="nav-link" to={celda.url}>{celda.nombre}</a>
                                </li>
                            </Link>
                        )
                    })}
                   
                    </ul>
                </div>

                <div className="desplegable text-center" >
                    <li className="nav-item dropdown">
                        <a className="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                            {localStorage.getItem('nombre')}
                        </a>
                        <div className="subMenu dropdown-menu" aria-labelledby="navbarDropdown">
                            <a className="dropdown-item" href="#" onClick={this.cambiarEstadoModalContraseña}>Cambiar Contraseña</a>
                            <a className="dropdown-item" href="#" onClick={this.cambiarEstadoModalColor}>Personalizar Color</a>
                            <Link className="dropdown-item" to="/logout">Cerrar Sesión</Link>
                        </div>
                    </li> 
                </div> 
            </nav>
                    
            <ModalCambioContraseña
                estadoCambioContraseña = {this.state.estadoCambioContraseña}
                cambiarEstadoContraseña = {this.cambiarEstadoModalContraseña}
            />

            <ModalCambioColor
                estadoCambiarColor={this.state.estadoCambioColor}
                cambiarEstadoModalColor={this.cambiarEstadoModalColor}
            />

        </div>
        
      );
    }
}


export default Navigation;