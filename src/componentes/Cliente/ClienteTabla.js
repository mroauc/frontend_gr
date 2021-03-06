import Axios from 'axios';
import React, { Component } from 'react';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import Paginacion from '../Paginacion';
import FiltroCliente from './FiltroCliente'

export default class ClienteTabla extends Component {
    
    state={
        usuarios: [],
        paginaActual: 1,
        cantidadPorPagina: 3,
        clientes : []
    }

    cambiarPaginaActual = (n_pagina) => {
        this.setState({paginaActual: n_pagina});
    }

    componentWillReceiveProps(next_props){
        this.setState({clientes : next_props.clientes})
    }

    BuscarCliente = (e) => {
        FiltroCliente(this.props.clientes,this.state.usuarios, e.target.value,this.CambiarClientes);
        this.cambiarPaginaActual(1)
    }

    CambiarClientes = (nuevosClientes) => {
        this.setState({clientes : nuevosClientes})
    }

    buscarUsuario=(id_usuario)=>{
        for (let index = 0; index < this.state.usuarios.length; index++) {
            if(this.state.usuarios[index].id===id_usuario){
                return this.state.usuarios[index].nombre;
            }
            if(index === this.state.usuarios.length-1){
                this.getUsuarios();
            }
        }
        return '';
    }

    getUsuarios = () =>{
        const token = localStorage.getItem('token');
        Axios.get(localStorage.getItem('url')+'/api/usuario/',{headers: {"Authorization": `Bearer ${token}`}})
        .then(response=>{
            this.setState({
                usuarios: response.data
            });
        })
    }

    componentDidMount(){
       this.getUsuarios();
    }
    
    render(){

        const ultimoDato = this.state.paginaActual * this.state.cantidadPorPagina;
        const primerDato = ultimoDato - this.state.cantidadPorPagina;
        const datosActuales = this.state.clientes.slice(primerDato, ultimoDato);

        return(
            <div>
                <input className="form-control input-filtrarTabla" placeholder="Buscar"  onChange={this.BuscarCliente}></input>
                <table className="table table-hover">
                    <thead>
                        <tr>
                            <th scope="col">#</th>
                            <th scope="col">Celular</th>
                            <th scope="col">ID Empresa</th>
                            <th scope="col">User</th>
                            <th scope="col">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {datosActuales.map((cliente,index) => {
                            return(
                                <tr key={cliente.id_cliente}>
                                    <td>{index+1 + (this.state.cantidadPorPagina * (this.state.paginaActual-1))}</td>
                                    <td>{cliente.celular}</td>
                                    <td>{cliente.id_empresa}</td>
                                    <td>{this.buscarUsuario(cliente.id_user)}</td> 
                                    <td>
                                        <button type="button" className="btn btn-warning" data-toggle="modal" data-target="#modalEditar" onClick={() => this.props.obtenerCliente(cliente)}><EditIcon/></button> &nbsp;
                                        <button type="button" className="btn btn-danger" data-toggle="modal" data-target="#modalEditar" onClick={() => this.props.cambiarEstadoEliminar(cliente)}><DeleteIcon/></button>
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
                {
                    (this.state.clientes.length <= this.state.cantidadPorPagina)
                    ?
                        ""
                    :
                        <Paginacion
                            cambiarPaginaActual = {this.cambiarPaginaActual}
                            cantidadPorPagina = {this.state.cantidadPorPagina}
                            cantidadDeDatos = {this.state.clientes.length}
                            paginaActual = {this.state.paginaActual} 
                        />
                }
            </div>
        );
    }
}