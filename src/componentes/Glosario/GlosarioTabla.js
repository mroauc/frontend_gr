import React, { Component } from 'react'
import { Link } from 'react-router-dom'

export default class GlosarioTabla extends Component {
    render(){
        return(
            <div>
                <table class="table table-hover">
                    <thead>
                        <tr>
                        <th scope="col" style={{width:'30%'}}>ID</th>
                        <th style={{width:'30%'}}>ID Proyecto</th>
                        <th style={{width:'30%'}}>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.props.glosarios.map(glosario => {
                            return(
                                <tr>
                                    <td scope="col">{glosario.id_glosario}</td>
                                    <td>{glosario.id_proyecto}</td>
                                    <td >
                                        <Link to={"/glosario/"+glosario.id_glosario} ><button className="btn btn-success" >Ver Definiciones</button></Link> &nbsp;
                                        <button type="button" class="btn btn-warning" data-toggle="modal" data-target="#modalEditar" onClick={() => this.props.obtenerGlosario(glosario)}>Editar</button> &nbsp;
                                        <button type="button" class="btn btn-danger" data-toggle="modal" data-target="#modalEditar" onClick={() => this.props.cambiarEstadoEliminar(glosario)}>Eliminar</button>
                                        
                                        
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