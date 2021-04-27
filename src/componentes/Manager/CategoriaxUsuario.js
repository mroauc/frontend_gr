import React, { Component } from 'react';
import './Manager.css';
import LockIcon from '@material-ui/icons/Lock';
import FolderOpenTwoToneIcon from '@material-ui/icons/FolderOpenTwoTone';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import ArrowRightIcon from '@material-ui/icons/ArrowRight';

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
                    <div className="titulo" onClick={this.cambiarEstadoClick}> <i id="f">{this.state.estadoClick ? <ArrowDropDownIcon fontSize="small"/> : <ArrowRightIcon fontSize="small"/>}</i> <FolderOpenTwoToneIcon fontSize="medium"/> Requerimientos {this.props.tipo}</div>
                    {filtrado.map((requerimiento)=>{
                        return(
                            <div style={{paddingLeft: '35px', cursor: 'pointer'}} className={this.state.estadoClick ? "mostrar req-tabla" : "ocultar req-tabla"} onClick={() => {this.props.agregarReqATab(requerimiento.nombre)}}>
                                <LockIcon fontSize="small"/>{requerimiento.nombre}
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