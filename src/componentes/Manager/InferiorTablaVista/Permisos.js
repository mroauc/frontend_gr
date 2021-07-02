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
        await Axios.get(localStorage.getItem('url')+`/api/usuario/`,{headers: {"Authorization" : `Bearer ${token}`}})
        .then(response=>{
            this.setState({usuarios: response.data});
        })
    }

    getUsuariosSubProyecto=async()=>{
        const token = localStorage.getItem('token');
        await Axios.get(localStorage.getItem('url')+`/api/encargadosubproyecto/obtener/${this.props.requerimiento.id_subProyecto}`,{headers: {"Authorization" : `Bearer ${token}`}})
        .then(response=>{
            this.setState({
                usuariosSubProyecto: response.data
            });
        });
        this.getLiderJefe();
    }

    getLiderJefe = async () => {
        const token = localStorage.getItem('token');
        var id_jefe;
        var id_lider;
        
        await Axios.get(localStorage.getItem('url')+`/api/subProyecto/${this.props.requerimiento.id_subProyecto}`,{headers: {"Authorization" : `Bearer ${token}`}})
        .then(async response => {
            id_lider = response.data.id_usuario;
            await Axios.get(localStorage.getItem('url')+`/api/proyecto/${response.data.id_proyecto}`,{headers: {"Authorization" : `Bearer ${token}`}})
            .then(response2 => {
                id_jefe = response2.data.id_usuario;
            })
        });

        var ultimoUsuario = this.state.usuariosSubProyecto[this.state.usuariosSubProyecto.length-1];
        var usuarioJefe = {id_encargadoSubProyecto: ultimoUsuario.id_encargadoSubProyecto+1, id_subProyecto: ultimoUsuario.id_subProyecto, id_usuario: id_jefe};
        var usuarioLider = {id_encargadoSubProyecto: ultimoUsuario.id_encargadoSubProyecto+2, id_subProyecto: ultimoUsuario.id_subProyecto, id_usuario: id_lider};

        var copiaUsuarios = [...this.state.usuariosSubProyecto];
        copiaUsuarios.push(usuarioLider);
        copiaUsuarios.push(usuarioJefe);
        this.setState({usuariosSubProyecto: copiaUsuarios});
    }

    obtenerUsuarioResponsable=async()=>{
        const token = localStorage.getItem("token");
        await Axios.get(localStorage.getItem('url')+`/api/usuarioactividad/id_requerimiento/${this.props.requerimiento.id_requerimiento}`,{headers: {"Authorization" : `Bearer ${token}`}})
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
        Axios.get(localStorage.getItem('url')+'/api/usuarioactividad/id_requerimiento/'+ this.props.requerimiento.id_requerimiento, {headers: {"Authorization" : `Bearer ${token}`}})
        .then(response => {
            Axios.post(localStorage.getItem('url')+'/api/usuarioactividad/guardar',{
                id_usuarioActividad: response.data.id_usuarioActividad,
                fecha: response.data.fecha,
                id_requerimiento: response.data.id_requerimiento,
                id_usuario: this.state.usuarioResponsable
            },{headers: {"Authorization" : `Bearer ${token}`}})
            .then(response=>{
                this.guardarCambioVersion(this.props.requerimiento, this.state.usuarioResponsable);
                this.alertaGuardar();
            });
        });
    }

    guardarCambioVersion=(requerimiento, usuarioResponsable)=>{
        if(requerimiento.id_usuario !== usuarioResponsable){
            const token = localStorage.getItem('token');
            Axios.post(localStorage.getItem('url')+'/api/versionanterior/guardar/',{
                descripcion: requerimiento.descripcion,
                estado: requerimiento.estado,
                id_requerimiento: requerimiento.id_requerimiento,
                id_usuario: requerimiento.id_usuario,
                nombre_descriptivo: requerimiento.nombre_descriptivo,
                prioridad: requerimiento.prioridad,
                fecha: new Date().toLocaleString(),
                cambios_realizados: "Nuevo usuario responsable"
            }, {headers: {"Authorization": `Bearer ${token}`}})
            .then(response=>{
                var newReq = requerimiento;
                newReq.id_usuario = usuarioResponsable;
                Axios.post(localStorage.getItem('url')+'/api/requerimiento/editar/', newReq, {headers: {"Authorization": `Bearer ${token}`}});
            });
        }
    }

    alertaGuardar = () => {
        swal({
            title: "Guardado Correctamente",
            icon: "success",
            buttons: "Aceptar"
        });
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
            <div style={{height:'98%', width: '99%'}}>
                <label htmlFor="id_responsable">Usuario Responsable</label>
                    <div className="row">
                        <div className="col-8">
                            <select className="form-control inputpermiso" type="text" name="usuarioResponsable" id="usuarioResponsable" value={this.state.usuarioResponsable} onChange={(e) => {this.setState({usuarioResponsable: e.target.value})}} disabled={localStorage.getItem("tipo") === "analista" ? true : false} readOnly={localStorage.getItem("tipo") === "analista" ? true : false}>
                                <option value="">Seleccionar Usuario Responsable</option>
                                {this.state.usuariosSubProyecto.reverse().map(usuario => {
                                    const usuarioEncontrado = this.state.usuarios.find(posibleUsuario => posibleUsuario.id === usuario.id_usuario); 
                                    if(usuarioEncontrado !== undefined){
                                        if(usuarioEncontrado.tipo !== "cliente" && usuarioEncontrado.estado === 'Activo')
                                            return(
                                                <option value={usuario.id_usuario} >{this.obtenerNombreUsuario(usuario.id_usuario)+" - "+usuarioEncontrado.tipo.toUpperCase()}</option>
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