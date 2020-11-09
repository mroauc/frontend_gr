import React, { Component } from 'react';
import $ from 'jquery'
import './Manager.css';

export default class CategoriaxUsuario extends Component {

    state = {
        estadoClick: false
    }

    cambiarEstadoClick = () =>  {
        this.setState({estadoClick : !this.state.estadoClick});
    }


    render(){
        const filtrado = this.props.requerimientos.filter(requerimiento => requerimiento.categoria === this.props.categoria);
        
        if(filtrado.length !== 0){
            return(
                <div className="Categoria">
                    <div className="titulo" onClick={this.cambiarEstadoClick}> <i id="f">{this.state.estadoClick ? "◤" : "◣"}</i> 📁 Requerimientos de {this.props.tipo}</div>
                    {filtrado.map((requerimiento)=>{
                        return(
                            <div style={{paddingLeft: '35px', cursor: 'pointer'}} className={this.state.estadoClick ? "mostrar req-tabla" : "ocultar req-tabla"} onClick={() => {this.props.agregarReqATab(requerimiento.nombre)}}>
                                🔓{requerimiento.nombre}
                            </div>
                        );
                    })}
                </div>
            );
        }
        else
            return("");
        
    }
}