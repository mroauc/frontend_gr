import { extend } from 'jquery'
import React, { Component } from 'react'
import CategoriaxUsuario from './CategoriaxUsuario';
import './Manager.css';

export default class TablaRequerimiento extends Component {
    render(){
        return(
            <div className="col-3" style={{height: '100%', display:'inline-block',padding: 0}}>
                <div className="tabla-req">
                    <div style={{width:'100%', display:'flex'}}>
                        <input className="form-control form-mio" placeholder="Filtrar"></input>
                    </div>
                    <CategoriaxUsuario
                        tipo = "Analista"
                        categoria = "RUSA"
                        requerimientos = {this.props.requerimientos}
                        agregarReqATab = {this.props.agregarReqATab}     
                    />
                    <CategoriaxUsuario
                        tipo = "Jefe"
                        categoria = "RUSJ"
                        requerimientos = {this.props.requerimientos}     
                        agregarReqATab = {this.props.agregarReqATab}     
                    />
                    <CategoriaxUsuario
                        tipo = "Cliente"
                        categoria = "RUSC"
                        requerimientos = {this.props.requerimientos}     
                        agregarReqATab = {this.props.agregarReqATab}     
                    />
                    <CategoriaxUsuario
                        tipo = "Administrador"
                        categoria = "RUSS"
                        requerimientos = {this.props.requerimientos}     
                        agregarReqATab = {this.props.agregarReqATab}     
                    />
                    <CategoriaxUsuario
                        tipo = "Lider"
                        categoria = "RUSL"
                        requerimientos = {this.props.requerimientos}     
                        agregarReqATab = {this.props.agregarReqATab}     
                    />
                    <CategoriaxUsuario
                        tipo = "Funcionales"
                        categoria = "REQF"
                        requerimientos = {this.props.requerimientos}     
                        agregarReqATab = {this.props.agregarReqATab}     
                    />
                    <CategoriaxUsuario
                        tipo = "No Funcionales"
                        categoria = "RENF"
                        requerimientos = {this.props.requerimientos}     
                        agregarReqATab = {this.props.agregarReqATab}     
                    />
                    
                </div>
                
            </div>
        );
    }
}