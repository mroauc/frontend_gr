import React, { Component } from 'react'
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import ChatIcon from '@material-ui/icons/Chat';
import Paginacion from '../Paginacion';

class TablaRequerimiento extends Component{

    state={
        paginaActual: 1,
        cantidadPorPagina: 5
    }

    cambiarPaginaActual = (n_pagina) => {
        this.setState({paginaActual: n_pagina});
    }

    render(){
        const ultimoDato = this.state.paginaActual * this.state.cantidadPorPagina;
        const primerDato = ultimoDato - this.state.cantidadPorPagina;
        const datosActuales = this.props.requerimientos.slice(primerDato, ultimoDato);

        return(
            <div>
                <table className="table table-hover">
                    <thead>
                        <tr>
                            <th scope="col">#</th>
                            <th scope="col">Nombre</th>
                            <th scope="col">ID Usuario</th>
                            <th scope="col">Fecha de Creacion</th>
                            <th scope="col">Prioridad</th>
                            <th scope="col">Estado</th>
                            <th scope="col">Categoria</th>
                            <th scope="col">ID Template</th>
                            <th scope="col">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {datosActuales.map((requerimiento,index)=>{
                            return(
                                <tr key={requerimiento.id_requerimiento}>
                                    <td>{index+1 + (this.state.cantidadPorPagina * (this.state.paginaActual-1))}</td>
                                    <td>{requerimiento.nombre}</td>
                                    <td>{requerimiento.id_usuario}</td>
                                    <td>{requerimiento.fecha_creacion}</td>
                                    <td>{requerimiento.prioridad}</td>
                                    <td>{requerimiento.estado}</td>
                                    <td>{requerimiento.categoria}</td>
                                    <td>{requerimiento.id_template}</td>
                                    <td>
                                        <button className="btn btn-success" onClick={()=>this.props.redactar(requerimiento)}><ChatIcon/></button> &nbsp;
                                        <button className="btn btn-warning" onClick={()=>this.props.editar(requerimiento)}><EditIcon/></button> &nbsp;
                                        <button className="btn btn-danger" onClick={()=>this.props.modalEliminar(requerimiento)}><DeleteIcon/></button>
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
                {
                    (this.props.requerimientos.length <= this.state.cantidadPorPagina)
                    ?
                        ""
                    :
                        <Paginacion
                            cambiarPaginaActual = {this.cambiarPaginaActual}
                            cantidadPorPagina = {this.state.cantidadPorPagina}
                            cantidadDeDatos = {this.props.requerimientos.length}
                            paginaActual = {this.state.paginaActual} 
                        />
                }
            </div>
        );
    }
}

export default TablaRequerimiento;