import Axios from 'axios';
import React, { Component } from 'react'
import { Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';

class UsuarioModal extends Component{
    state={
        usuario: {
            id_usuario: 0,
            estado: '',
            nombre: '',
            password: '',
            rol: '',
            email: ''
        }
    }

    componentWillReceiveProps(next_props){
        this.setState({usuario: this.props.usuario});
    }

    guardar=async()=>{
        const token = localStorage.getItem('token');
        await Axios.post('http://localhost:8080/auth/nuevo/',{
            nombre: this.state.usuario.nombre,
            email: this.state.usuario.email,
            estado: this.state.usuario.estado,
            tipo: this.state.usuario.rol,
            password: this.state.usuario.password,
            roles: [this.state.usuario.rol]
        },{headers:{"Authorization": `Bearer ${token}`}})
        .then(response=>{
            this.props.modalInsertar();
            this.props.index();
        })
    }

    guardarActualizacion=()=>{
        Axios.post('http://localhost:8080/api/usuario/editar/',this.state.usuario)
        .then(response=>{
            this.props.modalInsertar();
            this.props.index();
        })
    }

    changeHandler=async(e)=>{
        await this.setState({
            usuario:{
                ...this.state.usuario, [e.target.name]: e.target.value
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
                            <label htmlFor="id_usuario">ID</label>
                            <input className="form-control" type="text" name="id_usuario" id="id_usuario" value={this.state.usuario.id_usuario} readOnly/>
                            <br/>
                            <label htmlFor="nombre">Nombre del usuario</label>
                            <input className="form-control" type="text" name="nombre" id="nombre" onChange={this.changeHandler} value={this.state.usuario.nombre} />
                            <br/>
                            <label htmlFor="email">Email del usuario</label>
                            <input className="form-control" type="text" name="email" id="email" onChange={this.changeHandler} value={this.state.usuario.email} />
                            <br/>
                            <label htmlFor="rol">Tipo de usuario</label>
                            <select name="rol" id="rol" className="form-control" value={this.state.usuario.rol} onChange={this.changeHandler}>
                                <option value="analista">Analista</option>
                                <option value="lider">Lider de subproyecto</option>
                                <option value="jefe">Jefe de proyecto</option>
                                <option value="cliente">Cliente</option>
                                <option value="admin">Administrador del Sistema</option>
                            </select>
                            <br/>
                            <label htmlFor="estado">Estado de usuario</label>
                                <select name="estado" id="estado" className="form-control" value={this.state.usuario.estado} onChange={this.changeHandler}>
                                    <option value="Activo" selected>Activo</option>
                                    <option value="Inactivo">Inactivo</option>
                                </select>
                            <br/>
                            <label htmlFor="password">Contraseña</label>
                            <input className="form-control" type="password" name="password" id="password" onChange={this.changeHandler} value={this.state.usuario.password} />
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

export default UsuarioModal;