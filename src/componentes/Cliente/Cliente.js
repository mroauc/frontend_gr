import React, {Component} from 'react'
import './Cliente.css'
import '../vistaCrud.css'
import axios from 'axios'
import { Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap'

const url="http://localhost:8080/api/cliente/";

export default class Cliente extends Component{
   
    state ={
        data:[],
        cliente: {
            id_cliente: '',
            celular: '',
            id_empresa: '',
            id_user: ''
        },
        modalInsertar: false,
        modalEditar: false
    }

    componentDidMount(){
        this.getClientes();
    }

    getClientes = () => {
        axios.get(url).then(response=>{
            this.setState({
                data: response.data,
                cliente: {
                    id_cliente: '',
                    celular: '',
                    id_empresa: '',
                    id_user: ''
                }
            });
        })
    }

    cambiarEstadoInsertar = () => {
        this.setState({
            modalInsertar : !this.state.modalInsertar,
        });
    }

    cambiarEstadoEditar = async () => {
        await this.setState({
            modalEditar : !this.state.modalEditar
        });

        if(!this.state.modalEditar){
            this.setState({
                cliente: {
                    id_cliente: '',
                    celular: '',
                    id_empresa: '',
                    id_user: ''
                }
            });
        }
    }

    obtenerCliente = (elemento) => {
        this.setState({
            cliente : elemento
        });
        this.cambiarEstadoEditar();
    }

    insertarCliente = async (cliente) => {
        var urlGuardar = url + 'guardar';
        console.log(urlGuardar);
        console.log(cliente);
        
        await axios.post(urlGuardar, cliente)
        .then(response => {
            (this.state.modalEditar) ? this.cambiarEstadoEditar() : this.cambiarEstadoInsertar();
            this.getClientes();
            console.log(response);
        })
        .catch(error => {
            console.log(error)
        })
    }

    eliminarCliente = (id_cliente) => {
        var urlEliminar = url + 'eliminar/' + id_cliente;
        axios.delete(urlEliminar).then(response=>{
            this.getClientes();
        });
    }

    changeHandler = (e) => {
        this.setState({
            cliente : {
              ...this.state.cliente, [e.target.name]: e.target.value
            }
          });
    }



    render(){
        return(
            <div>
                <div className="cliente col-10">
                    <div className="Encabezado"><p>Cliente</p></div>

                    <button type="button" class="btn boton" onClick={() => this.cambiarEstadoInsertar()}>Ingresar Cliente</button>

                    <table class="table table-hover">
                        <thead>
                            <tr>
                                <th scope="col">ID</th>
                                <th scope="col">Celular</th>
                                <th scope="col">ID Empresa</th>
                                <th scope="col">ID User</th>
                                <th scope="col">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.state.data.map(cliente => {
                                return(
                                    <tr>
                                        <td scope="col">{cliente.id_cliente}</td>
                                        <td>{cliente.celular}</td>
                                        <td>{cliente.id_empresa}</td>
                                        <td>{cliente.id_user}</td>
                                        <td>
                                            <button type="button" class="btn btn-warning" data-toggle="modal" data-target="#modalEditar" onClick={() => this.obtenerCliente(cliente)}>Editar</button> &nbsp;
                                            <button type="button" class="btn btn-danger" data-toggle="modal" data-target="#modalEditar" onClick={() => this.eliminarCliente(cliente.id_cliente)}>Eliminar</button>
                                        </td>

                                    </tr>
                                )
                            })}
                        
                        </tbody>
                    </table>
                </div>
                    
                    {/* MODAL INSERTAR */}

                    <Modal isOpen = {this.state.modalInsertar || this.state.modalEditar} >
                        <ModalHeader style={{display : 'block'}}>
                            <span>{(this.state.modalInsertar) ? 'Ingresar Cliente' :'Editar Cliente'}</span>
                            
                            <span style={{cursor : 'pointer' , float : 'right'}} onClick={() => {(this.state.modalEditar) ? this.cambiarEstadoEditar() : this.cambiarEstadoInsertar()}}>x</span>
                        </ModalHeader>
                        <ModalBody>
                            <div className="form-group">
                                <label htmlFor="id">ID</label>
                                <input className="form-control" type="text" name="id_cliente" id="id_cliente" value={(this.state.modalEditar) ? this.state.cliente.id_cliente : this.state.data.length+1} readOnly />
                                <br/>
                                <label htmlFor="razon_social">Celular</label>
                                <input className="form-control" type="text" name="celular" id="celular" onChange={this.changeHandler} value={this.state.cliente.celular}/>
                                <br/>
                                <label htmlFor="id_empresa">ID Empresa</label>
                                <input className="form-control" type="text" name="id_empresa" id="id_empresa" onChange={this.changeHandler} value={this.state.cliente.id_empresa}/>
                                <br/>
                                <label htmlFor="id_user">ID User</label>
                                <input className="form-control" type="text" name="id_user" id="id_user" onChange={this.changeHandler} value={this.state.cliente.id_user}/>
                            </div>
                        </ModalBody>
                        <ModalFooter>
                            <button className="btn btn-success" onClick={() => this.insertarCliente(this.state.cliente)} >Guardar Cambios</button>
                            <button className="btn btn-danger" onClick={() => {(this.state.modalInsertar) ? this.cambiarEstadoInsertar() : this.cambiarEstadoEditar()}} >Cancelar</button>
                        </ModalFooter>
                    </Modal>

            </div>
        )
}
}