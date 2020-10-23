import Axios from 'axios';
import React, { Component } from 'react';
import { Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import DashboardCliente from '../Dashboard/Cliente/DashboardCliente';
import ErroresModal from './ErroresModal';
import TablaErrores from './TablaErrores';

class Errores extends Component{

    state={
        errores: [],
        modalInsertar: false,
        modalEliminar: false,
        tipoModal: '',
        dataError: {
            id_error: 0,
            contenido: '',
            id_usuario: '',
            fecha: ''
        }
    }

    index=()=>{
        const token = localStorage.getItem('token');
        Axios.get('http://localhost:8080/api/errores/',{headers: {"Authorization": `Bearer ${token}`}})
        .then(response=>{
            this.setState({
                errores: response.data
            });
        })
    }

    componentDidMount(){
        this.index();
    }

    modalInsertar=async()=>{
        /*this.setState({
            dataError: '',
            modalInsertar: !this.state.modalInsertar,
            tipoModal: 'insertar'
        });*/
        const token = localStorage.getItem('token');
        await Axios.get(`http://localhost:8080/api/usuario/${localStorage.getItem('email')}`,{headers: {"Authorization": `Bearer ${token}`}})
        .then(response=>{
            this.setState({
                dataError:{id_error: 0, contenido: '', id_usuario:response.data.id,fecha:''}
            });
        })

        this.setState({
            modalInsertar: !this.state.modalInsertar,
            tipoModal: 'insertar'
        })
    }

    editar=async(errorsingle)=>{
        await this.setState({
            dataError: errorsingle
        });
        this.modalActualizar();
    }

    modalActualizar=()=>{
        this.setState({
            modalInsertar: !this.state.modalInsertar,
            tipoModal: 'actualizar'
        });
    }

    modalEliminar=(errorSingle)=>{
        this.setState({
            modalEliminar: true,
            dataError: errorSingle
        });
    }

    eliminar=()=>{
        const token = localStorage.getItem('token');
        Axios.delete(`http://localhost:8080/api/errores/eliminar/${this.state.dataError.id_error}`,{headers: {"Authorization": `Bearer ${token}`}})
        .then(response=>{
            this.setState({modalEliminar:false, dataError:''});
            this.index();
        })
    }

    render(){
        return(
            <React.Fragment>
                {localStorage.getItem('rol')==="ROLE_CLIENTE"?(
                    <DashboardCliente/>
                ):''}
            <div className="errores col-10">
                <div className="Encabezado"><p>Errores</p></div>
                <button type="button" class="btn btn-success" onClick={() => this.modalInsertar()}>Insertar</button>

                <TablaErrores
                    errores={this.state.errores}
                    editar={this.editar}
                    modalEliminar={this.modalEliminar}
                />
                <ErroresModal
                    dataError={this.state.dataError}
                    index={this.index}
                    tipoModal={this.state.tipoModal}
                    estadoModalInsertar={this.state.modalInsertar}
                    modalInsertar={this.modalInsertar}
                />

                <Modal isOpen={this.state.modalEliminar}>
                    <ModalBody>
                        ¿Seguro que desea eliminar el error?
                    </ModalBody>
                    <ModalFooter>
                        <button className="btn btn-danger" onClick={()=>this.eliminar()}>Si</button>
                        <button className="btn btn-secundary" onClick={()=>this.setState({modalEliminar:false})}>No</button>
                    </ModalFooter>
                </Modal>
            </div>
            </React.Fragment>
        );
    }
}

export default Errores;