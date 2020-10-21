import Axios from 'axios';
import React, { Component } from 'react'
import { Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';

class RequerimientoModal extends Component{
    state={
        requerimiento:{
            id_requerimiento: 0,
            descripcion: '',
            id_usuario: '',
            id_subProyecto: '',
            fecha_creacion: '',
            prioridad: '',
            estado: '',
            categoria: '',
            id_template: ''
        }
    }

    componentWillReceiveProps(next_props){
        this.setState({requerimiento: this.props.requerimiento});
    }

    guardar=async()=>{
        const token = localStorage.getItem('token');
        await Axios.post('http://localhost:8080/api/requerimiento/guardar/',{
            descripcion: this.state.requerimiento.descripcion,
            id_usuario: this.state.requerimiento.id_usuario,
            id_subProyecto: this.state.requerimiento.id_subProyecto,
            fecha_creacion: new Date().toLocaleString(),
            prioridad: this.state.requerimiento.prioridad,
            estado: this.state.requerimiento.estado,
            categoria: this.state.requerimiento.categoria,
            id_template: this.state.requerimiento.id_template
        }, {headers: {"Authorization" : `Bearer ${token}`}})
        .then(response=>{
            this.props.modalInsertar();
            this.props.index();
        })
    }

    guardarActualizacion=()=>{
        const token = localStorage.getItem('token');
        Axios.post('http://localhost:8080/api/requerimiento/editar/',this.state.requerimiento, {headers: {"Authorization" : `Bearer ${token}`}})
        .then(response=>{
            this.props.modalInsertar();
            this.props.index();
        })
    }

    changeHandler=async(e)=>{
        await this.setState({
            requerimiento:{
                ...this.state.requerimiento, [e.target.name]: e.target.value
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
                            <label htmlFor="id_requerimiento">ID</label>
                            <input className="form-control" type="text" name="id_requerimiento" id="id_requerimiento" value={this.state.requerimiento.id_requerimiento} readOnly/>
                            <br/>
                            <label htmlFor="descripcion">Descripcion</label>
                            <input className="form-control" type="text" name="descripcion" id="descripcion" onChange={this.changeHandler} value={this.state.requerimiento.descripcion} />
                            <br/>
                            <label htmlFor="id_usuario">ID Usuario</label>
                            <input className="form-control" type="text" name="id_usuario" id="id_usuario" onChange={this.changeHandler} value={this.state.requerimiento.id_usuario} />
                            <br/>
                            <label htmlFor="id_subProyecto">ID Sub-Proyecto</label>
                            <input className="form-control" type="text" name="id_subProyecto" id="id_subProyecto" onChange={this.changeHandler} value={this.state.requerimiento.id_subProyecto} />
                            <br/>
                            <label htmlFor="prioridad">Prioridad</label>
                            <select className="form-control" name="prioridad" id="prioridad" value={this.state.requerimiento.prioridad} onChange={this.changeHandler}>
                                <option value="Baja">Baja</option>
                                <option value="Media">Media</option>
                                <option value="Alta">Alta</option>
                            </select>
                            <br/>
                            <label htmlFor="estado">Estado</label><br/>
                            <select className="form-control" name="estado" id="estado" value={this.state.requerimiento.estado} onChange={this.changeHandler}>
                                <option value="Creado">Creado</option>
                                <option value="En Redaccion">En Redaccion</option>
                                <option value="Aprobado">Aprobado</option>
                            </select>
                            <br/>
                            <label htmlFor="categoria">Categoría</label>
                            <input className="form-control" type="text" name="categoria" id="categoria" onChange={this.changeHandler} value={this.state.requerimiento.categoria} />
                            <br/>
                            <label htmlFor="id_template">ID Template</label>
                            <input className="form-control" type="text" name="id_template" id="id_template" onChange={this.changeHandler} value={this.state.requerimiento.id_template} />
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
                            <button className="btn btn-danger" onClick={()=>this.props.modalInsertar()}>Cancelar</button>
                    </ModalFooter>
                </Modal>
            </React.Fragment>
        );
    }
}

export default RequerimientoModal;