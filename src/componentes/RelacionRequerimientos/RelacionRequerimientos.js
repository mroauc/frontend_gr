import Axios from 'axios';
import React, { Component } from 'react';
import { Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';

class RelacionRequerimientos extends Component{

    state={
        relacionesRequerimientos: [],
        modalInsertar: false,
        modalEliminar: false,
        tipoModal: '',
        id_relacionRequerimientos: 0,
        id_requerimiento_a: '',
        id_requerimiento_b: ''
    }

    index=()=>{
        Axios.get('http://localhost:8080/api/relacionrequerimientos/')
        .then(response=>{
            this.setState({
                relacionesRequerimientos: response.data
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
        await Axios.post('http://localhost:8080/api/relacionrequerimientos/guardar/',{
            id_requerimiento_a: this.state.id_requerimiento_a,
            id_requerimiento_b: this.state.id_requerimiento_b
        })
        .then(response=>{
            this.modalInsertar();
            this.index();
        })
    }

    editar=(relacionRequerimientos)=>{
        this.setState({
            id_relacionRequerimientos: relacionRequerimientos.id_relacionRequerimientos,
            id_requerimiento_a: relacionRequerimientos.id_requerimiento_a,
            id_requerimiento_b: relacionRequerimientos.id_requerimiento_b
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
        Axios.post('http://localhost:8080/api/relacionrequerimientos/editar/',{
            id_relacionRequerimientos: this.state.id_relacionRequerimientos,
            id_requerimiento_a: this.state.id_requerimiento_a,
            id_requerimiento_b: this.state.id_requerimiento_b
        })
        .then(response=>{
            this.modalInsertar();
            this.index();
        })
    }

    eliminar=()=>{
        Axios.delete(`http://localhost:8080/api/relacionrequerimientos/eliminar/${this.state.id_relacionRequerimientos}`)
        .then(response=>{
            this.setState({modalEliminar:false});
            this.index();
        })
    }

    render(){
        return(
            <div className="relacionRequerimientos">
                <h2>Relaciones entre Requerimientos</h2>
                <br/>
                <button className="btn btn-success" onClick={()=>{this.setState({id_relacionRequerimientos:0, id_requerimiento_a: '', id_requerimiento_b: ''}); this.modalInsertar()}}>Insertar</button>
                <br/><br/>
                <table className="table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>ID Requerimiento A</th>
                            <th>ID Requerimiento B</th>
                            <th>Editar</th>
                            <th>Eliminar</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.state.relacionesRequerimientos.map(relacionRequerimientos=>
                            <tr key={relacionRequerimientos.id_relacionRequerimientos}>
                                <td>{relacionRequerimientos.id_relacionRequerimientos}</td>
                                <td>{relacionRequerimientos.id_requerimiento_a}</td>
                                <td>{relacionRequerimientos.id_requerimiento_b}</td>
                                <td>
                                    <button className="btn btn-warning" onClick={()=>this.editar(relacionRequerimientos)}>Editar</button>
                                </td>
                                <td>
                                    <button className="btn btn-danger" onClick={()=>this.setState({id_relacionRequerimientos:relacionRequerimientos.id_relacionRequerimientos, modalEliminar: true})}>Eliminar</button>
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
                            <label htmlFor="id_relacionRequerimientos">ID</label>
                            <input className="form-control" type="text" name="id_relacionRequerimientos" id="id_relacionRequerimientos" value={this.state.id_relacionRequerimientos} readOnly/>
                            <br/>
                            <label htmlFor="id_requerimiento_a">ID Requerimiento A</label>
                            <input className="form-control" type="text" name="id_requerimiento_a" id="id_requerimiento_a" onChange={(e)=>this.setState({id_requerimiento_a:e.target.value})} value={this.state.id_requerimiento_a}/>
                            <br/>
                            <label htmlFor="id_requerimiento_b">ID Requerimiento B</label>
                            <input className="form-control" type="text" name="id_requerimiento_b" id="id_requerimiento_b" onChange={(e)=>this.setState({id_requerimiento_b:e.target.value})} value={this.state.id_requerimiento_b}/>
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
                        ¿Seguro que desea eliminar la relacion entre requerimientos?
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

export default RelacionRequerimientos;