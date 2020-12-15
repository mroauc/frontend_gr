import Axios from 'axios';
import React, { Component } from 'react'
import { Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import './SeleccionReq.css';
import FiltroRequerimientos from '../../FiltroRequerimientos';

export default class SeleccionReq extends Component {

    state = {
        requerimientos : [],
        valoresInput : []
        
    }

    componentWillReceiveProps(props){
        this.setState({requerimientos: props.requerimientos});
        this.setState({valoresInput : props.valoresInput});
    }

    BuscarRequerimiento = (e) => {
        FiltroRequerimientos(this.props.requerimientos, e.target.value,this.CambiarRequerimientos);
    }

    CambiarRequerimientos = (nuevosReq) => {
        this.setState({requerimientos : nuevosReq})
    }

    changeHandler = async (e) => {
        
        let copiaValoresInput = this.state.valoresInput;

        if(e.target.checked === true){
            copiaValoresInput.push(e.target.name);
            await this.setState({valoresInput : copiaValoresInput});
        }
        else{
            const valoresFinal =  copiaValoresInput.filter(item => item !== e.target.name);
            await this.setState({valoresInput : valoresFinal});
        }
    }
    
    render(){
        return(
            <React.Fragment>

                <Modal isOpen = {this.props.abrir} toggle={() => {this.props.cambiarEstadoAbrir()}} centered>
                    <ModalHeader style={{display : 'block'}}>
                        <span>Seleccionar Requerimientos</span>
                        
                        <span style={{cursor : 'pointer' , float : 'right'}} onClick={() => {this.props.cambiarEstadoAbrir()}}>X</span>
                    </ModalHeader>
                    <ModalBody>
                        <div><input className="form-control" placeholder="Buscar" onChange={this.BuscarRequerimiento}/></div>
                        
                        <div className="form-group" className="grupoCheckbox">

                            {this.state.requerimientos.map(requerimiento => {
                                return(
                                    <div key={requerimiento.id_requerimiento}>
                                        <input  id={requerimiento.id_requerimiento} name={requerimiento.id_requerimiento.toString()} type="checkbox" className="inputCheckbox" onChange={this.changeHandler} checked={this.state.valoresInput.includes(requerimiento.id_requerimiento.toString())}/>
                                        <label >{requerimiento.nombre + " - " + requerimiento.nombre_descriptivo.substr(0,30)}</label><br/>
                                    </div>
                                )
                            })}
                        </div>
                    </ModalBody>
                    <ModalFooter>
                        <button className="btn btn-success" onClick= {() => {this.props.insertarRelaciones(this.state.valoresInput)}} > Guardar</button>
                        <button className="btn btn-danger" onClick={() => {this.props.cambiarEstadoAbrir()}}>Cancelar</button>
                    </ModalFooter>
                </Modal>

            </React.Fragment>            
        );
    }
    
}