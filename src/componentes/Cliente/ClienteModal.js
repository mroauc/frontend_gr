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
        empresas: [],

        errorInputNombre: '',
        errorInputEmail: '',
        errorInputCelular: '',
        errorInputEmpresa: '',
        errorInputPassword: '',

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
        console.log(this.props.cliente);
    }

    initErrores = () => {
        this.setState({
            errorInputCelular: '',
            errorInputEmpresa: '',
            errorInputNombre: '',
            errorInputEmail:'',
            errorInputPassword: ''
        })
    }

    validar = () => {
        let salida = true;
        if(this.state.usuario.nombre === ""){
            this.setState({errorInputNombre: "Debe ingresar el nombre del cliente"})
            salida = false;
        }
        if(this.state.usuario.email === ""){
            this.setState({errorInputEmail: "Debe ingresar el email del cliente"})
            salida = false;
        }
        if(this.state.cliente.celular === ""){
            this.setState({errorInputCelular: "Debe ingresar el número de contacto del cliente"})
            salida = false;
        }
        if(this.state.cliente.id_empresa === ""){
            this.setState({errorInputEmpresa: "Debe seleccionar una empresa"})
            salida = false;
        }
        if(this.state.usuario.password === ""){
            this.setState({errorInputPassword: "Debe ingresar una contraseña"})
            salida = false;
        }
        return salida;
    }

    guardarCliente = async () => {
        const token = localStorage.getItem('token');
        var urlGuardar = url + 'guardar';
        if(this.validar()){
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
            this.initErrores();
        }
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
    }

    cerrarModalInsertar=async()=>{
        await this.setState({
            usuario:{ 
                id_usuario: '',
                estado: '',
                nombre: '',
                password: '',
                rol: 'cliente',
                email: ''
            },
        });
        this.props.cambiarEstadoInsertar();
    }

    cerrarModalEditar=async()=>{
        await this.setState({
            usuario:{ 
                id_usuario: '',
                estado: '',
                nombre: '',
                password: '',
                rol: 'cliente',
                email: ''
            },
            cliente: {
                id_cliente: '',
                celular: '',
                id_empresa: '',
                id_user: ''
            }
        });
        this.props.cambiarEstadoEditar();
    }

    render(){
        return(
            <React.Fragment>
                <Modal isOpen = {this.props.estadoInsertar || this.props.estadoEditar} toggle={() => {(this.props.estadoInsertar) ? this.cerrarModalInsertar() : this.cerrarModalEditar(); this.initErrores()}} >
                    <ModalHeader style={{display : 'block'}}>
                        <span>{(this.props.estadoInsertar) ? 'Ingresar Cliente' :'Editar Cliente'}</span>
                        
                        <span style={{cursor : 'pointer' , float : 'right'}} onClick={() => {(this.props.estadoInsertar) ? this.cerrarModalInsertar() : this.cerrarModalEditar(); this.initErrores()}}>X</span>
                    </ModalHeader>
                    <ModalBody>
                        <div className="form-group">
                                <label htmlFor="nombre">Nombre del usuario</label>
                                <input className={(this.state.errorInputNombre)? "form-control is-invalid" : "form-control"} type="text" name="nombre" id="nombre" onChange={this.changeHandler2} value={this.state.usuario.nombre} onClick={() => {this.setState({errorInputNombre : ''})}}/>
                                <div class="invalid-feedback" style={{display: 'block'}}>
                                    {this.state.errorInputNombre}
                                </div>
                                <br/>
                                <label htmlFor="email">Email del usuario</label>
                                <input className={(this.state.errorInputEmail)? "form-control is-invalid" : "form-control"} type="text" name="email" id="email" onChange={this.changeHandler2} value={this.state.usuario.email} onClick={() => {this.setState({errorInputEmail : ''})}}/>
                                <div class="invalid-feedback" style={{display: 'block'}}>
                                    {this.state.errorInputEmail}
                                </div>
                                <br/>
                                <label htmlFor="razon_social">Celular</label>
                                <input className={(this.state.errorInputCelular)? "form-control is-invalid" : "form-control"} type="text" name="celular" id="celular" onChange={this.changeHandler} value={this.state.cliente.celular} onClick={() => {this.setState({errorInputCelular : ''})}}/>
                                <div class="invalid-feedback" style={{display: 'block'}}>
                                    {this.state.errorInputCelular}
                                </div>
                                <br/>
                                <label htmlFor="id_empresa">ID Empresa</label>
                                <select className={(this.state.errorInputEmpresa)? "form-control is-invalid" : "form-control"} type="text" name="id_empresa" id="id_empresa" onChange={this.changeHandler} value={this.state.cliente.id_empresa} onClick={() => {this.setState({errorInputEmpresa : ''})}}>
                                    <option>Selecciona una Empresa</option>
                                    {this.state.empresas.map(empresa => {
                                        return(
                                        <option value={empresa.id_empresa}>{empresa.id_empresa + " - " + empresa.razon_social}</option>
                                        )
                                    })}
                                </select>
                                <div class="invalid-feedback" style={{display: 'block'}}>
                                    {this.state.errorInputEmpresa}
                                </div>
                                <br/>
                                <label htmlFor="estado">Estado de usuario</label>
                                <select name="estado" id="estado" className="form-control" value={this.state.usuario.estado} onChange={this.changeHandler2}>
                                    <option value="">Seleccione un Estado</option>
                                    <option value="Activo">Activo</option>
                                    <option value="Inactivo">Inactivo</option>
                                </select>
                                <br/>
                                <label htmlFor="password" hidden={(this.props.estadoInsertar)?false : true}>Contraseña</label>
                                <input className={ (this.state.errorInputPassword)? "form-control is-invalid" : "form-control"} hidden={(this.props.estadoInsertar)?false : true} type="password" name="password" id="password" onChange={this.changeHandler2} value={this.state.usuario.password} onClick={()=>{this.setState({errorInputPassword: ''})}} />
                                <div className="invalid-feedback" hidden={(this.props.estadoInsertar)?false : true}>
                                    {this.state.errorInputPassword}
                                </div>
                            </div>
                    </ModalBody>
                    <ModalFooter>
                        <button className="btn btn-success" onClick={() => this.guardarCliente()}> {(this.props.estadoInsertar)? "Insertar" : "Actualizar"} </button>
                        <button className="btn btn-danger" onClick={() => {(this.props.estadoInsertar) ? this.cerrarModalInsertar() : this.cerrarModalEditar(); this.initErrores()}} >Cancelar</button>
                    </ModalFooter>
                </Modal>

            </React.Fragment>
        );
    }
}