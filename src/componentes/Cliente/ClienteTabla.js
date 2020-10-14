import React, { Component } from 'react'

export default class ClienteTabla extends Component {
    render(){
        return(
            <div>
                <table class="table table-hover">
                        <thead>
                            <tr>
                                <th scope="col">ID</th>
                                <th scope="col">Celular</th>
                                <th scope="col">ID Empresa</th>
                                <th scope="col">ID User</th>
                                <th scope="col">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.props.clientes.map(cliente => {
                                return(
                                    <tr>
                                        <td scope="col">{cliente.id_cliente}</td>
                                        <td>{cliente.celular}</td>
                                        <td>{cliente.id_empresa}</td>
                                        <td>{cliente.id_user}</td>
                                        <td>
                                            <button type="button" class="btn btn-warning" data-toggle="modal" data-target="#modalEditar" onClick={() => this.props.obtenerCliente(cliente)}>Editar</button> &nbsp;
                                            <button type="button" class="btn btn-danger" data-toggle="modal" data-target="#modalEditar" onClick={() => this.props.cambiarEstadoEliminar(cliente)}>Eliminar</button>
                                        </td>

                                    </tr>
                                )
                            })}
                        
                        </tbody>
                    </table>
            </div>
        );
    }
}