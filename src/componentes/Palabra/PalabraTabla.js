import React, { Component } from 'react'

export default class ComentarioTabla extends Component {
    render(){
        return(
            <div>
                <table class="table table-hover">
                        <thead>
                            <tr>
                            <th scope="col">ID</th>
                            <th scope="col">Palabra</th>
                            <th scope="col">Significado</th>
                            <th scope="col">ID Glosario</th>
                            <th scope="col">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.props.palabras.map(palabra => {
                                return(
                                    <tr>
                                        <td scope="col">{palabra.id_palabra}</td>
                                        <td>{palabra.palabra}</td>
                                        <td>{palabra.significado}</td>
                                        <td>{palabra.id_glosario}</td>

                                        <td>
                                            <button type="button" class="btn btn-warning" data-toggle="modal" data-target="#modalEditar" onClick={() => this.props.obtenerPalabra(palabra)}>Editar</button> &nbsp;
                                            <button type="button" class="btn btn-danger" data-toggle="modal" data-target="#modalEditar" onClick={() => this.props.cambiarEstadoEliminar(palabra)}>Eliminar</button>
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