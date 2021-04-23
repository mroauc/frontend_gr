import React, {Component} from 'react';
import './Cliente.css';
import '../vistaCrud.css';
import axios from 'axios';
import { Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import ClienteTabla from './ClienteTabla';
import ClienteModal from './ClienteModal';
import Menu from '../Menu/Menu';

const url=localStorage.getItem("url")+"/api/cliente/";

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
        this.cargarColor();
    }

    cargarColor=()=>{
        var divPrincipal = document.getElementById("principal");
        divPrincipal.style.backgroundColor = localStorage.getItem('color_bckgr');
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
        axios.get(localStorage.getItem('url')+"/api/usuario/tipo/cliente",{headers: {"Authorization": `Bearer  ${token}`}}).then(response=>{
        })
        .catch(()=>{
            this.props.history.push('/noAutorizado');
        })
    }

    cambiarEstadoInsertar=async()=>{
       await this.setState({
           cliente : '',
           modalInsertar : !this.state.modalInsertar
       });
    }

    cambiarEstadoEditar=async()=>{
        /*if(!this.state.modalEditar){
            this.setState({
                cliente: {
                    id_cliente: '',
                    celular: '',
                    id_empresa: '',
                    id_user: ''
                }
            });
        }*/
        await this.setState({
            cliente: '',
            modalEditar : !this.state.modalEditar
        });
    }

    cambiarEstadoEliminar = (elemento) => {
        this.setState({
            cliente : elemento,
            modalEliminar : true
        })
    }

    obtenerCliente=async(elemento)=>{
        await this.setState({
            cliente : elemento
        });
        this.cambiarEstadoEditar();
    }

    eliminarCliente = async () => {
        const token = localStorage.getItem('token');
        var urlEliminar = url + 'eliminar/' + this.state.cliente.id_cliente;

        await axios.delete(localStorage.getItem('url')+`/api/usuario/eliminar/${this.state.cliente.id_user}`,{headers: {"Authorization": `Bearer  ${token}`}});

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
                <div id="principal" className="contenedorPrincipal">
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
                </div>
                   

            </React.Fragment>
        )
}
}