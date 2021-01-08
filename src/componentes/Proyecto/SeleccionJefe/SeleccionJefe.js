import Axios from 'axios';
import React, { Component } from 'react'
import { Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import './SeleccionJefe.css';
import FiltroUsuario from '../../Usuario/FiltroUsuario';

export default class SeleccionJefe extends Component {

    state = {
        usuariosJefe : [],
        valorInput : ""
        
    }

    componentWillReceiveProps(props){
        this.setState({usuariosJefe: props.usuariosJefe});
        this.setState({valorInput : props.valorInput});
    }

    BuscarUsuario = (e) => {
        FiltroUsuario(this.props.usuariosJefe, e.target.value,this.CambiarUsuarios);
    }

    CambiarUsuarios = (nuevosUsuarios) => {
        this.setState({usuariosJefe : nuevosUsuarios})
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
                        <span>Seleccionar Usuario Jefe</span>
                        
                        <span style={{cursor : 'pointer' , float : 'right'}} onClick={() => {this.cerrar()}}>X</span>
                    </ModalHeader>
                    <ModalBody>
                        <div><input className="form-control" placeholder="Buscar" onChange={this.BuscarUsuario}/></div>
                        
                        <div className="form-group" className="grupoCheckbox">

                            {this.state.usuariosJefe.map(jefe => {

                                return(
                                    <div key={jefe.id}>
                                        <input  id={jefe.id} name={jefe.id.toString()} type="checkbox" className="inputCheckbox" onChange={this.changeHandler} checked={this.state.valorInput === jefe.id ? "true" : ""} />
                                        <label >{jefe.nombre}</label><br/>
                                    </div>
                                )
                            })}
                        </div>
                    </ModalBody>
                    <ModalFooter>
                        <button className="btn btn-success" onClick= {() => {this.props.cambiarJefe(this.state.valorInput);this.cerrar()}} >Elegir</button>
                        <button className="btn btn-danger" onClick={() => {this.cerrar()}}>Cancelar</button>
                    </ModalFooter>
                </Modal>

            </React.Fragment>            
        );
    }
    
}