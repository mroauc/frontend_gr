import React, { Component } from 'react';
import VisibilityIcon from '@material-ui/icons/Visibility';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import { Link } from 'react-router-dom';
import GraficoSVG from './GraficoSVG'

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
                            <th scope="col">Acciones</th>

                        </tr>
                    </thead>
                    <tbody>
                        {this.props.propuestas.map((propuesta,index)=>{
                            return(
                                <tr key={propuesta.id_propuestaCambio}>
                                    <td>{index+1}</td>
                                    <td>{propuesta.nombre}</td>
                                    <td>{propuesta.fecha_peticion}</td>
                                    <td>{propuesta.id_subproyecto}</td>
                                    <td>{propuesta.estado}</td>
                                    <td>
                                        <Link to={`/analisisImpacto/${propuesta.id_propuestaCambio}`}><button className="btn btn-success" ><GraficoSVG/></button></Link> &nbsp;
                                        <button className="btn btn-success" onClick={()=>this.props.verPropuesta(propuesta)}><VisibilityIcon/></button> &nbsp;
                                        <button className="btn btn-warning" onClick={()=>this.props.editar(propuesta)}><EditIcon/></button> &nbsp;
                                        <button className="btn btn-danger" onClick={()=>this.props.modalEliminar(propuesta)}><DeleteIcon/></button> &nbsp;
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