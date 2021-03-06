import Axios from 'axios';
import React, { Component } from 'react';
import { Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import Menu from '../Menu/Menu';
import RelacionRequerimientosModal from './RelacionRequerimientosModal';
import TablaRelacionRequerimientos from './TablaRelacionRequerimientos';
import './RelacionRequerimientos.css';

class RelacionRequerimientos extends Component{

    state={
        relacionesRequerimientos: [],
        modalInsertar: false,
        modalEliminar: false,
        tipoModal: '',
        relacion: {
            id_relacionRequerimientos: 0,
            id_requerimiento_a: '',
            id_requerimiento_b: ''
        }
    }

    index=()=>{
        const token = localStorage.getItem('token');
        Axios.get(localStorage.getItem('url') + '/api/relacionrequerimientos/',{headers: {"Authorization": `Bearer ${token}`}})
        .then(response=>{
            this.setState({
                relacionesRequerimientos: response.data
            });
        })
        .catch(()=>{
            this.props.history.push('/noAutorizado');
        })
    }

    componentDidMount(){
        this.index();
    }

    modalInsertar=()=>{
        this.setState({
            relacion: '',
            modalInsertar: !this.state.modalInsertar,
            tipoModal: 'insertar'
        });
    }

    editar=async(relacionRequerimientos)=>{
        await this.setState({
            relacion: relacionRequerimientos
        });
        this.modalActualizar();
    }

    modalActualizar=()=>{
        this.setState({
            modalInsertar: !this.state.modalInsertar,
            tipoModal: 'actualizar'
        });
    }

    modalEliminar=(relacion)=>{
        this.setState({
            modalEliminar:true,
            relacion: relacion
        });
    }

    eliminar=()=>{
        const token = localStorage.getItem('token');
        Axios.delete(localStorage.getItem('url') + `/api/relacionrequerimientos/eliminar/${this.state.relacion.id_relacionRequerimientos}`,{headers: {"Authorization": `Bearer ${token}`}})
        .then(response=>{
            this.setState({modalEliminar:false, relacion:''});
            this.index();
        })
    }

    render(){
        return(
            <React.Fragment>
            <Menu />
            <div className="RelacionRequerimientos col-10">
                <div className="Encabezado"><p>Relacion entre Requerimientos</p></div>
                <button type="button" class="btn btn-success" onClick={() => this.modalInsertar()}>Insertar</button>

                <TablaRelacionRequerimientos
                    relaciones={this.state.relacionesRequerimientos}
                    editar={this.editar}
                    modalEliminar={this.modalEliminar}
                />

                <RelacionRequerimientosModal
                    relacion={this.state.relacion}
                    index={this.index}
                    tipoModal={this.state.tipoModal}
                    estadoModalInsertar={this.state.modalInsertar}
                    modalInsertar={this.modalInsertar}
                />

                <Modal isOpen={this.state.modalEliminar}>
                    <ModalBody>
                        ¿Seguro que desea eliminar la relacion entre requerimientos?
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

export default RelacionRequerimientos;