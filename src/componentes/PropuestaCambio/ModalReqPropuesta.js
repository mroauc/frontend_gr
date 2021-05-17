import Axios from 'axios';
import React, {Component} from 'react';
import { Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import FiltroRequerimiento from '../Manager/FiltroRequerimientos';
import './ModalReqPropuesta.css';

class ModalReqPropuesta extends Component{
    state={
        requerimientos: [],
        seleccionado: ""
    }

    componentDidMount(){
        this.setState({requerimientos: this.props.requerimientos, seleccionado: this.props.seleccionado});
    }

    componentWillReceiveProps(props){
        this.setState({requerimientos: props.requerimientos, seleccionado: props.seleccionado});
    }

    changeHandler=async(e)=>{
        if(e.target.checked === true){
            await this.setState({seleccionado: e.target.name});
        }else{
            await this.setState({seleccionado: ""});
        }
    }

    buscarRequerimiento=(e)=>{
        FiltroRequerimiento(this.props.requerimientos, e.target.value, this.cambiarRequerimientos);
    }

    cambiarRequerimientos=(nuevosRequerimientos)=>{
        this.setState({requerimientos: nuevosRequerimientos});
    }

    render(){
        return(
            <React.Fragment>
                <Modal isOpen = {this.props.abrir} toggle={() => {this.props.cambiarEstado()}} centered>
                    <ModalHeader style={{display : 'block'}}>
                        <span>Seleccionar Requerimiento</span>
                        <span style={{cursor:'pointer', float:'right'}} onClick={() => {this.props.cambiarEstado()}}>X</span>
                    </ModalHeader>
                    <ModalBody>
                        <div><input className="form-control" placeholder="Buscar" onChange={this.buscarRequerimiento}/></div>
                        <div className="form-control" className="grupoCheckbox">
                            {this.state.requerimientos.map(requerimiento=>{
                                return(
                                    <div key={requerimiento.id_requerimiento}>
                                        <input id={requerimiento.id_requerimiento} name={requerimiento.id_requerimiento.toString()} type="checkbox" className="inputCheckbox" onChange={this.changeHandler} checked={parseInt(this.state.seleccionado) === requerimiento.id_requerimiento} />
                                        <label>{requerimiento.nombre + " - " + requerimiento.nombre_descriptivo.substr(0,30)}</label><br/>
                                    </div>
                                );
                            })}
                        </div>
                    </ModalBody>
                    <ModalFooter>
                        <button className="btn btn-success" onClick= {() => {this.props.seleccionarReq(this.state.seleccionado)}}>Seleccionar</button>
                        <button className="btn btn-danger" onClick={() => {this.props.cambiarEstado()}}>Cancelar</button>
                    </ModalFooter>
                </Modal>
            </React.Fragment>
        );
    }
}
export default ModalReqPropuesta
