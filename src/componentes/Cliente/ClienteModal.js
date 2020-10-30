import axios from 'axios';
import React, { Component } from 'react'
import { Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import './Cliente.css'

const url="http://localhost:8080/api/cliente/";

export default class ComentarioModal extends Component {
    
    state ={
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

    componentWillReceiveProps(next_props) {
        console.log(this.props.cliente);
        this.setState({ cliente: this.props.cliente});
    }

    guardarCliente = async (cliente) => {
        const token = localStorage.getItem('token');
        var urlGuardar = url + 'guardar';
        console.log(urlGuardar);
        console.log(cliente);
        
        await axios.post(urlGuardar, cliente,{headers: {"Authorization": `Bearer  ${token}`}})
        .then(response => {
            (this.props.estadoEditar) ? this.props.cambiarEstadoEditar() : this.props.cambiarEstadoInsertar();
            this.props.getClientes();
            console.log(response);
        })
        .catch(error => {
            console.log(error)
        })
    }

    changeHandler = async (e) => {
        await this.setState({
            cliente : {
              ...this.state.cliente, [e.target.name]: e.target.value
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
                                <label htmlFor="razon_social">Celular</label>
                                <input className="form-control" type="text" name="celular" id="celular" onChange={this.changeHandler} value={this.state.cliente.celular}/>
                                <br/>
                                <label htmlFor="id_empresa">ID Empresa</label>
                                <select className="form-control" type="text" name="id_empresa" id="id_empresa" onChange={this.changeHandler} value={this.state.cliente.id_empresa}>
                                    <option>Selecciona un Empresa</option>
                                    {this.state.empresas.map(empresa => {
                                        return(
                                        <option value={empresa.id_empresa}>{empresa.id_empresa + " - " + empresa.razon_social}</option>
                                        )
                                    })}
                                </select>
                                <br/>
                                <label htmlFor="id_user">ID User</label>
                                <input className="form-control" type="text" name="id_user" id="id_user" onChange={this.changeHandler} value={this.state.cliente.id_user} readOnly/>

                            </div>
                    </ModalBody>
                    <ModalFooter>
                        <button className="btn btn-success" onClick={() => this.guardarCliente(this.state.cliente)}> {(this.props.estadoInsertar)? "Insertar" : "Actualizar"} </button>
                        <button className="btn btn-danger" onClick={() => {(this.props.estadoInsertar) ? this.props.cambiarEstadoInsertar() : this.props.cambiarEstadoEditar()}} >Cancelar</button>
                    </ModalFooter>
                </Modal>

            </React.Fragment>
        );
    }
}