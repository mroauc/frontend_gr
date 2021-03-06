import React, {Component} from 'react'
import './Empresa.css'
import '../vistaCrud.css'
import axios from 'axios'
import { Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap'
import ModalEmpresa from './EmpresaModal'
import TablaEmpresa from './EmpresaTabla'
import Menu from '../Menu/Menu'

const url=localStorage.getItem('url')+"/api/empresa/";

export default class Empresa extends Component{
   
    state ={
        data:[],
        empresa: {
            id_empresa: '',
            razon_social: '',
            rut_empresa: '',
            representante: ''
        },
        modalInsertar: false,
        modalEditar: false,
        modalEliminar: false
    }

    componentDidMount(){
        this.getEmpresas();
        this.cargarColor();
    }

    cargarColor=()=>{
        var divPrincipal = document.getElementById("principal");
        divPrincipal.style.backgroundColor = localStorage.getItem('color_bckgr');
    }

    getEmpresas = () => {
        const token = localStorage.getItem('token');

        axios.get(url,{headers: {"Authorization": `Bearer  ${token}`}}).then(response=>{
            this.setState({
                data: response.data
            });
        })
        .catch(()=>{
            this.props.history.push('/noAutorizado');
        });
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
                empresa: {
                    id_empresa: '',
                    razon_social: '',
                    rut_empresa: '',
                    representante: ''
                }
            })
        }

    }

    cambiarEstadoEliminar = (elemento) => {
        this.setState({
            empresa : elemento,
            modalEliminar : true
        })
    }

    obtenerEmpresa = async (elemento) => {
        await this.setState({
            empresa : elemento
        });
        this.cambiarEstadoEditar();
    }

    eliminarEmpresa = () => {
        const token = localStorage.getItem('token');

        var urlEliminar = url + 'eliminar/' + this.state.empresa.id_empresa;
        axios.delete(urlEliminar,{headers: {"Authorization": `Bearer  ${token}`}}).then(response=>{
            this.getEmpresas();
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
                <div className="empresa col-10">
                    <div className="Encabezado"><p>Empresa</p></div>

                    <button type="button" className="btn boton" onClick={() => this.cambiarEstadoInsertar()}>Ingresar Empresa</button>

                    <TablaEmpresa
                        empresas={this.state.data}
                        obtenerEmpresa = {this.obtenerEmpresa}
                        eliminarEmpresa = {this.eliminarEmpresa}
                        cambiarEstadoEliminar = {this.cambiarEstadoEliminar}
                    />

                    <ModalEmpresa
                        empresa = {this.state.empresa}
                        getEmpresas = {this.getEmpresas}
                        estadoEditar = {this.state.modalEditar} 
                        estadoInsertar = {this.state.modalInsertar}
                        cambiarEstadoInsertar = {this.cambiarEstadoInsertar}
                        cambiarEstadoEditar = {this.cambiarEstadoEditar}
                    />

                    <Modal isOpen={this.state.modalEliminar} toggle={() => this.setState({modalEliminar : false})}>
                        <ModalHeader></ModalHeader>
                        <ModalBody>Estas seguro que quiere eliminar el comentario</ModalBody>
                        <ModalFooter>
                            <button className="btn btn-danger" onClick ={() => {this.eliminarEmpresa(); this.setState({empresa : ''})}}>SI</button>
                            <button className="btn btn-secunday" onClick={() => this.setState({modalEliminar : false})}>NO</button>
                        </ModalFooter>
                    </Modal>
                </div>
                </div>
            </React.Fragment>
        )
}
}
