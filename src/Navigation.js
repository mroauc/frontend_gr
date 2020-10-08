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
                    <li class="nav-item">
                        <Link class="nav-link" to="/Comentarios">Comentarios</Link>
                    </li>
                    <li class="nav-item">
                        <Link class="nav-link" to="/subProyectos">subProyectos</Link>
                    </li>
                    <li class="nav-item">
                        {/* <a class="nav-link" href="#">Glosario</a> */}
                        <Link class="nav-link" to="/empresas">Empresas</Link>
                    </li>
                    <li class="nav-item">
                        <Link class="nav-link" to="/clientes">Clientes</Link>
                    </li>
                    <li class="nav-item">
                        <Link class="nav-link" to="/glosarios">Glosarios</Link>
                    </li>
                    <li class="nav-item">
                        <Link class="nav-link" to="/palabras">Palabras</Link>
                    </li>

                    <li class="nav-item">
                        <Link class="nav-link" to="/Comentarios2">Comentarios2</Link>
                    </li>
                    
    
                    <li class="nav-item dropdown">
                        <a class="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                        Dropdown
                        </a>
                        <div class="dropdown-menu" aria-labelledby="navbarDropdown">
                        <a class="dropdown-item" href="#">Ejemplo 1</a>
                        <a class="dropdown-item" href="#">Ejemplo 2</a>
                        <div class="dropdown-divider"></div>
                        <a class="dropdown-item" href="#">Something else here</a>
                        </div>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link disabled" href="#">Ejemplo 3</a>
                    </li>
                    </ul>
                    
                </div>
                </nav>
        </div>
        
      );
    }
}


export default Navigation;