import Axios from 'axios';
import React, { Component } from 'react';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import {Link} from 'react-router-dom';
import './PaginaPrincipal.css';
import ReqModal from './ReqModal';
import PaginacionRequerimiento from './PaginacionRequerimiento'
import ModalEliminarReq from './ModalEliminarReq';

var arregloOrdenado = [];

export default class PaginaPrincipal extends Component{

    state = {
        usuarios: [],
        usuario_actividad: [],
        modalInsertar: false,
        modalEliminar: false,
        requerimiento: {
            id_requerimiento: 0,
            nombre: '', 
            nombre_descriptivo: '',
            descripcion: '',
            id_usuario: 0,
            id_subProyecto: this.props.id_subproyecto,
            fecha_creacion: '',
            prioridad: '',
            estado: '',
            categoria: '',
            id_template: ''
        },
        id_proyecto: '',
        paginaActual: 1,
        cantidadPorPagina: 5
    }

    constructor (props){
        super(props);
    }

    cambiarPaginaActual = (n_pagina) => {
        console.log(n_pagina)
        this.setState({paginaActual: n_pagina});
    }

    getIdProyecto=async()=>{
        const token = localStorage.getItem("token");
        await Axios.get(`http://localhost:8080/api/subProyecto/${this.props.id_subproyecto}`, {headers: {"Authorization": `Bearer  ${token}`}})
        .then(response=>{
            this.setState({
                id_proyecto: response.data.id_proyecto
            });
        });
    }

    ordenarArregloReq = async () => {
        const token = localStorage.getItem("token");
        const ordenamiento = {Alta: 1, Media: 2, Baja: 3};
        
        await Axios.get(`http://localhost:8080/api/requerimiento/obtener/${this.props.id_subproyecto}`, {headers: {"Authorization": `Bearer  ${token}`}})
        .then(async response => {
            arregloOrdenado = response.data;
        })

        await arregloOrdenado.sort((
            (a, b) => { return ordenamiento[a.prioridad] - ordenamiento[b.prioridad]}));
    }

    getUsuarios = async () => {
        const token = localStorage.getItem("token");
        await Axios.get("http://localhost:8080/api/usuario/",{headers: {"Authorization": `Bearer  ${token}`}})
        .then(response => {
            this.setState({usuarios : response.data});
        })
    }

    getDataUsuarioActividad = async () => {
        const token = localStorage.getItem("token");
        await Axios.get("http://localhost:8080/api/usuarioactividad/",{headers: {"Authorization": `Bearer  ${token}`}})
        .then(response => {
            this.setState({usuario_actividad : response.data});
        });
    }

    buscarUsuarioPorId = (id_requerimiento) => {
        const usuarioActividadEncontrado = this.state.usuario_actividad.find(item => item.id_requerimiento === id_requerimiento);
        if(usuarioActividadEncontrado){
            const usuarioEncontrado = this.state.usuarios.find(usuario => usuario.id === usuarioActividadEncontrado.id_usuario);
            if(usuarioEncontrado)
            return usuarioEncontrado.nombre;
        }  
    }

    modalInsertar=async()=>{
        await this.setState({
            requerimiento:{
                id_requerimiento: 0,
                nombre: '', 
                descripcion: '',
                nombre_descriptivo: '',
                id_usuario: '',
                id_subProyecto: this.props.id_subproyecto,
                fecha_creacion: '',
                prioridad: '',
                estado: '',
                categoria: '',
                id_template: ''
            }
        });
        this.props.cambiarTabActivo("");
        await this.setState({modalInsertar: !this.state.modalInsertar});
    }

    modalEliminar=async()=>{
        await this.setState({modalEliminar: !this.state.modalEliminar});
    }

    componentDidMount(){
        this.getUsuarios();
        this.getDataUsuarioActividad();
        this.getIdProyecto();
    }

    render(){
        const ultimoDato = this.state.paginaActual * this.state.cantidadPorPagina;
        const primerDato = ultimoDato - this.state.cantidadPorPagina;
        const datosActuales = arregloOrdenado.slice(primerDato, ultimoDato);
        this.ordenarArregloReq();
        return(
            <div>
                <div style={{marginLeft:'5%'}}>
                    <button type="button" className="btn boton" onClick={()=>this.modalInsertar()}>Insertar</button> &nbsp;
                    <button type="button" className="btn boton" onClick={()=>this.modalEliminar()}>Eliminar</button> &nbsp;
                    <Link to={"/subProyecto/"+this.state.id_proyecto}><button type="button" className="btn boton"><ArrowBackIcon/> Volver</button></Link> 

                    <div style={{float:'right', textDecoration:'none', marginRight:'5%'}}>
                    <Link to={"/dragdrop/"+this.props.id_subproyecto}><button type="button" className="btn boton">Vista Interactiva</button> </Link>
                    <Link to={"/matrizRelacion/"+this.props.id_subproyecto}><button type="button" className="btn boton">Ver Relacion Requerimientos</button> </Link>
                    </div>
                </div>
                
                <br/>
                <h4 style={{marginLeft:'50px'}}>Prioridades de Requerimientos</h4>
                <table className="tablaPagPrincipal">
                    <thead>
                        <tr>
                            <th>Nombre</th>
                            <th>Prioridad</th>
                            <th>Estado</th>
                            <th>Usuario Responsable</th>
                            <th>Fecha Creacion</th>
                        </tr>
                    </thead>
                    <tbody>
                        {datosActuales.map(requerimiento => {
                            return(
                                <tr>
                                    <td>{requerimiento.nombre}</td>
                                    <td>{requerimiento.prioridad}</td>
                                    <td>{requerimiento.estado}</td>
                                    <td>{this.buscarUsuarioPorId(requerimiento.id_requerimiento)}</td>
                                    <td>{requerimiento.fecha_creacion}</td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>

                <PaginacionRequerimiento
                    cambiarPaginaActual = {this.cambiarPaginaActual}
                    cantidadPorPagina = {this.state.cantidadPorPagina}
                    cantidadDeDatos = {arregloOrdenado.length}
                    paginaActual = {this.state.paginaActual}
                    cambiarTabActivo = {this.props.cambiarTabActivo} 
                />

                <ReqModal
                    requerimiento = {this.state.requerimiento}
                    id_subProyecto = {this.props.id_subproyecto}
                    estadoModalInsertar = {this.state.modalInsertar}
                    modalInsertar = {this.modalInsertar}
                    pasoFinal={this.pasoFinal}
                    funcionGetRequerimientos = {this.props.funcionGetRequerimientos}
                    getUsuarios = {this.getUsuarios}
                    getDataUsuarioActividad = {this.getDataUsuarioActividad}
                    cambiarTabActivo = {this.props.cambiarTabActivo}
                    agregarReqATab = {this.props.agregarReqATab} 
                />

                <ModalEliminarReq
                    requerimientos = {datosActuales}
                    abrir = {this.state.modalEliminar}
                    cambiarEstado = {this.modalEliminar}
                    funcionGetRequerimientos = {this.props.funcionGetRequerimientos}
                    actualizarTabla = {this.ordenarArregloReq}
                />

            </div>
        );
    }
}