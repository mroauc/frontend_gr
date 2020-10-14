import React, { Component } from 'react'

class TablaPropuestaCambio extends Component{
    render(){
        return(
            <div>
                <table className="table table-hover">
                    <thead>
                        <tr>
                            <th scope="col">#</th>
                            <th scope="col">Nombre</th>
                            <th scope="col">Fecha Peticion</th>
                            <th scope="col">Modulo</th>
                            <th scope="col">Estado</th>
                            <th scope="col">Ver</th>
                            <th scope="col">Editar</th>
                            <th scope="col">Eliminar</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.props.propuestas.map((propuesta,index)=>{
                            return(
                                <tr key={propuesta.id_propuestaCambio}>
                                    <td>{index+1}</td>
                                    <td>{propuesta.nombre}</td>
                                    <td>{propuesta.fecha_peticion}</td>
                                    <td>{propuesta.id_modulo}</td>
                                    <td>{propuesta.estado}</td>
                                    <td>
                                        <button className="btn btn-success" onClick={()=>this.props.verPropuesta(propuesta)}>Ver</button>
                                    </td>
                                    <td>
                                        <button className="btn btn-warning" onClick={()=>this.props.editar(propuesta)}>Editar</button>
                                    </td>
                                    <td>
                                        <button className="btn btn-danger" onClick={()=>this.props.modalEliminar(propuesta)}>Eliminar</button>
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

export default TablaPropuestaCambio;