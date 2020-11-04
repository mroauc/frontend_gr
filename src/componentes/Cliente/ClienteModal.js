import axios from 'axios';
import React, { Component } from 'react'
import { Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import './Cliente.css'

const url="http://localhost:8080/api/cliente/";

export default class ClienteModal extends Component {
    
    state ={
        cliente: {
            id_cliente: '',
            celular: '',
            id_empresa: '',
            id_user: ''
        },
        usuario : {
            id_usuario: '',
            estado: '',
            nombre: '',
            password: '',
            rol: 'cliente',
            email: ''
        },
        empresas: []
    }

    componentDidMount(){
        this.getEmpresas();
    }

    getUsuario = (id) => {
        if(id){
            const token = localStorage.getItem('token');
            console.log(id);
            axios.get(`http://localhost:8080/api/usuario/id/${id}`,{headers: {"Authorization": `Bearer  ${token}`}})
            .then(response => {
                this.setState({
                    usuario: response.data
                })
            })
        }
    }

    componentWillReceiveProps(next_props) {
        this.setState({ cliente: this.props.cliente});
        this.getUsuario(this.props.cliente.id_user);
       
    }

    guardarCliente = async () => {
        const token = localStorage.getItem('token');
        var urlGuardar = url + 'guardar';
        // tipo = rol
        if(this.props.estadoInsertar){
            await axios.post(`http://localhost:8080/auth/nuevo`, {
                nombre: this.state.usuario.nombre,
                email: this.state.usuario.email,
                estado: this.state.usuario.estado,
                tipo: this.state.usuario.rol,
                password: this.state.usuario.password,
                roles: [this.state.usuario.rol]
            },{headers: {"Authorization": `Bearer  ${token}`}})
            .then(async response => {
                await this.getUsuarioByEmail();
            })
        }
        else{
            await axios.post(`http://localhost:8080/api/usuario/editar`, {
                id: this.state.usuario.id,
                email: this.state.usuario.email,
                estado: this.state.usuario.estado,
                nombre: this.state.usuario.nombre,
                password: this.state.usuario.password,
                tipo: 'cliente'
            },{headers: {"Authorization": `Bearer  ${token}`}})
            .then(async response => {
                const copiaCliente = {...this.state.cliente};
                copiaCliente.id_user = response.data.id;
                this.setState({cliente: copiaCliente});
            })
        }

        axios.post(urlGuardar, this.state.cliente,{headers: {"Authorization": `Bearer  ${token}`}})
        .then(response => {
            (this.props.estadoEditar) ? this.props.cambiarEstadoEditar() : this.props.cambiarEstadoInsertar();
            this.props.getClientes();
            console.log(response);
        })
        .catch(error => {
            console.log(error)
        })
    }

        getUsuarioByEmail = async () => {
        const token = localStorage.getItem('token');
        await axios.get(`http://localhost:8080/api/usuario/${this.state.usuario.email}`,{headers: {"Authorization": `Bearer  ${token}`}})
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

    changeHandler = async (e) => {
        await this.setState({
            cliente : {
              ...this.state.cliente, [e.target.name]: e.target.value
            }
          });
    }

    changeHandler2 = async (e) => {
        await this.setState({
            usuario : {
              ...this.state.usuario, [e.target.name]: e.target.value
            }
        });
    }
    
    getEmpresas = async () => {
        const token = localStorage.getItem('token');

        await axios.get("http://localhost:8080/api/empresa/",{headers: {"Authorization": `Bearer  ${token}`}}).then(response=>{
            this.setState({
                empresas: response.data
            })
        });
        console.log(this.state.empresas);
    }
    

    render(){
        return(
            <React.Fragment>
                <Modal isOpen = {this.props.estadoInsertar || this.props.estadoEditar} toggle={() => {(this.props.estadoInsertar) ? this.props.cambiarEstadoInsertar() : this.props.cambiarEstadoEditar()}} >
                    <ModalHeader style={{display : 'block'}}>
                        <span>{(this.props.estadoInsertar) ? 'Ingresar Cliente' :'Editar Cliente'}</span>
                        
                        <span style={{cursor : 'pointer' , float : 'right'}} onClick={() => {(this.props.estadoEditar) ? this.props.cambiarEstadoEditar() : this.props.cambiarEstadoInsertar()}}>X</span>
                    </ModalHeader>
                    <ModalBody>
                        <div className="form-group">
                                <label htmlFor="id">ID</label>
                                <input className="form-control" type="text" name="id_cliente" id="id_cliente" value={this.state.cliente.id_cliente} readOnly />
                                <br/>
                                <label htmlFor="nombre">Nombre del usuario</label>
                                <input className="form-control" type="text" name="nombre" id="nombre" onChange={this.changeHandler2} value={this.state.usuario.nombre} />
                                <br/>
                                <label htmlFor="email">Email del usuario</label>
                                <input className="form-control" type="text" name="email" id="email" onChange={this.changeHandler2} value={this.state.usuario.email} />
                                <br/>
                                <label htmlFor="razon_social">Celular</label>
                                <input className="form-control" type="text" name="celular" id="celular" onChange={this.changeHandler} value={this.state.cliente.celular}/>
                                <br/>
                                <label htmlFor="id_empresa">ID Empresa</label>
                                <select className="form-control" type="text" name="id_empresa" id="id_empresa" onChange={this.changeHandler} value={this.state.cliente.id_empresa}>
                                    <option>Selecciona una Empresa</option>
                                    {this.state.empresas.map(empresa => {
                                        return(
                                        <option value={empresa.id_empresa}>{empresa.id_empresa + " - " + empresa.razon_social}</option>
                                        )
                                    })}
                                </select>
                                <br/>
                                <label htmlFor="estado">Estado de usuario</label>
                                <select name="estado" id="estado" className="form-control" value={this.state.usuario.estado} onChange={this.changeHandler2}>
                                    <option value="Activo" selected>Activo</option>
                                    <option value="Inactivo">Inactivo</option>
                                </select>
                                <br/>
                                <label htmlFor="id_user">ID User</label>
                                <input className="form-control" type="text" name="id_user" id="id_user" onChange={this.changeHandler} value={this.state.cliente.id_user} readOnly/>

                            </div>
                    </ModalBody>
                    <ModalFooter>
                        <button className="btn btn-success" onClick={() => this.guardarCliente()}> {(this.props.estadoInsertar)? "Insertar" : "Actualizar"} </button>
                        <button className="btn btn-danger" onClick={() => {(this.props.estadoInsertar) ? this.props.cambiarEstadoInsertar() : this.props.cambiarEstadoEditar()}} >Cancelar</button>
                    </ModalFooter>
                </Modal>

            </React.Fragment>
        );
    }
}