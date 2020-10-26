import Axios from 'axios';
import React, {Component} from 'react';
import { Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import Menu from '../Menu/Menu';
import PropuestaCambioModal from './PropuestaCambioModal';
import TablaPropuestaCambio from './TablaPropuestaCambio';
import VistaPropuestaCambioModal from './VistaPropuestaCambioModal';
import './PropuestaCambio.css';

class PropuestaCambio extends Component{

    state={
        propuestas: [],
        modalInsertar: false,
        modalEliminar: false,
        modalVista: false,
        tipoModal: '',
        propuesta: {
            id_propuestaCambio: 0,
            nombre: '',
            id_modulo: 0,
            fecha_peticion: 0,
            id_usuario: '',
            descripcion: '',
            justificacion: '',
            alternativas: '',
            consecuencias_rechazo: '',
            fecha_resolucion: '',
            comentarios: '',
            estado: 'Pendiente'
        } 
    }

    index=()=>{
        const token = localStorage.getItem('token');
        Axios.get('http://localhost:8080/api/propuestacambio/',{headers: {"Authorization": `Bearer ${token}`}})
        .then(response=>{
            this.setState({
                propuestas: response.data
            });
        })
    }

    componentDidMount(){
        this.index();
    }

    modalInsertar=async()=>{
        const token = localStorage.getItem('token');
        await Axios.get(`http://localhost:8080/api/usuario/${localStorage.getItem('email')}`,{headers:{"Authorization": `Bearer ${token}`}})
        .then(response=>{
            this.setState({
                propuesta:{
                    id_propuestaCambio: 0,
                    nombre: '',
                    id_modulo: 0,
                    fecha_peticion: 0,
                    id_usuario: response.data.id,
                    descripcion: '',
                    justificacion: '',
                    alternativas: '',
                    consecuencias_rechazo: '',
                    fecha_resolucion: '',
                    comentarios: '',
                    estado: 'Pendiente'
                }
            });
        })

        this.setState({
            modalInsertar: !this.state.modalInsertar,
            tipoModal: 'insertar'
        })
    }

    editar=async(propuestaEdit)=>{
        await this.setState({
            propuesta: propuestaEdit
        });
        this.modalActualizar();
    }

    verPropuesta=async(propuestaReview)=>{
        await this.setState({
            propuesta: propuestaReview
        });
        this.modalVer();
    }

    modalVer=()=>{
        this.setState({
            modalVista: !this.state.modalVista
        });
    }

    modalActualizar=()=>{
        this.setState({
            modalInsertar: !this.state.modalInsertar,
            tipoModal: 'actualizar'
        });
    }

    modalEliminar=(propuestaEliminar)=>{
        this.setState({
            modalEliminar: true,
            propuesta: propuestaEliminar
        });
    }

    eliminar=()=>{
        const token = localStorage.getItem('token');
        Axios.delete(`http://localhost:8080/api/propuestacambio/eliminar/${this.state.propuesta.id_propuestaCambio}`,{headers: {"Authorization": `Bearer ${token}`}})
        .then(response=>{
            this.setState({modalEliminar:false, propuesta:'', propuesta:{estado:'Pendiente'}});
            this.index();
        })
    }

    render(){
        return(
            <React.Fragment>
                <Menu />
            <div className="propuestaCambio col-10">
                <div className="Encabezado"><p>Propuestas de Cambio</p></div>
                <button type="button" class="btn btn-success" onClick={() => this.modalInsertar()}>Insertar</button>

                <TablaPropuestaCambio
                    propuestas={this.state.propuestas}
                    editar={this.editar}
                    modalEliminar={this.modalEliminar}
                    verPropuesta={this.verPropuesta}
                />

                <PropuestaCambioModal
                    propuestaCambio={this.state.propuesta}
                    index={this.index}
                    tipoModal={this.state.tipoModal}
                    estadoModalInsertar={this.state.modalInsertar}
                    modalInsertar={this.modalInsertar}
                />

                <VistaPropuestaCambioModal
                    propuestaCambio={this.state.propuesta}
                    modalVista={this.state.modalVista}
                    estadoModalVista={this.modalVer}
                />

                <Modal isOpen={this.state.modalEliminar}>
                    <ModalBody>
                        ¿Seguro que desea eliminar la propuesta de cambio?
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

export default PropuestaCambio;