import React, {Component} from 'react'
import './Cliente.css'
import '../vistaCrud.css'
import axios from 'axios'
import { Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap'
import ClienteTabla from './ClienteTabla'
import ClienteModal from './ClienteModal'
import Menu from '../Menu/Menu'
import Axios from 'axios'


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
        const token = localStorage.getItem('token');
        axios.get(url,{headers: {"Authorization": `Bearer  ${token}`}}).then(response=>{
            this.setState({
                data: response.data
            });
        })
        .catch(()=>{
            this.props.history.push('/noAutorizado');
        })
    }

    cambiarEstadoInsertar = async () => {
        const token = localStorage.getItem('token');
        await Axios.get(`http://localhost:8080/api/usuario/${localStorage.getItem('email')}/`,{headers: {"Authorization": `Bearer ${token}`}})
        .then(response=>{
            this.setState({
                cliente: {
                    id_cliente: '',
                    celular: '',
                    id_empresa: '',
                    id_user: response.data.id
                }
            });
        });
        this.setState({
            modalInsertar : !this.state.modalInsertar
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
        const token = localStorage.getItem('token');
        var urlEliminar = url + 'eliminar/' + this.state.cliente.id_cliente;
        axios.delete(urlEliminar,{headers: {"Authorization": `Bearer  ${token}`}}).then(response=>{
            this.getClientes();
        });
        this.setState({
            modalEliminar : false
        })
    }

    render(){
        return(
            <React.Fragment>
                <Menu/>
                <div className="cliente col-10">
                    <div className="Encabezado"><p>Cliente</p></div>

                    <button type="button" className="btn boton" onClick={() => this.cambiarEstadoInsertar()}>Ingresar Cliente</button>

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
                    
                   

            </React.Fragment>
        )
}
}