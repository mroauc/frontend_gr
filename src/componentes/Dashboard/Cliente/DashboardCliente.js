import React, {Component} from 'react';
import './DashboardCliente.css';
import {Link} from 'react-router-dom';

class DashboardCliente extends Component{

    render(){
        return(
            <div className="sistema">
                <nav class="navbar navbar-expand-lg navi">
                    <div style={{width : 'auto', textAlign : 'center', marginRight : '16px'}}>
                        <Link className="navbar-brand sistema" to="/indexCliente">Sistema</Link>
                    </div>
                    <div >
                        <ul class="navbar-nav mr-auto">
                            <li className="nav-item">
                                <Link className="nav-link" to="/indexCliente">Home</Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" to="/proyectos">Proyectos</Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" to="/errores">Envio Errores</Link>
                            </li>
                        </ul>
                    </div>
                    <div className="text-center" style={{position:'absolute', right:'10px'}}>
                        <Link to="/logout" className="btn btn-outline-primary">Cerrar Sesion</Link>
                    </div>
                </nav>
            </div>
        );
    }
}

export default DashboardCliente;