import Axios from 'axios';
import React, { Component } from 'react'
import { Link } from 'react-router-dom';
import SubProyecto from './SubProyecto';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import ReqIcon from './Req';
import Paginacion from '../Paginacion';
import FiltroSubProyecto from './FiltroSubProyecto'

export default class subProyectoTabla extends Component {
    
    state={
        usuarios: [],
        paginaActual: 1,
        cantidadPorPagina: 5,
        subProyectos : []
    }

    cambiarPaginaActual = (n_pagina) => {
        this.setState({paginaActual: n_pagina});
    }

    buscarUsuario=(id_usuario)=>{
        for (let index = 0; index < this.state.usuarios.length; index++) {
            if(this.state.usuarios[index].id===id_usuario){
                return this.state.usuarios[index].nombre;
            }
        }
        return '';
    }

    componentDidMount(){
        const token = localStorage.getItem('token');
        Axios.get(localStorage.getItem('url')+'/api/usuario/',{headers: {"Authorization": `Bearer ${token}`}})
        .then(response=>{
            this.setState({
                usuarios: response.data
            });
        });
    }

    componentWillReceiveProps(next_props){
        if(localStorage.getItem("tipo") === "lider"){
            this.setState({subProyectos : next_props.subProyectos.filter(dato => dato.id_usuario.toString() === localStorage.getItem("id"))});
        }
        else{
            this.setState({subProyectos : next_props.subProyectos});
        }
    }

    BuscarSubProyectos = (e) => {
        FiltroSubProyecto(this.props.subProyectos, e.target.value,this.CambiarSubProyectos);
        this.cambiarPaginaActual(1)
    }

    CambiarSubProyectos = (nuevosSubProyectos) => {
        this.setState({subProyectos : nuevosSubProyectos})
    }

    accesoUsuario = () => {
        if(localStorage.getItem("tipo") === "admin" || localStorage.getItem("tipo") === "lider" || localStorage.getItem("tipo") === "jefe")
            return true;
        return false;
    }
    
    render(){

        const ultimoDato = this.state.paginaActual * this.state.cantidadPorPagina;
        const primerDato = ultimoDato - this.state.cantidadPorPagina;
        var datosActuales = this.state.subProyectos.slice(primerDato, ultimoDato);

        return(
            <div>
                <input className="form-control input-filtrarTabla" placeholder="Buscar"  onChange={this.BuscarSubProyectos}></input>
                <table className="table table-hover">
                        <thead>
                            <tr>
                            <th scope="col">#</th>
                            <th scope="col">Nombre</th>
                            <th scope="col">Fecha de Inicio</th>
                            <th scope="col">Fecha de Termino</th>
                            <th scope="col">Lider de Módulo</th>
                            <th scope="col">Acciones</th>

                            </tr>
                        </thead>
                        <tbody>
                            {datosActuales.map((subProyecto, index) => {
                                return(
                                    <tr key={index+1 + (this.state.cantidadPorPagina * (this.state.paginaActual-1))}>
                                        <td >{index+1 + (this.state.cantidadPorPagina * (this.state.paginaActual-1))}</td>
                                        <td>{subProyecto.nombre_subProyecto}</td>
                                        <td>{subProyecto.fecha_inicio}</td>
                                        <td>{subProyecto.fecha_fin}</td>
                                        <td>{this.buscarUsuario(subProyecto.id_usuario)}</td>
                                        <td>
                                            <Link to= {`/requerimiento/${subProyecto.id_subProyecto}`}><button type="button" className="btn botonpurple"><ReqIcon/></button></Link> &nbsp;
                                            {this.accesoUsuario() ? 
                                                <React.Fragment>
                                                    <button type="button" className="btn btn-warning" data-toggle="modal" data-target="#modalEditar" onClick={() => this.props.obtenerSubProyecto(subProyecto)}><EditIcon/></button> &nbsp;
                                                    <button type="button" className="btn btn-danger" data-toggle="modal" data-target="#modalEditar" onClick={() => this.props.cambiarEstadoEliminar(subProyecto)}><DeleteIcon/></button>
                                                </React.Fragment>
                                                : ""
                                            }
                                            
                                        </td>

                                    </tr>
                                )
                            })}
                        
                        </tbody>
                    </table>
                    {
                        (this.state.subProyectos.length <= this.state.cantidadPorPagina)
                        ?
                            ""
                        :
                            <Paginacion
                                cambiarPaginaActual = {this.cambiarPaginaActual}
                                cantidadPorPagina = {this.state.cantidadPorPagina}
                                cantidadDeDatos = {this.state.subProyectos.length}
                                paginaActual = {this.state.paginaActual} 
                            />
                    }
            </div>
        );
    }
}