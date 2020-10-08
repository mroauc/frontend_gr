import Axios from 'axios';
import React, { Component } from 'react';
import { Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';

class Errores extends Component{

    state={
        errores: [],
        modalInsertar: false,
        modalEliminar: false,
        tipoModal: '',
        id_error: 0,
        contenido: '',
        id_usuario: ''
    }

    index=()=>{
        Axios.get('http://localhost:8080/api/errores/')
        .then(response=>{
            this.setState({
                errores: response.data
            });
        })
    }

    componentDidMount(){
        this.index();
    }

    modalInsertar=()=>{
        this.setState({
            modalInsertar: !this.state.modalInsertar,
            tipoModal: 'insertar'
        });
    }

    guardar=async()=>{
        await Axios.post('http://localhost:8080/api/errores/guardar/',{
            contenido: this.state.contenido,
            id_usuario: this.state.id_usuario
        })
        .then(response=>{
            this.modalInsertar();
            this.index();
        })
    }

    editar=(errorsingle)=>{
        this.setState({
            id_error: errorsingle.id_error,
            contenido: errorsingle.contenido,
            id_usuario: errorsingle.id_usuario
        });
        this.modalActualizar();
    }

    modalActualizar=()=>{
        this.setState({
            modalInsertar: !this.state.modalInsertar,
            tipoModal: 'actualizar'
        });
    }

    guardarActualizacion=()=>{
        Axios.post('http://localhost:8080/api/errores/editar/',{
            id_error: this.state.id_error,
            contenido: this.state.contenido,
            id_usuario: this.state.id_usuario
        })
        .then(response=>{
            this.modalInsertar();
            this.index();
        })
    }

    eliminar=()=>{
        Axios.delete(`http://localhost:8080/api/errores/eliminar/${this.state.id_error}`)
        .then(response=>{
            this.setState({modalEliminar:false});
            this.index();
        })
    }

    render(){
        return(
            <div className="Errores">
                <h2>Errores</h2>
                <br/>
                <button className="btn btn-success" onClick={()=>{this.setState({id_error:0, contenido: '', id_usuario: '', tipoModal: ''}); this.modalInsertar()}}>Insertar</button>
                <br/><br/>
                <table className="table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Contenido</th>
                            <th>Usuario Asociado</th>
                            <th>Editar</th>
                            <th>Eliminar</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.state.errores.map(errorsingle=>
                            <tr key={errorsingle.id_error}>
                                <td>{errorsingle.id_error}</td>
                                <td>{errorsingle.contenido}</td>
                                <td>{errorsingle.id_usuario}</td>
                                <td>
                                    <button className="btn btn-warning" onClick={()=>this.editar(errorsingle)}>Editar</button>
                                </td>
                                <td>
                                    <button className="btn btn-danger" onClick={()=>this.setState({id_error:errorsingle.id_error, modalEliminar: true})}>Eliminar</button>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>

                <Modal isOpen={this.state.modalInsertar}>
                    <ModalHeader style={{display: 'block'}}>
                        <span style={{float: 'right'}} onClick={()=>this.modalInsertar()}>X</span>
                    </ModalHeader>
                    <ModalBody>
                        <div className="form-group">
                            <label htmlFor="id_error">ID</label>
                            <input className="form-control" type="text" name="id_error" id="id_error" value={this.state.id_error} readOnly/>
                            <br/>
                            <label htmlFor="contenido">Contenido</label>
                            <input className="form-control" type="text" name="contenido" id="contenido" onChange={(e)=>this.setState({contenido:e.target.value})} value={this.state.contenido}/>
                            <br/>
                            <label htmlFor="id_usuario">ID Usuario</label>
                            <input className="form-control" type="text" name="id_usuario" id="id_usuario" onChange={(e)=>this.setState({id_usuario:e.target.value})} value={this.state.id_usuario}/>
                        </div>
                    </ModalBody>
                    <ModalFooter>
                        {this.state.tipoModal==='insertar'?
                            <button className="btn btn-success" onClick={()=>this.guardar()}>
                                Insertar
                            </button>
                            :
                            <button className="btn btn-success" onClick={()=>this.guardarActualizacion()}>
                                Actualizar
                            </button>
                        }
                            <button className="btn btn-danger" onClick={()=>this.modalInsertar()}>Cancelar</button>
                    </ModalFooter>
                </Modal>

                <Modal isOpen={this.state.modalEliminar}>
                    <ModalBody>
                        ¿Seguro que desea eliminar el error?
                    </ModalBody>
                    <ModalFooter>
                        <button className="btn btn-danger" onClick={()=>this.eliminar()}>Si</button>
                        <button className="btn btn-secundary" onClick={()=>this.setState({modalEliminar:false})}>No</button>
                    </ModalFooter>
                </Modal>
            </div>
        );
    }
}

export default Errores;