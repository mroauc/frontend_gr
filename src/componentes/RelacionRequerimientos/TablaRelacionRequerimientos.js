import React, { Component } from 'react'

class TablaRelacionRequerimientos extends Component{
    render(){
        return(
            <div>
                <table className="table table-hover">
                    <thead>
                        <tr>
                            <th scope="col">#</th>
                            <th scope="col">ID Requerimiento A</th>
                            <th scope="col">ID Requerimiento B</th>
                            <th scope="col">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.props.relaciones.map((relacion,index)=>{
                            return(
                                <tr key={relacion.id_relacionRequerimientos}>
                                    <td>{index+1}</td>
                                    <td>{relacion.id_requerimiento_a}</td>
                                    <td>{relacion.id_requerimiento_b}</td>
                                    <td>
                                        <button className="btn btn-warning" onClick={()=>this.props.editar(relacion)}>Editar</button> &nbsp;
                                        <button className="btn btn-danger" onClick={()=>this.props.modalEliminar(relacion)}>Eliminar</button>
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

export default TablaRelacionRequerimientos;