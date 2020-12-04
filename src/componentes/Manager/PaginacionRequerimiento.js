import React, { Component } from 'react'

let numerosBarra = [];

export default class PaginacionRequerimiento extends Component {

    render(){
        numerosBarra = [];
        for (let i = 1; i <= Math.ceil(this.props.cantidadDeDatos/this.props.cantidadPorPagina) ; i++) {
            numerosBarra.push(i);   
        }
        
        return(
            <nav style={{marginTop:'10px'}}>
                <ul className="pagination justify-content-center">
                    {numerosBarra.map(numero => (
                        <li key={numero} className={this.props.paginaActual===numero ? "active page-item" : "page-item"}>
                            <a href="#" className="page-link" onClick={() => {this.props.cambiarPaginaActual(numero)}} >
                                {numero}
                            </a>
                        </li>
                    ))}
                </ul>
            </nav>
        );
    }
}