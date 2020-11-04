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
                    return(
                        <div style={{paddingLeft: '35px'}} className={this.state.estadoClick ? "mostrar" : "ocultar"}>
                            🔓{requerimiento.categoria + requerimiento.id_requerimiento}
                        </div>
                    );
                })}
            </div>
        );
    }
}