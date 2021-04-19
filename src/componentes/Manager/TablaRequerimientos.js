import Axios from 'axios';
import { extend } from 'jquery'
import React, { Component } from 'react'
import CategoriaxUsuario from './CategoriaxUsuario';
import FiltroRequerimientos from './FiltroRequerimientos'
import './Manager.css';

var AnalistaRequerimientos = [];

export default class TablaRequerimiento extends Component {
    state = {
        requerimientos : [],
        usuario_actividad : []
    }

    BuscarRequerimiento = async (e) => {
        console.log(e.target.value);
        if(localStorage.getItem("tipo") === "analista"){
            FiltroRequerimientos(AnalistaRequerimientos, e.target.value,this.CambiarRequerimientos);    
        }
        else {
            FiltroRequerimientos(this.props.requerimientos, e.target.value,this.CambiarRequerimientos);
        }
    }

    CambiarRequerimientos = (nuevosReq) => {
        this.setState({requerimientos : nuevosReq})
    }

    componentWillReceiveProps(next_props){    
        if(localStorage.getItem("tipo") === "analista"){
            this.RequerimientosAnalista(next_props)
        }
        else{
            this.setState({requerimientos : next_props.requerimientos})
        }
    }

    RequerimientosAnalista = async (props) => {
        const token = localStorage.getItem("token");
        let usuarioActividad = [];
        await Axios.get(localStorage.getItem('url')+`/api/usuarioactividad/`, {headers: {"Authorization": `Bearer  ${token}`}})
        .then(async response => {
            usuarioActividad = response.data
        })
        let ReqsDeAnalista = usuarioActividad.filter(item => item.id_usuario.toString() === localStorage.getItem("id"));
        const nuevoArreglo = props.requerimientos.filter(item => {
            return ReqsDeAnalista.find(item2 => item2.id_requerimiento === item.id_requerimiento) !== undefined
        })  
        console.log(nuevoArreglo)
        this.setState({requerimientos : nuevoArreglo});
        AnalistaRequerimientos = nuevoArreglo;
    }

    render(){
        return(
            <div className="col-3" style={{height: '100%', display:'inline-block',padding: 0}}>
                <div className="tabla-req">
                    <div style={{width:'100%', display:'flex'}}>
                        <input className="form-control form-mio" placeholder="Filtrar" onChange={this.BuscarRequerimiento}></input>
                    </div>
                    <CategoriaxUsuario
                        tipo = "Analista"
                        categoria = "RUSA"
                        requerimientos = {this.state.requerimientos}
                        agregarReqATab = {this.props.agregarReqATab}     
                    />
                    <CategoriaxUsuario
                        tipo = "Jefe"
                        categoria = "RUSJ"
                        requerimientos = {this.state.requerimientos}     
                        agregarReqATab = {this.props.agregarReqATab}     
                    />
                    <CategoriaxUsuario
                        tipo = "Cliente"
                        categoria = "RUSC"
                        requerimientos = {this.state.requerimientos}     
                        agregarReqATab = {this.props.agregarReqATab}     
                    />
                    <CategoriaxUsuario
                        tipo = "Administrador"
                        categoria = "RUSS"
                        requerimientos = {this.state.requerimientos}     
                        agregarReqATab = {this.props.agregarReqATab}     
                    />
                    <CategoriaxUsuario
                        tipo = "Lider"
                        categoria = "RUSL"
                        requerimientos = {this.state.requerimientos}     
                        agregarReqATab = {this.props.agregarReqATab}     
                    />
                    <CategoriaxUsuario
                        tipo = "Funcionales"
                        categoria = "REQF"
                        requerimientos = {this.state.requerimientos}     
                        agregarReqATab = {this.props.agregarReqATab}     
                    />
                    <CategoriaxUsuario
                        tipo = "No Funcionales"
                        categoria = "RENF"
                        requerimientos = {this.state.requerimientos}     
                        agregarReqATab = {this.props.agregarReqATab}     
                    />
                    
                </div>
                
            </div>
        );
    }
}