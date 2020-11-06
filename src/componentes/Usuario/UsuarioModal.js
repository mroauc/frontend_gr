import { useRadioGroup } from '@material-ui/core';
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
            tipo: '',
            email: ''
        },
        cliente: {
            id_cliente: '',
            celular: '',
            id_empresa: '',
            id_user: ''
        },
        empresas: []
    }

    componentDidMount(){
        this.getEmpresas();
    }

    componentWillReceiveProps(next_props){
        this.setState({usuario: this.props.usuario});
        this.getCliente(this.props.usuario);
    }

    getUsuarioByEmail = async () => {
        const token = localStorage.getItem('token');
        await Axios.get(`http://localhost:8080/api/usuario/${this.state.usuario.email}`,{headers: {"Authorization": `Bearer  ${token}`}})
            .then(async response => {
                await this.setState({
                    cliente:{
                        id_cliente: this.state.cliente.id_cliente,
                        celular: this.state.cliente.celular,
                        id_empresa: this.state.cliente.id_empresa,
                        id_user: response.data.id
                    }
                });
            })
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
        .then(async response=>{

            if(this.state.usuario.tipo === "cliente"){
                await this.getUsuarioByEmail();
                await Axios.post("http://localhost:8080/api/cliente/guardar", this.state.cliente,{headers: {"Authorization": `Bearer  ${token}`}})
            }

            this.props.modalInsertar();
            this.props.index();
        })
    }

    guardarActualizacion=()=>{
        
        const token = localStorage.getItem('token');

        console.log(this.state.usuario);
        Axios.post('http://localhost:8080/api/usuario/editar/',this.state.usuario,{headers: {"Authorization": `Bearer  ${token}`}})
        .then(response=>{
            this.props.modalInsertar();
            this.props.index();
        });
    }

    // getCliente = (id) => {
    //     if(id){
    //         const token = localStorage.getItem('token');
    //         console.log(id);
    //         axios.get(`http://localhost:8080/api/usuario/id/${id}`,{headers: {"Authorization": `Bearer  ${token}`}})
    //         .then(response => {
    //             this.setState({
    //                 usuario: response.data
    //             })
    //         })
    //     }
    // }

    esUsuario = () => {
        
        if(this.state.usuario.tipo === "cliente"){
            return (
            <div>
                <label htmlFor="razon_social">Celular</label>
                <input className="form-control" type="text" name="celular" id="celular" onChange={this.changeHandler2} value={this.state.cliente.celular}/>
                <br/>
                <label htmlFor="id_empresa">ID Empresa</label>
                <select className="form-control" type="text" name="id_empresa" id="id_empresa" onChange={this.changeHandler2} value={this.state.cliente.id_empresa}>
                    <option>Selecciona un Empresa</option>
                    {this.state.empresas.map(empresa => {
                        return(
                        <option value={empresa.id_empresa}>{empresa.id_empresa + " - " + empresa.razon_social}</option>
                        )
                    })}
                </select>
                <br/>
            </div>);
        }
    }

    getCliente = (usuario) => {
        if(usuario.tipo === "cliente"){
            const token = localStorage.getItem('token');
            console.log(usuario);
            Axios.get(`http://localhost:8080/api/cliente/id_usuario/${usuario.id}`,{headers: {"Authorization": `Bearer  ${token}`}})
            .then(response => {
                this.setState({
                    cliente: response.data
                })
            })
        }
    }
    
    getEmpresas = async () => {
        const token = localStorage.getItem('token');
        
        await Axios.get("http://localhost:8080/api/empresa/",{headers: {"Authorization": `Bearer  ${token}`}}).then(response=>{
            this.setState({
                empresas: response.data
            })
        });
    }

    changeHandler=async(e)=>{
        await this.setState({
            usuario:{
                ...this.state.usuario, [e.target.name]: e.target.value
            }
        });
    }

    changeHandler2=async(e)=>{
        await this.setState({
            cliente:{
                ...this.state.cliente, [e.target.name]: e.target.value
            }
        });
    }

    changeRol=async(e)=>{
        const copiaUsuario = {...this.state.usuario};
        copiaUsuario.rol = e.target.value;
        copiaUsuario.tipo = e.target.value;
        await this.setState({usuario: copiaUsuario});
    }

    render(){
        return(
            <React.Fragment>    
                <Modal isOpen={this.props.estadoModalInsertar} toggle={()=>this.props.modalInsertar()}>
                    <ModalHeader style={{display:'block'}}>
                        <span>{(this.props.tipoModal==='insertar') ? 'Ingresar Usuario' :'Editar Usuario'}</span>

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
                            <select name="rol" id="rol" className="form-control" value={this.state.usuario.tipo} onChange={this.changeRol}>
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
                            {this.esUsuario()}
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