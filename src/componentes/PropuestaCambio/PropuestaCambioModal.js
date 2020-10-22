import Axios from 'axios';
import React, { Component } from 'react'
import { Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';

class PropuestaCambioModal extends Component{
    state={
        propuestaCambio: {
            id_propuestaCambio: 0,
            nombre: '',
            id_modulo: 0,
            fecha_peticion: 0,
            id_usuario: '',
            descripcion: '',
            justificacion: '',
            alternativas: '',
            consecuencias_rechazo: '',
            fecha_resolucion: '',
            comentarios: '',
            estado: 'Pendiente'
        }
    }

    componentWillReceiveProps(next_props){
        this.setState({propuestaCambio: this.props.propuestaCambio});
    }

    guardar=async()=>{
        const token = localStorage.getItem('token');
        await Axios.post('http://localhost:8080/api/propuestacambio/guardar/',{
            nombre: this.state.propuestaCambio.nombre,
            id_modulo: this.state.propuestaCambio.id_modulo,
            fecha_peticion: this.state.propuestaCambio.fecha_peticion,
            id_usuario: this.state.propuestaCambio.id_usuario,
            descripcion: this.state.propuestaCambio.descripcion,
            justificacion: this.state.propuestaCambio.justificacion,
            alternativas: this.state.propuestaCambio.alternativas,
            consecuencias_rechazo: this.state.propuestaCambio.consecuencias_rechazo,
            fecha_resolucion: this.state.propuestaCambio.fecha_resolucion,
            comentarios: this.state.propuestaCambio.comentarios,
            estado: this.state.propuestaCambio.estado
        },{headers: {"Authorization": `Bearer ${token}`}})
        .then(response=>{
            this.props.modalInsertar();
            this.props.index();
        })
    }

    guardarActualizacion=()=>{
        const token = localStorage.getItem('token');
        Axios.post('http://localhost:8080/api/propuestacambio/editar/',this.state.propuestaCambio, {headers: {"Authorization": `Bearer ${token}`}})
        .then(response=>{
            this.props.modalInsertar();
            this.props.index();
        })
    }

    changeHandler=async(e)=>{
        await this.setState({
            propuestaCambio:{
                ...this.state.propuestaCambio, [e.target.name]: e.target.value
            }
        });
    }

    render(){
        return(
            <React.Fragment>
                <Modal isOpen={this.props.estadoModalInsertar}>
                    <ModalHeader style={{display:'block'}}>
                        <span style={{cursor:'pointer', float:'right'}} onClick={()=>{this.props.modalInsertar()}}>X</span>
                    </ModalHeader>
                    <ModalBody>
                        <div className="form-group">
                            <label htmlFor="id_propuestaCambio">ID</label>
                            <input className="form-control" type="text" name="id_propuestaCambio" id="id_propuestaCambio" value={this.state.propuestaCambio.id_propuestaCambio} readOnly/>
                            <br/>
                            <label htmlFor="nombre">Nombre</label>
                            <input className="form-control" type="text" name="nombre" id="nombre" onChange={this.changeHandler} value={this.state.propuestaCambio.nombre} />
                            <br/>
                            <label htmlFor="id_modulo">ID Modulo</label>
                            <input className="form-control" type="text" name="id_modulo" id="id_modulo" onChange={this.changeHandler} value={this.state.propuestaCambio.id_modulo} />
                            <br/>
                            <label htmlFor="fecha_peticion">Fecha de Peticion</label>
                            <input className="form-control" type="date" name="fecha_peticion" id="fecha_peticion" onChange={this.changeHandler} value={this.state.propuestaCambio.fecha_peticion} />
                            <br/>
                            <label htmlFor="id_usuario">Autor</label>
                            <input className="form-control" type="number" name="id_usuario" id="id_usuario" onChange={this.changeHandler} value={this.state.propuestaCambio.id_usuario} />
                            <br/>
                            <label htmlFor="descripcion">Descripcion</label>
                            <input className="form-control" type="text" name="descripcion" id="descripcion" onChange={this.changeHandler} value={this.state.propuestaCambio.descripcion} />
                            <br/>
                            <label htmlFor="justificacion">Justificacion</label>
                            <input className="form-control" type="number" name="justificacion" id="justificacion" onChange={this.changeHandler} value={this.state.propuestaCambio.justificacion} />
                            <br/>
                            <label htmlFor="alternativas">Alternativas</label>
                            <input className="form-control" type="text" name="alternativas" id="alternativas" onChange={this.changeHandler} value={this.state.propuestaCambio.alternativas} />
                            <br/>
                            <label htmlFor="consecuencias_rechazo">Consecuencias Rechazo</label>
                            <input className="form-control" type="text" name="consecuencias_rechazo" id="consecuencias_rechazo" onChange={this.changeHandler} value={this.state.propuestaCambio.consecuencias_rechazo} />
                            <br/>
                            <label htmlFor="fecha_resolucion">Fecha de Resolucion</label>
                            <input className="form-control" type="date" name="fecha_resolucion" id="fecha_resolucion" onChange={this.changeHandler} value={this.state.propuestaCambio.fecha_resolucion} />
                            <br/>
                            <label htmlFor="comentarios">Comentarios</label>
                            <input className="form-control" type="text" name="comentarios" id="comentarios" onChange={this.changeHandler} value={this.state.propuestaCambio.comentarios} />
                            <br/>
                            <label htmlFor="estado">Estado</label>
                            <input className="form-control" type="text" name="estado" id="estado" value={this.state.propuestaCambio.estado} readOnly/>
                            <br/>
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
                        <button className="btn btn-danger" onClick={()=>{this.props.modalInsertar()}}>Cancelar</button>
                    </ModalFooter>
                </Modal>

            </React.Fragment>
        );
    }

}

export default PropuestaCambioModal;