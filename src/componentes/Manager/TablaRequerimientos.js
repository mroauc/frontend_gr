import { extend } from 'jquery'
import React, { Component } from 'react'
import CategoriaxUsuario from './CategoriaxUsuario';
import './Manager.css';

export default class TablaRequerimiento extends Component {
    render(){
        return(
            <div className="col-2" style={{height: '100%', display:'inline-block',padding: 0}}>
                <div className="tabla-req">
                    <div style={{width:'100%', display:'flex'}}>
                        <input className="form-control form-mio" placeholder="Filtrar"></input>
                    </div>
                    {/* <button style={{height: '30px', width: '20px'}}>🔎</button>
                    <button style={{height: '30px',  width: '20px'}}>✖️</button> */}
                    <CategoriaxUsuario
                        tipo = "Analista"
                        categoria = "RUSA"
                        requerimientos = {this.props.requerimientos}     
                    />
                    <CategoriaxUsuario
                        tipo = "Jefe"
                        categoria = "RUSJ"
                        requerimientos = {this.props.requerimientos}     
                    />
                    <CategoriaxUsuario
                        tipo = "Cliente"
                        categoria = "RUSC"
                        requerimientos = {this.props.requerimientos}     
                    />
                    <CategoriaxUsuario
                        tipo = "Administrador"
                        categoria = "RUSS"
                        requerimientos = {this.props.requerimientos}     
                    />
                    <CategoriaxUsuario
                        tipo = "Lider"
                        categoria = "RUSL"
                        requerimientos = {this.props.requerimientos}     
                    />
                    
                </div>
                
            </div>
        );
    }
}