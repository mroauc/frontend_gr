import React, { Component } from 'react';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';

export default class EmpresaTabla extends Component {
    render(){
        return(
            <div>
                <table className="table table-hover"> 
                        <thead>
                            <tr>
                            <th scope="col">#</th>
                            <th scope="col">Razon Social</th>
                            <th scope="col">RUT</th>
                            <th scope="col">representante</th>
                            <th scope="col">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.props.empresas.map((empresa, index) => {
                                return(
                                    <tr key={empresa.id_empresa}>
                                        <td scope="col">{index+1}</td>
                                        <td>{empresa.razon_social}</td>
                                        <td>{empresa.rut_empresa}</td>
                                        <td>{empresa.representante}</td>
                                        <td>
                                            <button type="button" className="btn btn-warning" data-toggle="modal" data-target="#modalEditar" onClick={() => this.props.obtenerEmpresa(empresa)}><EditIcon/></button> &nbsp;
                                            <button type="button" className="btn btn-danger" data-toggle="modal" data-target="#modalEditar" onClick={() => this.props.cambiarEstadoEliminar(empresa)}><DeleteIcon/></button>
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