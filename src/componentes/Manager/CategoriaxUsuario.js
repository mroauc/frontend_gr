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
        return(
            <div className="Categoria">
                <div className="titulo" onClick={this.cambiarEstadoClick}> <i id="f">{this.state.estadoClick ? "◤" : "◣"}</i> 📁 Requerimientos de {this.props.tipo}</div>
                {this.props.requerimientos.filter(requerimiento => requerimiento.categoria === this.props.categoria).map((requerimiento)=>{
                    //const requerimiento_ID = requerimiento.categoria + requerimiento.id_requerimiento;
                    return(
                        <div style={{paddingLeft: '35px', cursor: 'pointer'}} className={this.state.estadoClick ? "mostrar req-tabla" : "ocultar req-tabla"} onClick={() => {this.props.agregarReqATab(requerimiento.nombre)}}>
                            🔓{requerimiento.nombre}
                        </div>
                    );
                })}
            </div>
        );
    }
}