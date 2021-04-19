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
        empresas: [],
        msj_nombre: "",
        msj_email: "",
        msj_tipo: "",
        msj_estado: "",
        msj_password: "",
        msj_celular: "",
        msj_idempresa: ""
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
        await Axios.get(localStorage.getItem('url') + `/api/usuario/${this.state.usuario.email}`,{headers: {"Authorization": `Bearer  ${token}`}})
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

    validar=()=>{
        let salida=true;
        if(!this.state.usuario.nombre){
            this.setState({
                msj_nombre: "Campo Vacio"
            });
            salida=false;
        }
        if(!this.state.usuario.email){
            this.setState({
                msj_email: "Campo Vacio"
            });
            salida=false;
        }
        if(!this.state.usuario.tipo){
            this.setState({
                msj_tipo: "Campo Vacio"
            });
            salida=false;
        }else{
            if(this.state.usuario.tipo==="cliente"){
                if(!this.state.cliente.celular){
                    this.setState({
                        msj_celular: "Campo Vacio"
                    });
                    salida=false;
                }
                if(!this.state.cliente.id_empresa){
                    this.setState({
                        msj_idempresa: "Campo Vacio"
                    });
                    salida=false;
                }
            }
        }
        if(!this.state.usuario.estado){
            this.setState({
                msj_estado: "Campo Vacio"
            });
            salida=false;
        }
        if(!this.state.usuario.password){
            this.setState({
                msj_password: "Campo Vacio"
            });
            salida=false;
        }
        return salida;
    }

    guardar=async()=>{
        if(this.validar()){
            const token = localStorage.getItem('token');
            await Axios.post(localStorage.getItem('url') + '/auth/nuevo/',{
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
                    await Axios.post(localStorage.getItem('url') + "/api/cliente/guardar", this.state.cliente,{headers: {"Authorization": `Bearer  ${token}`}})
                }
                this.props.modalInsertar();
                this.props.index();
                this.setState({
                    msj_nombre: "",
                    msj_email: "",
                    msj_tipo: "",
                    msj_estado: "",
                    msj_password: "",
                    msj_celular: "",
                    msj_idempresa: ""
                });
            })
        }
    }

    guardarActualizacion=()=>{
        if(this.validar()){
            const token = localStorage.getItem('token');
            Axios.post(localStorage.getItem('url') + '/api/usuario/editar/',this.state.usuario,{headers: {"Authorization": `Bearer  ${token}`}})
            .then(response=>{
                this.props.modalInsertar();
                this.props.index();
                this.setState({
                    msj_nombre: "",
                    msj_email: "",
                    msj_tipo: "",
                    msj_estado: "",
                    msj_password: "",
                    msj_celular: "",
                    msj_idempresa: ""
                });
            });
        }
    }

    esUsuario = () => {
        
        if(this.state.usuario.tipo === "cliente" && this.state.cliente !== null){
            return (
            <div>
                <label htmlFor="razon_social">Celular</label>
                <input className={ (this.state.msj_celular)? "form-control is-invalid" : "form-control"} type="text" name="celular" id="celular" onChange={this.changeHandler2} value={this.state.cliente.celular} onClick={()=>{this.setState({msj_celular:""})}} />
                <div className="invalid-feedback">
                    {this.state.msj_celular}
                </div>
                <br/>
                <label htmlFor="id_empresa">ID Empresa</label>
                <select className={ (this.state.msj_idempresa)? "form-control is-invalid" : "form-control"} type="text" name="id_empresa" id="id_empresa" onChange={this.changeHandler2} value={this.state.cliente.id_empresa} onClick={()=>{this.setState({msj_idempresa:""})}} >
                    <option>Selecciona un Empresa</option>
                    {this.state.empresas.map(empresa => {
                        return(
                        <option value={empresa.id_empresa}>{empresa.id_empresa + " - " + empresa.razon_social}</option>
                        )
                    })}
                </select>
                <div className="invalid-feedback">
                    {this.state.msj_idempresa}
                </div>
                <br/>
            </div>);
        }
    }

    getCliente = (usuario) => {
        if(usuario.tipo === "cliente"){
            const token = localStorage.getItem('token');
            Axios.get(localStorage.getItem('url') + `/api/cliente/id_usuario/${usuario.id}`,{headers: {"Authorization": `Bearer  ${token}`}})
            .then(response => {
                this.setState({
                    cliente: response.data
                })
            })
        }else{
            this.setState({
                cliente: ""
            });
        }
    }
    
    getEmpresas = async () => {
        const token = localStorage.getItem('token');
        await Axios.get(localStorage.getItem('url') + "/api/empresa/",{headers: {"Authorization": `Bearer  ${token}`}}).then(response=>{
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

    cerrar=()=>{
        this.setState({
            msj_nombre: "",
            msj_email: "",
            msj_tipo: "",
            msj_estado: "",
            msj_password: "",
            msj_celular: "",
            msj_idempresa: "",
            cliente: ""
        });
        this.props.modalInsertar();
    }

    render(){
        return(
            <React.Fragment>    
                <Modal isOpen={this.props.estadoModalInsertar} toggle={()=>this.cerrar()}>
                    <ModalHeader style={{display:'block'}}>
                        <span>{(this.props.tipoModal==='insertar') ? 'Ingresar Usuario' :'Editar Usuario'}</span>

                        <span style={{cursor:'pointer', float:'right'}} onClick={()=>this.cerrar()}>X</span>
                    </ModalHeader>
                    <ModalBody>
                        <div className="form-group">
                            <label htmlFor="nombre">Nombre del usuario</label>
                            <input className={ (this.state.msj_nombre)? "form-control is-invalid" : "form-control"} type="text" name="nombre" id="nombre" onChange={this.changeHandler} value={this.state.usuario.nombre} onClick={()=>{this.setState({msj_nombre:""})}} />
                            <div className="invalid-feedback">
                                {this.state.msj_nombre}
                            </div>
                            <br/>
                            <label htmlFor="email">Email del usuario</label>
                            <input className={ (this.state.msj_email)? "form-control is-invalid" : "form-control"} type="text" name="email" id="email" onChange={this.changeHandler} value={this.state.usuario.email} onClick={()=>{this.setState({msj_email:""})}} />
                            <div className="invalid-feedback">
                                {this.state.msj_email}
                            </div>
                            <br/>
                            <label htmlFor="rol">Tipo de usuario</label>
                            <select name="rol" id="rol" className={ (this.state.msj_tipo)? "form-control is-invalid" : "form-control"} value={this.state.usuario.tipo} onChange={this.changeRol} onClick={()=>{this.setState({msj_tipo:""})}} >
                                <option selected value="">Seleccione un tipo</option>
                                <option value="analista">Analista Programador</option>
                                <option value="lider">Lider de subproyecto</option>
                                <option value="jefe">Jefe de proyecto</option>
                                <option value="cliente">Cliente</option>
                                <option value="admin">Administrador del Sistema</option>
                            </select>
                            <div className="invalid-feedback">
                                {this.state.msj_tipo}
                            </div>
                            <br/>
                            <label htmlFor="estado">Estado de usuario</label>
                            <select name="estado" id="estado" className={ (this.state.msj_estado)? "form-control is-invalid" : "form-control"} value={this.state.usuario.estado} onChange={this.changeHandler} onClick={()=>{this.setState({msj_estado:""})}} >
                                <option selected value="">Seleccione un estado</option>
                                <option value="Activo" selected>Activo</option>
                                <option value="Inactivo">Inactivo</option>
                            </select>
                            <div className="invalid-feedback">
                                {this.state.msj_estado}
                            </div>
                            <br/>
                            <label htmlFor="password" hidden={(this.props.tipoModal==='insertar')?false:true}>Contraseña</label>
                            <input className={ (this.state.msj_password)? "form-control is-invalid" : "form-control"} hidden={(this.props.tipoModal==='insertar')?false:true} type="password" name="password" id="password" onChange={this.changeHandler} value={this.state.usuario.password} onClick={()=>{this.setState({msj_password:""})}} />
                            <div className="invalid-feedback" hidden={(this.props.tipoModal==='insertar')?false:true}>
                                {this.state.msj_password}
                            </div>
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
                            <button className="btn btn-danger" onClick={()=>this.cerrar()}>Cancelar</button>
                    </ModalFooter>
                </Modal>
            </React.Fragment>
        );
    }
}

export default UsuarioModal;