import React, {Component} from 'react';
import './Cliente.css';
import '../vistaCrud.css';
import axios from 'axios';
import { Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import ClienteTabla from './ClienteTabla';
import ClienteModal from './ClienteModal';
import Menu from '../Menu/Menu';

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

    getUsuarioCliente = () => {
        const token = localStorage.getItem('token');
        axios.get("http://localhost:8080/api/usuario/tipo/cliente",{headers: {"Authorization": `Bearer  ${token}`}}).then(response=>{
            console.log(response.data);
        })
        .catch(()=>{
            this.props.history.push('/noAutorizado');
        })
    }


    cambiarEstadoInsertar = async () => { /// Cambios
        
        this.setState({
            modalInsertar : !this.state.modalInsertar
        });
    }

    cambiarEstadoEditar = async () => { //// AQUIIII
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

    eliminarCliente = async () => {
        const token = localStorage.getItem('token');
        var urlEliminar = url + 'eliminar/' + this.state.cliente.id_cliente;
        console.log(urlEliminar);
        console.log(this.state.cliente);

        await axios.delete(`http://localhost:8080/api/usuario/eliminar/${this.state.cliente.id_user}`,{headers: {"Authorization": `Bearer  ${token}`}});

        await axios.delete(urlEliminar,{headers: {"Authorization": `Bearer  ${token}`}}).then(response=>{
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

                    <Modal isOpen={this.state.modalEliminar} toggle={() => this.setState({modalEliminar : false})}>
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