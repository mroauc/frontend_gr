import React, {Component} from 'react'
import './Cliente.css'
import '../vistaCrud.css'
import axios from 'axios'
import { Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap'
import ClienteTabla from './ClienteTabla'
import ClienteModal from './ClienteModal'


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
        modalEditar: false,
        modalEliminar: false
    }

    componentDidMount(){
        this.getClientes();
    }

    getClientes = () => {
        axios.get(url).then(response=>{
            this.setState({
                data: response.data
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

    cambiarEstadoEliminar = (elemento) => {
        this.setState({
            cliente : elemento,
            modalEliminar : true
        })
    }

    obtenerCliente = async (elemento) => {
        await this.setState({
            cliente : elemento
        });
        this.cambiarEstadoEditar();
    }

    eliminarCliente = () => {
        var urlEliminar = url + 'eliminar/' + this.state.cliente.id_cliente;
        axios.delete(urlEliminar).then(response=>{
            this.getClientes();
        });
        this.setState({
            modalEliminar : false
        })
    }

    render(){
        return(
            <div>
                <div className="cliente col-10">
                    <div className="Encabezado"><p>Cliente</p></div>

                    <button type="button" class="btn boton" onClick={() => this.cambiarEstadoInsertar()}>Ingresar Cliente</button>

                    <ClienteTabla
                        clientes={this.state.data}
                        obtenerCliente = {this.obtenerCliente}
                        eliminarCliente = {this.eliminarCliente}
                        cambiarEstadoEliminar = {this.cambiarEstadoEliminar}
                    />

                    <ClienteModal
                        cliente = {this.state.cliente}
                        getClientes = {this.getClientes}
                        estadoEditar = {this.state.modalEditar} 
                        estadoInsertar = {this.state.modalInsertar}
                        cambiarEstadoInsertar = {this.cambiarEstadoInsertar}
                        cambiarEstadoEditar = {this.cambiarEstadoEditar}
                    />

                    <Modal isOpen={this.state.modalEliminar}>
                        <ModalHeader></ModalHeader>
                        <ModalBody>Estas seguro que quiere eliminar el Sub-Proyecto</ModalBody>
                        <ModalFooter>
                            <button className="btn btn-danger" onClick ={() => {this.eliminarCliente(); this.setState({cliente : ''})}}>SI</button>
                            <button className="btn btn-secunday" onClick={() => this.setState({modalEliminar : false})}>NO</button>
                        </ModalFooter>
                    </Modal>
                </div>
                    
                   

            </div>
        )
}
}