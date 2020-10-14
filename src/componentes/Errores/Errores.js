import Axios from 'axios';
import React, { Component } from 'react';
import { Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
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
        Axios.get('http://localhost:8080/api/errores/')
        .then(response=>{
            this.setState({
                errores: response.data
            });
        })
    }

    componentDidMount(){
        this.index();
    }

    modalInsertar=()=>{
        this.setState({
            dataError: '',
            modalInsertar: !this.state.modalInsertar,
            tipoModal: 'insertar'
        });
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
        Axios.delete(`http://localhost:8080/api/errores/eliminar/${this.state.dataError.id_error}`)
        .then(response=>{
            this.setState({modalEliminar:false, dataError:''});
            this.index();
        })
    }

    render(){
        return(
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
        );
    }
}

export default Errores;