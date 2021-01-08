import Axios from 'axios';
import React, { Component } from 'react'
import { Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import './SeleccionLider.css';
import FiltroUsuario from '../../Usuario/FiltroUsuario';

export default class SeleccionLider extends Component {

    state = {
        usuariosLider : [],
        valorInput : ""
        
    }

    componentWillReceiveProps(props){
        this.setState({usuariosLider: props.usuariosLider});
        this.setState({valorInput : props.valorInput});
    }

    BuscarUsuario = (e) => {
        FiltroUsuario(this.props.usuariosLider, e.target.value,this.CambiarUsuarios);
    }

    CambiarUsuarios = (nuevosUsuarios) => {
        this.setState({usuariosLider : nuevosUsuarios})
    }

    changeHandler = async (e) => {
        if(e.target.checked === true){
            await this.setState({valorInput : parseInt(e.target.id)});
        }
        else{
            await this.setState({valorInput : 0});
        }
    }

    cerrar = async  () => {
        this.props.cambiarEstadoAbrir();
    } 
    
    render(){
        return(
            <React.Fragment>

                <Modal isOpen = {this.props.abrir} toggle={() => {this.cerrar()}} centered>
                    <ModalHeader style={{display : 'block'}}>
                        <span>Seleccionar Usuario Lider</span>
                        
                        <span style={{cursor : 'pointer' , float : 'right'}} onClick={() => {this.cerrar()}}>X</span>
                    </ModalHeader>
                    <ModalBody>
                        <div><input className="form-control" placeholder="Buscar" onChange={this.BuscarUsuario}/></div>
                        
                        <div className="form-group" className="grupoCheckbox">

                            {this.state.usuariosLider.map(lider => {

                                return(
                                    <div key={lider.id}>
                                        <input  id={lider.id} name={lider.id.toString()} type="checkbox" className="inputCheckbox" onChange={this.changeHandler} checked={this.state.valorInput === lider.id ? "true" : ""} />
                                        <label >{lider.nombre}</label><br/>
                                    </div>
                                )
                            })}
                        </div>
                    </ModalBody>
                    <ModalFooter>
                        <button className="btn btn-success" onClick= {() => {this.props.cambiarLider(this.state.valorInput);this.cerrar()}}>Elegir</button>
                        <button className="btn btn-danger" onClick={() => {this.cerrar()}}>Cancelar</button>
                    </ModalFooter>
                </Modal>

            </React.Fragment>            
        );
    }
    
}