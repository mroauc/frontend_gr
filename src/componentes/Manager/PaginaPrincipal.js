import Axios from 'axios';
import React, { Component } from 'react'
import './PaginaPrincipal.css'

var arregloOrdenado = [];

export default class PaginaPrincipal extends Component{

    state = {
        usuarios: []
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

    buscarUsuarioPorId = (id_usuario) => {
        const usuarioEncontrado = this.state.usuarios.find(usuario => usuario.id === id_usuario)
        if(usuarioEncontrado)
        return usuarioEncontrado.nombre;
    }

    componentDidMount(){
        this.getUsuarios();
    }

    render(){
        this.ordenarArregloReq();
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
                                    <td>{this.buscarUsuarioPorId(requerimiento.id_usuario)}</td>
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