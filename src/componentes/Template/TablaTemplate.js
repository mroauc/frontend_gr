import React, { Component } from 'react';
import VisibilityIcon from '@material-ui/icons/Visibility';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';

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
                            <th scope="col">Acciones</th>
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
                                        <button className="btn btn-success" onClick={()=>this.props.verTemplate(template)}><VisibilityIcon/></button> &nbsp;
                                        <button className="btn btn-warning" onClick={()=>this.props.editar(template)}><EditIcon/></button> &nbsp;
                                        <button className="btn btn-danger" onClick={()=>this.props.modalEliminar(template)}><DeleteIcon/></button>
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