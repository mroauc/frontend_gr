import React, {Component} from 'react';
import Paginacion from '../Paginacion';
import {Link} from 'react-router-dom';
import ForwardIcon from '@material-ui/icons/Forward';
import FiltroProyecto from '../Proyecto/FiltroProyecto';

class TablaVistaPreviaErrores extends Component{
    
    state={
        paginaActual: 1,
        cantidadPorPagina: 5,
        proyectos: []
    }

    cambiarPaginaActual = (n_pagina) => {
        this.setState({paginaActual: n_pagina});
    }

    componentWillReceiveProps(next_props){
        this.setState({proyectos : next_props.proyectos});
    }

    BuscarProyecto=(e)=>{
        FiltroProyecto(this.props.proyectos, e.target.value, this.cambiarProyectos);
        this.cambiarPaginaActual(1);
    }

    cambiarProyectos=(newProyects)=>{
        this.setState({proyectos: newProyects});
    }

    render(){
        const ultimoDato = this.state.paginaActual * this.state.cantidadPorPagina;
        const primerDato = ultimoDato - this.state.cantidadPorPagina;
        const datosActuales = this.state.proyectos.slice(primerDato, ultimoDato);

        if(datosActuales.length===0 && this.state.paginaActual!==1){
            this.cambiarPaginaActual(1);
        }

        return(
            <div>
                <input className="form-control input-filtrarTabla" placeholder="Buscar proyecto"  onChange={this.BuscarProyecto}></input>
                <table className="table table-hover">
                <thead>
                    <tr>
                        <th scope="col">#</th>
                        <th scope="col">Nombre</th>
                        <th scope="col">Ver</th>
                    </tr>
                </thead>
                <tbody>
                    {datosActuales.map((proyecto,index)=>{
                        return(
                            <tr key={proyecto.id_proyecto}>
                                <td>{index+1 + (this.state.cantidadPorPagina * (this.state.paginaActual-1))}</td>
                                <td>{proyecto.nombre}</td>
                                <td>
                                    <Link to={"/errores/"+proyecto.id_proyecto}><button type="button" className="btn btn-info"><ForwardIcon/></button></Link>
                                </td>
                            </tr>
                        )
                    })}
                </tbody>
                </table>   
                {
                    (this.state.proyectos.length <= this.state.cantidadPorPagina)
                    ?
                        ""
                    :
                        <Paginacion
                            cambiarPaginaActual = {this.cambiarPaginaActual}
                            cantidadPorPagina = {this.state.cantidadPorPagina}
                            cantidadDeDatos = {this.state.proyectos.length}
                            paginaActual = {this.state.paginaActual} 
                        />
                }             
            </div>
        );
    }
}

export default TablaVistaPreviaErrores;