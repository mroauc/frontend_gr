import Axios from 'axios';
import React, { Component } from 'react'
import { Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';

export class ErroresModal extends Component{
    state={
        dataError: {
            id_error: 0,
            contenido: '',
            id_usuario: '',
            fecha: ''
        }
    }

    componentWillReceiveProps(next_props){
        this.setState({dataError: this.props.dataError});
    }

    guardar=async()=>{
        const token = localStorage.getItem('token');
        await Axios.post('http://localhost:8080/api/errores/guardar/',{
            contenido: this.state.dataError.contenido,
            id_usuario: this.state.dataError.id_usuario,
            fecha: new Date().toLocaleString()
        },{headers: {"Authorization": `Bearer ${token}`}})
        .then(response=>{
            this.props.modalInsertar();
            this.props.index();
        })
    }

    guardarActualizacion=()=>{
        const token = localStorage.getItem('token');
        Axios.post('http://localhost:8080/api/errores/editar/',this.state.dataError, {headers: {"Authorization": `Bearer ${token}`}})
        .then(response=>{
            this.props.modalInsertar();
            this.props.index();
        })
    }

    changeHandler=async(e)=>{
        await this.setState({
            dataError:{
                ...this.state.dataError, [e.target.name]: e.target.value
            }
        });
    }

    render(){
        return(
            <React.Fragment>
                <Modal isOpen={this.props.estadoModalInsertar} size="lg" toggle={()=>this.props.modalInsertar()}>
                    <ModalHeader style={{display:'block'}}>
                        <span style={{cursor:'pointer', float:'right'}} onClick={()=>this.props.modalInsertar()}>X</span>
                    </ModalHeader>
                    <ModalBody>
                        <div className="form-group">
                            <input className="form-control" type="text" name="id_error" id="id_error" value={this.state.dataError.id_error} readOnly hidden/>
                            <br/>
                            <label htmlFor="contenido">Contenido del Error</label>
                            <p><textarea className="form-control" type="text" name="contenido" id="contenido" rows="10" onChange={this.changeHandler} value={this.state.dataError.contenido}></textarea></p>
                            {/* <input className="form-control" type="text" name="contenido" id="contenido" onChange={this.changeHandler} value={this.state.dataError.contenido}/> */}
                            <br/>
                            <input className="form-control" type="text" name="id_usuario" id="id_usuario" value={this.state.dataError.id_usuario} readOnly hidden/>
                        </div>
                    </ModalBody>
                    <ModalFooter>
                        {this.props.tipoModal==='insertar'?
                            <button className="btn btn-success" onClick={()=>this.guardar()}>
                                Insertar
                            </button>
                            :
                            <button className="btn btn-success" onClick={()=>this.guardarActualizacion()}>
                                Actualizar
                            </button>
                        }
                            <button className="btn btn-danger" onClick={()=>this.props.modalInsertar()}>Cancelar</button>
                    </ModalFooter>
                </Modal>
            </React.Fragment>
        );
    }
}

export default ErroresModal;