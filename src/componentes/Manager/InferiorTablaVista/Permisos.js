import Axios from 'axios';
import React, { Component } from 'react';
import './Permisos.css';
import swal from 'sweetalert'

export default class Permisos extends Component {
    
    state={
        usuarios:[],
        usuariosSubProyecto: [],
        usuarioResponsable: ''
    }

    componentDidMount(){
        this.getUsuarios();
        this.getUsuariosSubProyecto();
        this.obtenerUsuarioResponsable()
    }
    
    getUsuarios = async () => {
        const token = localStorage.getItem('token');
        await Axios.get(`http://localhost:8080/api/usuario/`,{headers: {"Authorization" : `Bearer ${token}`}})
        .then(response=>{
            this.setState({usuarios: response.data})
        })
    }

    getUsuariosSubProyecto= async ()=>{
        const token = localStorage.getItem('token');
        console.log(this.props.requerimiento);
        console.log(this.props.requerimiento.id_subProyecto)
        await Axios.get(`http://localhost:8080/api/encargadosubproyecto/obtener/${this.props.requerimiento.id_subProyecto}`,{headers: {"Authorization" : `Bearer ${token}`}})
        .then(response=>{
            this.setState({
                usuariosSubProyecto: response.data
            })
        })
        
    }

    obtenerUsuarioResponsable = async () => {
        const token = localStorage.getItem("token");
        await Axios.get(`http://localhost:8080/api/usuarioactividad/id_requerimiento/${this.props.requerimiento.id_requerimiento}`,{headers: {"Authorization" : `Bearer ${token}`}})
        .then(response=>{
            console.log(response.data);
            this.setState({usuarioResponsable : response.data.id_usuario});
        })

    }

    obtenerNombreUsuario = (id_usuario) => {
        if(this.state.usuarios.length !== 0){
            console.log(id_usuario)
            console.log(this.state.usuarios)
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
    
    render(){
        return(
            <div style={{height:'98%'}}>
                <label htmlFor="id_responsable">Usuario Responsable</label>
                    <div className="row">
                        <div className="col-8">
                            <select className="form-control inputpermiso" type="text" name="usuarioResponsable" id="usuarioResponsable" value={this.state.usuarioResponsable} onChange={(e) => {this.setState({usuarioResponsable: e.target.value})}}>
                                <option value="">Seleccionar Usuario Responsable</option>
                                {this.state.usuariosSubProyecto.map(usuario => {
                                    return(
                                        <option value={usuario.id_usuario}>{this.obtenerNombreUsuario(usuario.id_usuario)}</option>
                                    );
                                    
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