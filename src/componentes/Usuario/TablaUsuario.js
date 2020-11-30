import React, { Component } from 'react';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import Paginacion from '../Paginacion';
import FiltroUsuario from './FiltroUsuario';
import SearchIcon from '@material-ui/icons/Search';
import './Usuarios.css';
import '../vistaCrud.css';
import SearchIcon from '@material-ui/icons/Search';

class TablaUsuario extends Component{

    state={
        paginaActual: 1,
        cantidadPorPagina: 5,
        usuarios : [],
    }

    cambiarPaginaActual = (n_pagina) => {
        this.setState({paginaActual: n_pagina});
    }

    componentWillReceiveProps(next_props){
        this.setState({usuarios : next_props.usuarios})
        console.log(next_props)
    }

    BuscarUsuario = (e) => {
        FiltroUsuario(this.props.usuarios, e.target.value,this.CambiarUsuarios);
        this.cambiarPaginaActual(1)
    }

    CambiarUsuarios = (nuevosUsuarios) => {
        this.setState({usuarios : nuevosUsuarios})
    }


    render(){
        const ultimoDato = this.state.paginaActual * this.state.cantidadPorPagina;
        const primerDato = ultimoDato - this.state.cantidadPorPagina;
        const datosActuales = this.state.usuarios.slice(primerDato, ultimoDato); // Cambiar el props de la entidad

        if(datosActuales.length===0 && this.state.paginaActual!==1){
            this.cambiarPaginaActual(1);
        }

        return(
            <div>
<<<<<<< HEAD
                <input className="form-control input-filtrarTabla" placeholder="🔍 Buscar"  onChange={this.BuscarUsuario}></input>
=======
                <input className="form-control input-filtrarTabla" placeholder="buscar"  onChange={this.BuscarUsuario}></input>
>>>>>>> a55b8ef4b7859d84baadff74e5d07a6c14d5c2d4
                <table className="table table-hover">
                    <thead>
                        <tr>
                            <th scope="col">#</th>
                            <th scope="col">Nombre</th>
                            <th scope="col">Email</th>
                            <th scope="col">Tipo</th>
                            <th scope="col">Estado</th>
                            <th scope="col">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {datosActuales.map((usuario,index)=>{
                            return(
                                <tr key={usuario.id_usuario}>
                                    <td>{index+1 + (this.state.cantidadPorPagina * (this.state.paginaActual-1))}</td>
                                    <td>{usuario.nombre}</td>
                                    <td>{usuario.email}</td>
                                    <td>{usuario.tipo}</td>
                                    <td>{usuario.estado}</td>
                                    <td>
                                        <button className="btn btn-warning" onClick={()=>this.props.editar(usuario)}><EditIcon/></button> &nbsp;
                                        <button className="btn btn-danger" onClick={()=>this.props.modalEliminar(usuario)}><DeleteIcon/></button>
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
                {
                    (this.state.usuarios.length <= this.state.cantidadPorPagina)
                    ?
                        ""
                    :
                    <Paginacion
                        cambiarPaginaActual = {this.cambiarPaginaActual}
                        cantidadPorPagina = {this.state.cantidadPorPagina}
                        cantidadDeDatos = {this.state.usuarios.length}  // Cambiar el props de la entidad
                        paginaActual = {this.state.paginaActual} 
                    />
                }
            </div>
        );
    }
}

export default TablaUsuario;