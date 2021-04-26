import React, { Component } from 'react'
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import ChatIcon from '@material-ui/icons/Chat';
import Paginacion from '../Paginacion';
import FiltroRequerimiento from './FiltroRequerimiento';

class TablaRequerimiento extends Component{

    state={
        paginaActual: 1,
        cantidadPorPagina: 5,
        requerimientos: []
    }

    cambiarPaginaActual = (n_pagina) => {
        this.setState({paginaActual: n_pagina});
    }

    componentWillReceiveProps(next_props){
        this.setState({requerimientos : next_props.requerimientos})
    }

    BuscarRequerimiento = (e) =>{
        FiltroRequerimiento(this.props.requerimientos, e.target.value, this.CambiarRequerimientos);
        this.cambiarPaginaActual(1);
    }

    CambiarRequerimientos=(nuevosRequerimientos)=>{
        this.setState({requerimientos: nuevosRequerimientos});
    }

    render(){
        const ultimoDato = this.state.paginaActual * this.state.cantidadPorPagina;
        const primerDato = ultimoDato - this.state.cantidadPorPagina;
        const datosActuales = this.state.requerimientos.slice(primerDato, ultimoDato);

        if(datosActuales.length===0 && this.state.paginaActual!==1){
            this.cambiarPaginaActual(1);
        }

        return(
            <div>
                <input className="form-control input-filtrarTabla" placeholder="Buscar"  onChange={this.BuscarRequerimiento}></input>
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
                    (this.state.requerimientos.length <= this.state.cantidadPorPagina)
                    ?
                        ""
                    :
                        <Paginacion
                            cambiarPaginaActual = {this.cambiarPaginaActual}
                            cantidadPorPagina = {this.state.cantidadPorPagina}
                            cantidadDeDatos = {this.state.requerimientos.length}
                            paginaActual = {this.state.paginaActual} 
                        />
                }
            </div>
        );
    }
}

export default TablaRequerimiento;