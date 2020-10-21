import React, {Component} from 'react';
import './DashboardAdmin.css'
import {Link} from 'react-router-dom';

class DashboardAdmin extends Component{

    render(){
        return(
            <div className="sistema">
                <nav class="navbar navbar-expand-lg navi">
                    <div style={{width : 'auto', textAlign : 'center', marginRight : '16px'}}>
                        <Link className="navbar-brand sistema" to="/index">Bienvenido</Link>
                    </div>
                    <div >
                        <ul class="navbar-nav mr-auto">
                            <li className="nav-item">
                                <Link className="nav-link" to="/templates">Templates</Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" to="/error">Errores</Link>
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

export default DashboardAdmin;