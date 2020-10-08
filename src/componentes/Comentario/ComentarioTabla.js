import React, { Component } from 'react'

export default class ComentarioTabla extends Component {
    render(){
        return(
            <div>
                <table class="table table-hover">
                        <thead>
                            <tr>
                            <th scope="col">ID</th>
                            <th scope="col">Comentario</th>
                            <th scope="col">ID Requermiento</th>
                            <th scope="col">ID Usuario</th>
                            <th scope="col">Fecha</th>
                            <th scope="col">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.props.comentarios.map(comentario => {
                                return(
                                    <tr>
                                        <td scope="col">{comentario.id_comentario}</td>
                                        <td>{comentario.texto}</td>
                                        <td>{comentario.id_requerimiento}</td>
                                        <td>{comentario.id_usuario}</td>
                                        <td>{comentario.fecha_ingreso}</td>
                                        <td>
                                            <button type="button" class="btn btn-warning" data-toggle="modal" data-target="#modalEditar" onClick={() => this.props.obtenerComentario(comentario)}>Editar</button> &nbsp;
                                            <button type="button" class="btn btn-danger" data-toggle="modal" data-target="#modalEditar" onClick={() => this.props.cambiarEstadoEliminar(comentario)}>Eliminar</button>
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
