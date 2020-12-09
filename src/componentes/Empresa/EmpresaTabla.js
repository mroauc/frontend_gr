import React, { Component } from 'react';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import Paginacion from '../Paginacion';
import FiltroEmpresa from './FiltroEmpresa'

export default class EmpresaTabla extends Component {
    
    state={
        paginaActual: 1,
        cantidadPorPagina: 2,
        empresas : []
    }

    cambiarPaginaActual = (n_pagina) => {
        this.setState({paginaActual: n_pagina});
    }

    componentWillReceiveProps(next_props){
        this.setState({empresas : next_props.empresas})
        console.log(next_props)
    }

    BuscarEmpresa = (e) => {
        FiltroEmpresa(this.props.empresas, e.target.value,this.CambiarEmpresas);
        this.cambiarPaginaActual(1)
    }

    CambiarEmpresas = (nuevasEmpresas) => {
        this.setState({empresas : nuevasEmpresas})
    }
    
    render(){

        const ultimoDato = this.state.paginaActual * this.state.cantidadPorPagina;
        const primerDato = ultimoDato - this.state.cantidadPorPagina;
        const datosActuales = this.state.empresas.slice(primerDato, ultimoDato);

        return(
            <div>
                 <input className="form-control input-filtrarTabla" placeholder="Buscar"  onChange={this.BuscarEmpresa}></input>
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
                            {datosActuales.map((empresa, index) => {
                                return(
                                    <tr key={empresa.id_empresa}>
                                        <td scope="col">{index+1 + (this.state.cantidadPorPagina * (this.state.paginaActual-1))}</td>
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
                    {
                        (this.state.empresas.length <= this.state.cantidadPorPagina)
                        ?
                            ""
                        :
                            <Paginacion
                                cambiarPaginaActual = {this.cambiarPaginaActual}
                                cantidadPorPagina = {this.state.cantidadPorPagina}
                                cantidadDeDatos = {this.state.empresas.length}
                                paginaActual = {this.state.paginaActual} 
                            />
                    }
            </div>
        );
    }
}