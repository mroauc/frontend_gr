import Axios from 'axios';
import React, { Component } from 'react'
import './PaginaPrincipal.css'

var arregloOrdenado = [];

export default class PaginaPrincipal extends Component{

    state = {
        usuarios: [],
        usuario_actividad: []

    }

    constructor (props){
        super(props);
        ///console.log(props);
    }

    
    getRequerimiento = () => {
        const token = localStorage.getItem("token");
        Axios.get("http://localhost:8080/api/requerimiento/tipo/")
        .then(response => {
            console.log(response.data);
        })
    }

    ordenarArregloReq = async () => {
        const ordenamiento = {Alta: 1, Media: 2, Baja: 3};
        arregloOrdenado = this.props.requerimientos;
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

    componentDidMount(){
        this.getUsuarios();
        this.getDataUsuarioActividad();
    }

    render(){
        this.ordenarArregloReq();
        // this.getDataUsuarioActividad();
        return(
            <div style={{marginTop: '20px'}}>
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
                        {arregloOrdenado.map(requerimiento => {
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

            </div>
        );
    }
}