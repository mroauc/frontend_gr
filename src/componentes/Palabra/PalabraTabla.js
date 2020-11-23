import React, { Component } from 'react';
import VisibilityIcon from '@material-ui/icons/Visibility';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';

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
                                            <button type="button" className="btn btn-success" data-toggle="modal" data-target="#modalEditar" onClick={() => this.props.verPalabra(palabra)}><VisibilityIcon/></button> &nbsp;
                                            <button type="button" className="btn btn-warning" data-toggle="modal" data-target="#modalEditar" onClick={() => this.props.obtenerPalabra(palabra)}><EditIcon/></button> &nbsp;
                                            <button type="button" className="btn btn-danger" data-toggle="modal" data-target="#modalEditar" onClick={() => this.props.cambiarEstadoEliminar(palabra)}><DeleteIcon/></button>
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