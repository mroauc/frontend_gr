import Axios from 'axios';
import React, { Component } from 'react'
import { Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';

class RelacionRequerimientosModal extends Component{
    state={
        relacion: {
            id_relacionRequerimientos: 0,
            id_requerimiento_a: '',
            id_requerimiento_b: ''
        }
    }

    componentWillReceiveProps(next_props){
        this.setState({relacion: this.props.relacion});
    }

    guardar=async()=>{
        await Axios.post('http://localhost:8080/api/relacionrequerimientos/guardar/',{
            id_requerimiento_a: this.state.relacion.id_requerimiento_a,
            id_requerimiento_b: this.state.relacion.id_requerimiento_b
        })
        .then(response=>{
            this.props.modalInsertar();
            this.props.index();
        })
    }

    guardarActualizacion=()=>{
        Axios.post('http://localhost:8080/api/relacionrequerimientos/editar/',this.state.relacion)
        .then(response=>{
            this.props.modalInsertar();
            this.props.index();
        })
    }

    changeHandler=async(e)=>{
        await this.setState({
            relacion:{
                ...this.state.relacion, [e.target.name]: e.target.value
            }
        });
    }

    render(){
        return(
            <React.Fragment>
                <Modal isOpen={this.props.estadoModalInsertar}>
                    <ModalHeader style={{display:'block'}}>
                        <span style={{cursor:'pointer', float:'right'}} onClick={()=>this.props.modalInsertar()}>X</span>
                    </ModalHeader>
                    <ModalBody>
                        <div className="form-group">
                        <label htmlFor="id_relacionRequerimientos">ID</label>
                            <input className="form-control" type="text" name="id_relacionRequerimientos" id="id_relacionRequerimientos" value={this.state.relacion.id_relacionRequerimientos} readOnly/>
                            <br/>
                            <label htmlFor="id_requerimiento_a">ID Requerimiento A</label>
                            <input className="form-control" type="text" name="id_requerimiento_a" id="id_requerimiento_a" onChange={this.changeHandler} value={this.state.relacion.id_requerimiento_a}/>
                            <br/>
                            <label htmlFor="id_requerimiento_b">ID Requerimiento B</label>
                            <input className="form-control" type="text" name="id_requerimiento_b" id="id_requerimiento_b" onChange={this.changeHandler} value={this.state.relacion.id_requerimiento_b}/>
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

export default RelacionRequerimientosModal;