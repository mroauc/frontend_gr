import React, { Component } from 'react'

class TablaTemplate extends Component{
    
    render(){
        return(
            <div>
                <table className="table table-hover">
                    <thead>
                        <tr>
                            <th scope="col">#</th>
                            <th scope="col">Nombre</th>
                            <th scope="col">Tipo</th>
                            <th scope="col">Fecha de Creacion</th>
                            <th scope="col">Ver</th>
                            <th scope="col">Editar</th>
                            <th scope="col">Eliminar</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.props.templates.map((template,index)=>{
                            return(
                                <tr key={template.id_template}>
                                    <td>{index+1}</td>
                                    <td>{template.nombre}</td>
                                    <td>{template.tipo}</td>
                                    <td>{template.fecha}</td>
                                    <td>
                                        <button className="btn btn-success" onClick={()=>this.props.verTemplate(template)}>Ver</button>
                                    </td>
                                    <td>
                                        <button className="btn btn-warning" onClick={()=>this.props.editar(template)}>Editar</button>
                                    </td>
                                    <td>
                                        <button className="btn btn-danger" onClick={()=>this.props.modalEliminar(template)}>Eliminar</button>
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

export default TablaTemplate;