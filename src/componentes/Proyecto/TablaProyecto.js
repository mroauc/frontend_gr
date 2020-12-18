import Axios from 'axios';
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Button } from 'reactstrap';
import DescriptionIcon from '@material-ui/icons/Description';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import ForwardIcon from '@material-ui/icons/Forward';
import Paginacion from '../Paginacion';
import FiltroProyecto from './FiltroProyecto';

const ocultarxTipoUsuario = {display: localStorage.getItem('tipo') === "cliente" ? "none" : "inline"};

class TablaProyecto extends Component{

    state={
        usuarios: [],
        subProyectos: [],
        verSubProyecto: false,
        paginaActual: 1,
        cantidadPorPagina: 5,
        proyectos: []
    }

    cambiarPaginaActual = (n_pagina) => {
        this.setState({paginaActual: n_pagina});
    }

    componentWillReceiveProps(next_props){
        this.setState({proyectos : next_props.proyectos})
    }

    BuscarTemplate = (e) =>{
        FiltroProyecto(this.props.proyectos, e.target.value, this.cambiarProyectos);
        this.cambiarPaginaActual(1);
    }

    cambiarProyectos = (nuevosProyectos) =>{
        this.setState({proyectos: nuevosProyectos});
    }

    componentDidMount(){
        const token = localStorage.getItem('token');
        Axios.get('http://localhost:8080/api/usuario/',{headers: {"Authorization": `Bearer ${token}`}})
        .then(response=>{
            this.setState({
                usuarios: response.data
            });
            Axios.get('http://localhost:8080/api/subProyecto/',{headers:{"Authorization": `Bearer ${token}`}})
            .then(response=>{
                this.setState({
                    subProyectos: response.data
                });
            })
        })
    }

    buscarUsuario=(id_usuario)=>{
        for (let index = 0; index < this.state.usuarios.length; index++) {
            if(this.state.usuarios[index].id===id_usuario){
                return this.state.usuarios[index].nombre;
            }
        }
    }

    cantidadSubProyectos=(id_proyecto)=>{
        var count=0;
        for (let index = 0; index < this.state.subProyectos.length; index++) {
            if(this.state.subProyectos[index].id_proyecto===id_proyecto){
                count++;
            }
        }
        return count;
    }

    accesoUsuario = () => {
        if(localStorage.getItem("tipo") === "admin" || localStorage.getItem("tipo") === "lider" || localStorage.getItem("tipo") === "jefe")
            return true;
        return false;
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
                <input className="form-control input-filtrarTabla" placeholder="Buscar"  onChange={this.BuscarTemplate}></input>
                <table className="table table-hover">
                <thead>
                    <tr>
                        <th scope="col">#</th>
                        <th scope="col">Nombre</th>
                        <th scope="col">Jefe de Proyecto</th>
                        <th scope="col">Fecha de Creacion</th>
                        <th scope="col">Módulos Ingresados</th>
                        <th scope="col">Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {datosActuales.map((proyecto,index)=>{
                        return(
                            <tr key={proyecto.id_proyecto}>
                                <td>{index+1 + (this.state.cantidadPorPagina * (this.state.paginaActual-1))}</td>
                                <td>{proyecto.nombre}</td>
                                <td>{this.buscarUsuario(proyecto.id_usuario)}</td>
                                <td>{proyecto.fecha_creacion}</td>
                                <td>{this.cantidadSubProyectos(proyecto.id_proyecto)}</td>
                                <td>
                                    {this.accesoUsuario() ?
                                        <React.Fragment>
                                            <button className="btn btn-secondary" onClick={()=>this.props.generarPDF(proyecto.id_proyecto)} ><DescriptionIcon/> </button> &nbsp;
                                            <button className="btn btn-warning" onClick={()=>this.props.editar(proyecto)}><EditIcon/></button> &nbsp;
                                            <button className="btn btn-danger" onClick={()=>this.props.modalEliminar(proyecto)}><DeleteIcon/></button> &nbsp;
                                        </React.Fragment>:
                                        ""
                                    }
                                    
                                    {localStorage.getItem("tipo") === "cliente" ?
                                        <React.Fragment>
                                            <Link to={"/graficoRequerimientos/"+proyecto.id_proyecto}><Button type="button" className="btn btn-info"><ForwardIcon/></Button></Link>
                                        </React.Fragment>    
                                        : 
                                        <React.Fragment>
                                            <Link to={"/subProyecto/"+proyecto.id_proyecto}><Button type="button" className="btn btn-info"><ForwardIcon/></Button></Link>
                                        </React.Fragment>
                                    }
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

export default TablaProyecto;