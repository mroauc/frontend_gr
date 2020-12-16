import Axios from 'axios';
import React, { Component } from 'react';
import './Permisos.css';
import swal from 'sweetalert'

export default class Permisos extends Component {
    
    state={
        usuarios:[],
        usuarioResponsable: '',
        usuariosSubProyecto: []
    }

    componentDidMount(){
        this.getUsuarios();
        this.obtenerUsuarioResponsable();
        this.getUsuariosSubProyecto();
    }
    
    getUsuarios=async()=>{
        const token = localStorage.getItem('token');
        await Axios.get(`http://localhost:8080/api/usuario/`,{headers: {"Authorization" : `Bearer ${token}`}})
        .then(response=>{
            this.setState({usuarios: response.data});
        })
    }

    getUsuariosSubProyecto=async()=>{
        const token = localStorage.getItem('token');
        await Axios.get(`http://localhost:8080/api/encargadosubproyecto/obtener/${this.props.requerimiento.id_subProyecto}`,{headers: {"Authorization" : `Bearer ${token}`}})
        .then(response=>{
            this.setState({
                usuariosSubProyecto: response.data
            })
        })
    }

    obtenerUsuarioResponsable=async()=>{
        const token = localStorage.getItem("token");
        await Axios.get(`http://localhost:8080/api/usuarioactividad/id_requerimiento/${this.props.requerimiento.id_requerimiento}`,{headers: {"Authorization" : `Bearer ${token}`}})
        .then(response=>{
            this.setState({usuarioResponsable : response.data.id_usuario});
        })
    }

    obtenerNombreUsuario = (id_usuario) => {
        if(this.state.usuarios.length !== 0){
            const usuarioEncontrado = this.state.usuarios.find(usuario => usuario.id === id_usuario)
            return usuarioEncontrado.nombre;    
        }
    }

    asignarUsuarioResponsable = () => {
        const token = localStorage.getItem("token");
        Axios.get('http://localhost:8080/api/usuarioactividad/id_requerimiento/'+ this.props.requerimiento.id_requerimiento, {headers: {"Authorization" : `Bearer ${token}`}})
        .then(response => {
            Axios.post('http://localhost:8080/api/usuarioactividad/guardar',{
                id_usuarioActividad: response.data.id_usuarioActividad,
                fecha: response.data.fecha,
                id_requerimiento: response.data.id_requerimiento,
                id_usuario: this.state.usuarioResponsable
            }, {headers: {"Authorization" : `Bearer ${token}`}})
            .then(
                this.alertaGuardar()
            )
        })
    }

    alertaGuardar = () => {
        swal({
            title: "Guardado Correctamente",
            icon: "success",
            buttons: "Aceptar"
        })
    }

    activarReadOnly = () => {
        if(localStorage.getItem("tipo") === "analista"){
            console.log("retornara true")
            return true
        }
        else{
            console.log("retornara false")
            return false;
        }
    }
    
    render(){
        return(
            <div style={{height:'98%'}}>
                <label htmlFor="id_responsable">Usuario Responsable</label>
                    <div className="row">
                        <div className="col-8">
                            <select className="form-control inputpermiso" type="text" name="usuarioResponsable" id="usuarioResponsable" value={this.state.usuarioResponsable} onChange={(e) => {this.setState({usuarioResponsable: e.target.value})}} disabled={localStorage.getItem("tipo") === "analista" ? true : false} readOnly={localStorage.getItem("tipo") === "analista" ? true : false}>
                                <option value="">Seleccionar Usuario Responsable</option>
                                {this.state.usuariosSubProyecto.map(usuario => {
                                    const usuarioEncontrado = this.state.usuarios.find(posibleUsuario => posibleUsuario.id === usuario.id_usuario); 
                                    if(usuarioEncontrado !== undefined){
                                        if(usuarioEncontrado.tipo !== "cliente" && usuarioEncontrado.estado === 'Activo')
                                            return(
                                                <option value={usuario.id_usuario} >{this.obtenerNombreUsuario(usuario.id_usuario)}</option>
                                        );
                                    }
                                })}
                            </select>
                        </div>
                        
                        <div className="col-4">
                            <button className="btn btn-success btn-block btnpermiso" onClick={this.asignarUsuarioResponsable}>Asignar Permiso</button>
                        </div>
                    </div>
            </div>
        );
    }
}