import React, { Component } from 'react';
import VisibilityIcon from '@material-ui/icons/Visibility';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import Paginacion from '../Paginacion';
import FiltroPalabra from './FiltroPalabra'

export default class ComentarioTabla extends Component {

    state={
        paginaActual: 1,
        cantidadPorPagina: 5,
        palabras: []
    }

    cambiarPaginaActual = (n_pagina) => {
        this.setState({paginaActual: n_pagina});
    }

    componentWillReceiveProps(next_props){
        this.setState({palabras : next_props.palabras})
    }

    BuscarPalabra = (e) => {
        FiltroPalabra(this.props.palabras, e.target.value,this.CambiarPalabras);
        this.cambiarPaginaActual(1)
    }

    CambiarPalabras = (nuevasPalabras) => {
        this.setState({palabras : nuevasPalabras})
    }

    insertarSignificado=(significado)=>{
        var largo = significado.length;
        var signific = significado.substr(0,95);

        if(largo>95){
            signific = signific.substr(0.,92);
            signific = signific + "...";
        }

        return signific;
    }

    render(){

        const ultimoDato = this.state.paginaActual * this.state.cantidadPorPagina;
        const primerDato = ultimoDato - this.state.cantidadPorPagina;
        const datosActuales = this.state.palabras.slice(primerDato, ultimoDato);

        return(
            <div>
                <input className="form-control input-filtrarTabla" placeholder="Buscar"  onChange={this.BuscarPalabra}></input>
                <table className="table table-hover">
                        <thead>
                            <tr>
                            <th scope="col">#</th>
                            <th scope="col">Palabra</th>
                            <th scope="col">Significado</th>
                            <th scope="col">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {datosActuales.map((palabra, index) => {
                                return(
                                    <tr key={palabra.id_palabra}>
                                        <td scope="col">{index+1 + (this.state.cantidadPorPagina * (this.state.paginaActual-1))}</td>
                                        <td>{palabra.palabra}</td>
                                        <td>{this.insertarSignificado(palabra.significado)}</td>

                                        <td>
                                            <button type="button" className="btn btn-success" data-toggle="modal" data-target="#modalEditar" onClick={() => this.props.verPalabra(palabra)}><VisibilityIcon/></button> &nbsp;
                                            <button type="button" className="btn btn-warning" data-toggle="modal" data-target="#modalEditar" onClick={() => this.props.obtenerPalabra(palabra)}><EditIcon/></button> &nbsp;
                                            <button type="button" className="btn btn-danger" data-toggle="modal" data-target="#modalEditar" onClick={() => this.props.cambiarEstadoEliminar(palabra)}><DeleteIcon/></button>
                                        </td>

                                    </tr>
                                )
                            })}
                        
                        </tbody>
                    </table>
                    {
                        (this.state.palabras.length <= this.state.cantidadPorPagina)
                        ?
                            ""
                        :
                            <Paginacion
                                cambiarPaginaActual = {this.cambiarPaginaActual}
                                cantidadPorPagina = {this.state.cantidadPorPagina}
                                cantidadDeDatos = {this.state.palabras.length}
                                paginaActual = {this.state.paginaActual} 
                            />
                    }
            </div>
        );
    }
}