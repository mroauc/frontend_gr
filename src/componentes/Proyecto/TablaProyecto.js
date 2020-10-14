import React, { Component } from 'react'

class TablaProyecto extends Component{
    render(){
        return(
            <div>
                <table className="table table-hover">
                    <thead>
                        <tr>
                            <th scope="col">#</th>
                            <th scope="col">Nombre</th>
                            <th scope="col">Jefe de Proyecto</th>
                            <th scope="col">Fecha de Creacion</th>
                            <th scope="col">Subproyectos Ingresados</th>
                            <th scope="col">Tipos de Subproyectos disponibles</th>
                            <th scope="col">Editar</th>
                            <th scope="col">Eliminar</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.props.proyectos.map((proyecto,index)=>{
                            return(
                                <tr key={proyecto.id_proyecto}>
                                    <td>{index+1}</td>
                                    <td>{proyecto.nombre}</td>
                                    <td>{proyecto.id_usuario}</td>
                                    <td>{proyecto.fecha_creacion}</td>
                                    <td></td>
                                    <td></td>
                                    <td>
                                        <button className="btn btn-warning" onClick={()=>this.props.editar(proyecto)}>Editar</button>
                                    </td>
                                    <td>
                                        <button className="btn btn-danger" onClick={()=>this.props.modalEliminar(proyecto)}>Eliminar</button>
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

export default TablaProyecto;