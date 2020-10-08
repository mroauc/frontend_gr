import Axios from 'axios';
import React, {Component} from 'react';
import { Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';

class Usuario extends Component{

    state={
        usuarios: [],
        modalInsertar: false,
        modalEliminar: false,
        tipoModal: '',
        id_usuario: 0,
        estado: '',
        nombre: '',
        password: '',
        rol: ''
    }

    index=()=>{
        Axios.get('http://localhost:8080/api/usuario/')
        .then(response=>{
            this.setState({
                usuarios: response.data
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
        await Axios.post('http://localhost:8080/api/usuario/guardar/',{
            estado: this.state.estado,
            nombre: this.state.nombre,
            password: this.state.password,
            rol: this.state.rol
        })
        .then(response=>{
            this.modalInsertar();
            this.index();
        })
    }

    editar=(usuario)=>{
        this.setState({
            id_usuario: usuario.id_usuario,
            estado: usuario.estado,
            nombre: usuario.nombre,
            password: usuario.password,
            rol: usuario.rol
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
        Axios.post('http://localhost:8080/api/usuario/editar/',{
            id_usuario: this.state.id_usuario,
            estado: this.state.estado,
            nombre: this.state.nombre,
            password: this.state.password,
            rol: this.state.rol
        })
        .then(response=>{
            this.modalInsertar();
            this.index();
        })
    }

    eliminar=()=>{
        Axios.delete(`http://localhost:8080/api/usuario/eliminar/${this.state.id_usuario}`)
        .then(response=>{
            this.setState({modalEliminar:false});
            this.index();
        })
    }

    render(){
        return(
            <div className="Usuario">
                <h2>Usuario</h2>
                <br/>
                <button className="btn btn-success" onClick={()=>{this.setState({id_usuario:0, estado:'', nombre:'',password:'',rol:''}); this.modalInsertar()}}>Insertar</button>
                <br/><br/>
                <table className="table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Nombre</th>
                            <th>Estado</th>
                            <th>Rol</th>
                            <th>Editar</th>
                            <th>Eliminar</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.state.usuarios.map(usuario=>
                            <tr key={usuario.id_usuario}>
                                <td>{usuario.id_usuario}</td>
                                <td>{usuario.nombre}</td>
                                <td>{usuario.estado}</td>
                                <td>{usuario.rol}</td>
                                <td>
                                    <button className="btn btn-warning" onClick={()=>this.editar(usuario)}>Editar</button>
                                </td>
                                <td>
                                    <button className="btn btn-danger" onClick={()=>this.setState({modalEliminar:true, id_usuario:usuario.id_usuario})}>Eliminar</button>
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
                            <label htmlFor="id_usuario">ID</label>
                            <input className="form-control" type="text" name="id_usuario" id="id_usuario" value={this.state.id_usuario} readOnly/>
                            <br/>
                            <label htmlFor="nombre">Nombre</label>
                            <input className="form-control" type="text" name="nombre" id="nombre" onChange={(e)=>this.setState({nombre:e.target.value})} value={this.state.nombre} />
                            <br/>
                            <label htmlFor="password">Password</label>
                            <input className="form-control" type="text" name="password" id="password" onChange={(e)=>this.setState({password:e.target.value})} value={this.state.password} />
                            <br/>
                            <label htmlFor="estado">Estado</label><br/>
                            <select name="estado" id="estado" value={this.state.estado} onChange={(e)=>this.setState({estado: e.target.value})}>
                                <option value="Activo">Activo</option>
                                <option value="Inactivo">Inactivo</option>
                            </select>
                            <br/><br/>
                            <label htmlFor="rol">Rol</label><br/>
                            <select name="rol" id="rol" value={this.state.rol} onChange={(e)=>this.setState({rol:e.target.value})}>
                                <option value="Analista">Analista</option>
                                <option value="Lider de subproyecto">Lider de subproyecto</option>
                                <option value="Jefe de proyecto">Jefe de proyecto</option>
                                <option value="Cliente">Cliente</option>
                                <option value="Administrador del Sistema">Administrador del Sistema</option>
                            </select>
                            <br/><br/>
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
                        ¿Seguro que desea eliminar el usuario?
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

export default Usuario;