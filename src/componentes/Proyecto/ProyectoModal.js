import Axios from 'axios';
import React, { Component } from 'react'
import { Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';

class ProyectoModal extends Component{
    state={
        proyecto: {
            id_proyecto: 0,
            nombre: '',
            fecha_inicio: '',
            fecha_fin: '',
            id_usuario: '',
            fecha_creacion: ''
        }
    }

    componentWillReceiveProps(next_props){
        this.setState({proyecto: this.props.proyecto});
    }

    guardar=async()=>{
        const token = localStorage.getItem('token');
        await Axios.post('http://localhost:8080/api/proyecto/guardar/',{
            nombre: this.state.proyecto.nombre,
            fecha_inicio: this.state.proyecto.fecha_inicio,
            fecha_fin: this.state.proyecto.fecha_fin,
            id_usuario: this.state.proyecto.id_usuario,
            fecha_creacion: new Date().toLocaleString()
        },{headers: {"Authorization": `Bearer ${token}`}})
        .then(response=>{
            this.props.modalInsertar();
            this.props.index();
        })
    }
    
    guardarActualizacion=()=>{
        const token = localStorage.getItem('token');
        Axios.post('http://localhost:8080/api/proyecto/editar/',this.state.proyecto, {headers: {"Authorization": `Bearer ${token}`}})
        .then(response=>{
            this.props.modalInsertar();
            this.props.index();
        })
    }

    changeHandler=async(e)=>{
        await this.setState({
            proyecto:{
                ...this.state.proyecto, [e.target.name]: e.target.value
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
                            <label htmlFor="id_proyecto">ID</label>
                            <input className="form-control" type="text" name="id_proyecto" id="id_proyecto" value={this.state.proyecto.id_proyecto} readOnly/>
                            <br/>
                            <label htmlFor="nombre">Nombre</label>
                            <input className="form-control" type="text" name="nombre" id="nombre" onChange={this.changeHandler} value={this.state.proyecto.nombre} />
                            <br/>
                            <label htmlFor="fecha_inicio">Fecha de Inicio</label>
                            <input className="form-control" type="date" name="fecha_inicio" id="fecha_inicio" onChange={this.changeHandler} value={this.state.proyecto.fecha_inicio} />
                            <br/>
                            <label htmlFor="fecha_fin">Fecha de Fin</label>
                            <input className="form-control" type="date" name="fecha_fin" id="fecha_fin" onChange={this.changeHandler} value={this.state.proyecto.fecha_fin} />
                            <br/>
                            <label htmlFor="id_usuario">ID Usuario</label>
                            <input className="form-control" type="text" name="id_usuario" id="id_usuario" value={this.state.proyecto.id_usuario} readOnly/>
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

export default ProyectoModal;