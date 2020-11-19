import React, { Component } from 'react'

export default class ComentarioTabla extends Component {
    render(){
        return(
            <div>
                <table className="table table-hover">
                        <thead>
                            <tr>
                            <th scope="col">#</th>
                            <th scope="col">Palabra</th>
                            <th scope="col">ID Proyecto</th>
                            <th scope="col">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.props.palabras.map((palabra, index) => {
                                return(
                                    <tr key={palabra.id_palabra}>
                                        <td scope="col">{index+1}</td>
                                        <td>{palabra.palabra}</td>
                                        <td>{palabra.id_proyecto}</td>

                                        <td>
                                            <button type="button" className="btn btn-success" data-toggle="modal" data-target="#modalEditar" onClick={() => this.props.verPalabra(palabra)}>Ver</button> &nbsp;
                                            <button type="button" className="btn btn-warning" data-toggle="modal" data-target="#modalEditar" onClick={() => this.props.obtenerPalabra(palabra)}>Editar</button> &nbsp;
                                            <button type="button" className="btn btn-danger" data-toggle="modal" data-target="#modalEditar" onClick={() => this.props.cambiarEstadoEliminar(palabra)}>Eliminar</button>
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