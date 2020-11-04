import React, { Component } from 'react'

class TablaRequerimiento extends Component{
    render(){
        return(
            <div>
                <table className="table table-hover">
                    <thead>
                        <tr>
                            <th scope="col">#</th>
                            <th scope="col">Descripcion</th>
                            <th scope="col">ID Usuario</th>
                            <th scope="col">ID Sub-Proyecto</th>
                            <th scope="col">Fecha de Creacion</th>
                            <th scope="col">Prioridad</th>
                            <th scope="col">Estado</th>
                            <th scope="col">Categoria</th>
                            <th scope="col">ID Template</th>
                            <th scope="col">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.props.requerimientos.map((requerimiento,index)=>{
                            return(
                                <tr key={requerimiento.id_requerimiento}>
                                    <td>{index+1}</td>
                                    <td>{requerimiento.descripcion}</td>
                                    <td>{requerimiento.id_usuario}</td>
                                    <td>{requerimiento.id_subProyecto}</td>
                                    <td>{requerimiento.fecha_creacion}</td>
                                    <td>{requerimiento.prioridad}</td>
                                    <td>{requerimiento.estado}</td>
                                    <td>{requerimiento.categoria}</td>
                                    <td>{requerimiento.id_template}</td>
                                    <td>
                                        <button className="btn btn-success" onClick={()=>this.props.redactar(requerimiento)}>Redactar</button> &nbsp;
                                        <button className="btn btn-warning" onClick={()=>this.props.editar(requerimiento)}>Editar</button> &nbsp;
                                        <button className="btn btn-danger" onClick={()=>this.props.modalEliminar(requerimiento)}>X</button>
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

export default TablaRequerimiento;