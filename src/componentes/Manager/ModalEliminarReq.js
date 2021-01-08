import Axios from 'axios';
import React, {Component} from 'react';
import { Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import FiltroRequerimiento from './FiltroRequerimientos';
import './ModalEliminarReq.css';

class ModalEliminarReq extends Component{

    state={
        requerimientos: [],
        seleccionados: []
    }

    componentWillReceiveProps(props){
        this.setState({requerimientos: props.requerimientos, seleccionados: []});
    }

    changeHandler=async(e)=>{
        let copiaSeleccionados = this.state.seleccionados;
        if(e.target.checked === true){
            copiaSeleccionados.push(e.target.name);
            await this.setState({seleccionados: copiaSeleccionados});
        }else{
            let seleccionadosFinal = copiaSeleccionados.filter(item => item !== e.target.name);
            await this.setState({seleccionados: seleccionadosFinal});
        }
    }

    buscarRequerimiento=(e)=>{
        FiltroRequerimiento(this.props.requerimientos, e.target.value, this.cambiarRequerimientos);
    }

    cambiarRequerimientos=(nuevosRequerimientos)=>{
        this.setState({requerimientos: nuevosRequerimientos});
    }

    eliminar=async()=>{
        const token = localStorage.getItem('token');
        var cantidadElementos = this.state.seleccionados.length;

        for (let index = 0; index < this.state.seleccionados.length-1; index++) {
            await Axios.delete(`http://localhost:8080/api/requerimiento/eliminar/${this.state.seleccionados[index]}`, {headers: {"Authorization": `Bearer ${token}`}})
        }

        if(this.state.seleccionados.length>0){
            await Axios.delete(`http://localhost:8080/api/requerimiento/eliminar/${this.state.seleccionados[this.state.seleccionados.length-1 ]}`, {headers: {"Authorization": `Bearer ${token}`}})
            .then(response=>{
                this.props.cambiarEstado();
                this.props.funcionGetRequerimientos();
            })
        }
    }

    render(){
        return(
            <React.Fragment>
                <Modal isOpen = {this.props.abrir} toggle={() => {this.props.cambiarEstado()}} centered>
                    <ModalHeader style={{display : 'block'}}>
                        <span>Eliminar Requerimientos</span>
                        <span style={{cursor:'pointer', float:'right'}} onClick={() => {this.props.cambiarEstado()}}>X</span>
                    </ModalHeader>
                    <ModalBody>
                        <div><input className="form-control" placeholder="Buscar" onChange={this.buscarRequerimiento}/></div>
                        <div className="form-control" className="grupoCheckbox">
                            {this.state.requerimientos.map(requerimiento=>{
                                return(
                                    <div key={requerimiento.id_requerimiento}>
                                        <input id={requerimiento.id_requerimiento} name={requerimiento.id_requerimiento.toString()} type="checkbox" className="inputCheckbox" onChange={this.changeHandler} checked={this.state.seleccionados.includes(requerimiento.id_requerimiento.toString())} />
                                        <label>{requerimiento.nombre + " - " + requerimiento.nombre_descriptivo.substr(0,30)}</label><br/>
                                    </div>
                                );
                            })}
                        </div>
                    </ModalBody>
                    <ModalFooter>
                        <button className="btn btn-success" onClick= {() => {this.eliminar()}}>Eliminar</button>
                        <button className="btn btn-danger" onClick={() => {this.props.cambiarEstado()}}>Cancelar</button>
                    </ModalFooter>
                </Modal>
            </React.Fragment>
        );
    }
}

export default ModalEliminarReq;