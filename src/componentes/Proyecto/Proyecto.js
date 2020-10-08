import Axios from 'axios';
import React, {Component} from 'react';
import { Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';

class Proyecto extends Component{

    state={
        proyectos: [],
        modalInsertar: false,
        modalEliminar: false,
        tipoModal: '',
        id_proyecto: 0,
        nombre: '',
        fecha_inicio: '',
        fecha_fin: '',
        id_usuario: '',
        created_at: ''
    }

    index=()=>{
        Axios.get('http://localhost:8080/api/proyecto/')
        .then(response=>{
            this.setState({
                proyectos: response.data
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
        await Axios.post('http://localhost:8080/api/proyecto/guardar/',{
            nombre: this.state.nombre,
            fecha_inicio: this.state.fecha_inicio,
            fecha_fin: this.state.fecha_fin,
            id_usuario: this.state.id_usuario,
            created_at: this.state.created_at
        })
        .then(response=>{
            this.modalInsertar();
            this.index();
        })
    }

    editar=(proyecto)=>{
        this.setState({
            id_proyecto: proyecto.id_proyecto,
            nombre: proyecto.nombre,
            fecha_inicio: proyecto.fecha_inicio,
            fecha_fin: proyecto.fecha_fin,
            id_usuario: proyecto.id_usuario,
            created_at: proyecto.created_at
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
        Axios.post('http://localhost:8080/api/proyecto/editar/',{
            id_proyecto: this.state.id_proyecto,
            nombre: this.state.nombre,
            fecha_inicio: this.state.fecha_inicio,
            fecha_fin: this.state.fecha_fin,
            id_usuario: this.state.id_usuario,
            created_at: this.state.created_at
        })
        .then(response=>{
            this.modalInsertar();
            this.index();
        })
    }

    eliminar=()=>{
        Axios.delete(`http://localhost:8080/api/proyecto/eliminar/${this.state.id_proyecto}`)
        .then(response=>{
            this.setState({modalEliminar:false});
            this.index();
        })
    }

    render(){
        return(
            <div className="Proyecto">
                <h2>Proyecto</h2>
                <br/>
                <button className="btn btn-success" onClick={()=>{this.setState({id_proyecto:0, nombre:'', fecha_inicio:'',fecha_fin:'',id_usuario:'',created_at:''}); this.modalInsertar()}}>Insertar</button>
                <br/><br/>
                <table className="table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Nombre</th>
                            <th>Fecha de Inicio</th>
                            <th>Fecha de Fin</th>
                            <th>ID Usuario</th>
                            <th>Editar</th>
                            <th>Eliminar</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.state.proyectos.map(proyecto=>
                            <tr key={proyecto.id_proyecto}>
                                <td>{proyecto.id_proyecto}</td>
                                <td>{proyecto.nombre}</td>
                                <td>{proyecto.fecha_inicio}</td>
                                <td>{proyecto.fecha_fin}</td>
                                <td>{proyecto.id_usuario}</td>
                                <td>
                                    <button className="btn btn-warning" onClick={()=>this.editar(proyecto)}>Editar</button>
                                </td>
                                <td>
                                    <button className="btn btn-danger" onClick={()=>this.setState({modalEliminar:true, id_proyecto:proyecto.id_proyecto})}>Eliminar</button>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>

                <Modal isOpen={this.state.modalInsertar}>
                    <ModalHeader style={{display: 'block'}}>
                        <span style={{float: 'right'}} onClick={()=>{this.modalInsertar()}}>X</span>
                    </ModalHeader>
                    <ModalBody>
                        <div className="form-group">
                            <label htmlFor="id_proyecto">ID</label>
                            <input className="form-control" type="text" name="id_proyecto" id="id_proyecto" value={this.state.id_proyecto} readOnly/>
                            <br/>
                            <label htmlFor="nombre">Nombre</label>
                            <input className="form-control" type="text" name="nombre" id="nombre" onChange={(e)=>this.setState({nombre:e.target.value})} value={this.state.nombre} />
                            <br/>
                            <label htmlFor="fecha_inicio">Fecha de Inicio</label>
                            <input className="form-control" type="date" name="fecha_inicio" id="fecha_inicio" onChange={(e)=>this.setState({fecha_inicio:e.target.value})} value={this.state.fecha_inicio} />
                            <br/>
                            <label htmlFor="fecha_fin">Fecha de Fin</label>
                            <input className="form-control" type="date" name="fecha_fin" id="fecha_fin" onChange={(e)=>this.setState({fecha_fin:e.target.value})} value={this.state.fecha_fin} />
                            <br/>
                            <label htmlFor="id_usuario">ID Usuario</label>
                            <input className="form-control" type="text" name="id_usuario" id="id_usuario" onChange={(e)=>this.setState({id_usuario:e.target.value})} value={this.state.id_usuario} />
                            <br/>
                            <label htmlFor="created_at">Created At</label>
                            <input className="form-control" type="date" name="created_at" id="created_at" onChange={(e)=>this.setState({created_at:e.target.value})} value={this.state.created_at} />
                            <br/>
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
                        ¿Seguro que desea eliminar el proyecto?
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

export default Proyecto;