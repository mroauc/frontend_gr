import React, { Component } from 'react';
import VisibilityIcon from '@material-ui/icons/Visibility';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import Paginacion from '../Paginacion';
import FiltroTemplate from './FiltroTemplate';

class TablaTemplate extends Component{

    state={
        paginaActual: 1,
        cantidadPorPagina: 5,
        templates: []
    }

    cambiarPaginaActual = (n_pagina) => {
        this.setState({paginaActual: n_pagina});
    }

    componentWillReceiveProps(next_props){
        this.setState({templates : next_props.templates})
    }

    BuscarTemplate = (e) =>{
        FiltroTemplate(this.props.templates, e.target.value, this.CambiarTemplates);
        this.cambiarPaginaActual(1);
    }

    CambiarTemplates = (nuevosTemplates) =>{
        this.setState({templates: nuevosTemplates});
    }
    
    render(){
        const ultimoDato = this.state.paginaActual * this.state.cantidadPorPagina;
        const primerDato = ultimoDato - this.state.cantidadPorPagina;
        const datosActuales = this.state.templates.slice(primerDato, ultimoDato);

        if(datosActuales.length===0 && this.state.paginaActual!==1){
            this.cambiarPaginaActual(1);
        }

        return(
            <div>
                <input className="form-control input-filtrarTabla" placeholder="Buscar" onChange={this.BuscarTemplate}></input>
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
                        {datosActuales.map((template,index)=>{
                            return(
                                <tr key={template.id_template}>
                                    <td>{index+1 + (this.state.cantidadPorPagina * (this.state.paginaActual-1))}</td>
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
                {
                    (this.state.templates.length <= this.state.cantidadPorPagina)
                    ?
                        ""
                    :
                        <Paginacion
                            cambiarPaginaActual = {this.cambiarPaginaActual}
                            cantidadPorPagina = {this.state.cantidadPorPagina}
                            cantidadDeDatos = {this.state.templates.length}
                            paginaActual = {this.state.paginaActual} 
                        />
                }
            </div>
        );
    }
}

export default TablaTemplate;