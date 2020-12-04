import { extend } from 'jquery'
import React, { Component } from 'react'
import CategoriaxUsuario from './CategoriaxUsuario';
import FiltroRequerimientos from './FiltroRequerimientos'
import './Manager.css';

export default class TablaRequerimiento extends Component {
    state = {
        requerimientos : []
    }

    BuscarRequerimiento = (e) => {
        console.log(e.target.value);
        FiltroRequerimientos(this.props.requerimientos, e.target.value,this.CambiarRequerimientos);
    }

    CambiarRequerimientos = (nuevosReq) => {
        this.setState({requerimientos : nuevosReq})
    }

    componentWillReceiveProps(next_props){
        this.setState({requerimientos : next_props.requerimientos})
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