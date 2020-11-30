import Axios from 'axios';
import React, { Component } from 'react'
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import Paginacion from '../Paginacion';
import FiltroErrores from './FiltroErrores';

export class TablaErrores extends Component{

    state={
        usuarios: [],
        paginaActual: 1,
        cantidadPorPagina: 5,
        errores: []
    }

    cambiarPaginaActual = (n_pagina) => {
        this.setState({paginaActual: n_pagina});
    }

    componentWillReceiveProps(next_props){
        this.setState({errores : next_props.errores});
    }

    BuscarError=(e)=>{
        FiltroErrores(this.props.errores, e.target.value, this.CambiarErrores);
        this.cambiarPaginaActual(1);
    }

    CambiarErrores=(nuevosErrores)=>{
        this.setState({errores: nuevosErrores});
    }

    buscarUsuario=(id_usuario)=>{
        for (let index = 0; index < this.state.usuarios.length; index++) {
            if(this.state.usuarios[index].id===id_usuario){
                return this.state.usuarios[index].nombre;
            }
        }
        return '';
    }

    componentDidMount(){
        const token = localStorage.getItem('token');
        Axios.get('http://localhost:8080/api/usuario/',{headers: {"Authorization": `Bearer ${token}`}})
        .then(response=>{
            this.setState({
                usuarios: response.data
            });
        })
    }

    render(){
        const ultimoDato = this.state.paginaActual * this.state.cantidadPorPagina;
        const primerDato = ultimoDato - this.state.cantidadPorPagina;
        const datosActuales = this.state.errores.slice(primerDato, ultimoDato);

        if(datosActuales.length===0 && this.state.paginaActual!==1){
            this.cambiarPaginaActual(1);
        }

        return(
            <div>
                <input className="form-control input-filtrarTabla" placeholder="Buscar"  onChange={this.BuscarError}></input>
                <table className="table table-hover">
                    <thead>
                        <tr>
                            <th scope="col">#</th>
                            <th scope="col">Error</th>
                            <th scope="col">Usuario</th>
                            <th scope="col">Fecha Creacion</th>
                            <th scope="col">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {datosActuales.map((singleError,index)=>{
                            return(
                                <tr key={singleError.id_error}>
                                    <td>{index+1 + (this.state.cantidadPorPagina * (this.state.paginaActual-1))}</td>
                                    <td>{singleError.contenido}</td>
                                    <td>{this.buscarUsuario(singleError.id_usuario)}</td>
                                    <td>{singleError.fecha}</td>
                                    <td>
                                        <button className="btn btn-warning" onClick={()=>this.props.editar(singleError)}><EditIcon/></button> &nbsp;
                                        <button className="btn btn-danger" onClick={()=>this.props.modalEliminar(singleError)}><DeleteIcon/></button>
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
                {
                    (this.state.errores.length <= this.state.cantidadPorPagina)
                    ?
                        ""
                    :
                        <Paginacion
                            cambiarPaginaActual = {this.cambiarPaginaActual}
                            cantidadPorPagina = {this.state.cantidadPorPagina}
                            cantidadDeDatos = {this.state.errores.length}
                            paginaActual = {this.state.paginaActual} 
                        />
                }
            </div>
        );
    }
}

export default TablaErrores;