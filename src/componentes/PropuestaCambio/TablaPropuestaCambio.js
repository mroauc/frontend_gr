import React, { Component } from 'react';
import VisibilityIcon from '@material-ui/icons/Visibility';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import Paginacion from '../Paginacion';
import { Link } from 'react-router-dom';
<<<<<<< HEAD
import GraficoSVG from './GraficoSVG'
=======
import GraficoSVG from './GraficoSVG';
>>>>>>> a55b8ef4b7859d84baadff74e5d07a6c14d5c2d4

class TablaPropuestaCambio extends Component{

    state={
        paginaActual: 1,
        cantidadPorPagina: 5
    }

    cambiarPaginaActual = (n_pagina) => {
        this.setState({paginaActual: n_pagina});
    }

    render(){
        const ultimoDato = this.state.paginaActual * this.state.cantidadPorPagina;
        const primerDato = ultimoDato - this.state.cantidadPorPagina;
        const datosActuales = this.props.propuestas.slice(primerDato, ultimoDato);

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
                        {datosActuales.map((propuesta,index)=>{
                            return(
                                <tr key={propuesta.id_propuestaCambio}>
                                    <td>{index+1 + (this.state.cantidadPorPagina * (this.state.paginaActual-1))}</td>
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
                {
                    (this.props.propuestas.length <= this.state.cantidadPorPagina)
                    ?
                        ""
                    :
                        <Paginacion
                            cambiarPaginaActual = {this.cambiarPaginaActual}
                            cantidadPorPagina = {this.state.cantidadPorPagina}
                            cantidadDeDatos = {this.props.propuestas.length}
                            paginaActual = {this.state.paginaActual} 
                        />
                }
            </div>
        );
    }
}

export default TablaPropuestaCambio;