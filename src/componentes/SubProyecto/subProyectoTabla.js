import React, { Component } from 'react'

export default class subProyectoTabla extends Component {
    render(){
        return(
            <div>
                <table className="table table-hover">
                        <thead>
                            <tr>
                            <th scope="col">ID</th>
                            <th scope="col">Nombre</th>
                            <th scope="col">Fecha de Inicio</th>
                            <th scope="col">Fecha de Termino</th>
                            <th scope="col">ID Proyecto</th>
                            <th scope="col">Tipo Proyecto</th>
                            <th scope="col">ID Usuario</th>
                            <th scope="col">Acciones</th>

                            </tr>
                        </thead>
                        <tbody>
                            {this.props.subProyectos.map(subProyecto => {
                                return(
                                    <tr>
                                        <td scope="col">{subProyecto.id_subProyecto}</td>
                                        <td>{subProyecto.nombre_subProyecto}</td>
                                        <td>{subProyecto.fecha_inicio}</td>
                                        <td>{subProyecto.fecha_fin}</td>
                                        <td>{subProyecto.id_proyecto}</td>
                                        <td>{subProyecto.tipo_subProyecto}</td>
                                        <td>{subProyecto.id_usuario}</td>
                                        <td>
                                            <button type="button" className="btn btn-warning" data-toggle="modal" data-target="#modalEditar" onClick={() => this.props.obtenerSubProyecto(subProyecto)}>Editar</button> &nbsp;
                                            <button type="button" className="btn btn-danger" data-toggle="modal" data-target="#modalEditar" onClick={() => this.props.cambiarEstadoEliminar(subProyecto)}>Eliminar</button>
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