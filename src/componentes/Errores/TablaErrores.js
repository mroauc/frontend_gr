import React, { Component } from 'react'

export class TablaErrores extends Component{
    render(){
        return(
            <div>
                <table className="table table-hover">
                    <thead>
                        <tr>
                            <th scope="col">#</th>
                            <th scope="col">Error</th>
                            <th scope="col">Usuario</th>
                            <th scope="col">Fecha Creacion</th>
                            <th scope="col">Editar</th>
                            <th scope="col">Eliminar</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.props.errores.map((singleError,index)=>{
                            return(
                                <tr key={singleError.id_error}>
                                    <td>{index+1}</td>
                                    <td>{singleError.contenido}</td>
                                    <td>{singleError.id_usuario}</td>
                                    <td>{singleError.fecha}</td>
                                    <td>
                                        <button className="btn btn-warning" onClick={()=>this.props.editar(singleError)}>Editar</button>
                                    </td>
                                    <td>
                                        <button className="btn btn-danger" onClick={()=>this.props.modalEliminar(singleError)}>Eliminar</button>
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

export default TablaErrores;