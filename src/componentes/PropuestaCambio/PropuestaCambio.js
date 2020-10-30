import Axios from 'axios';
import React, {Component} from 'react';
import { Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import Menu from '../Menu/Menu';
import PropuestaCambioModal from './PropuestaCambioModal';
import TablaPropuestaCambio from './TablaPropuestaCambio';
import VistaPropuestaCambioModal from './VistaPropuestaCambioModal';
import './PropuestaCambio.css';
import '../vistaCrud.css';

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
            id_subproyecto: 0,
            fecha_peticion: '',
            id_usuario: 0,
            descripcion: '',
            justificacion: '',
            alternativas: '',
            consecuencias_rechazo: '',
            fecha_resolucion: '',
            comentarios: '',
            estado: 'Pendiente'
        }
    }

    index=async()=>{
        const token = localStorage.getItem('token');
        const id_proy = this.props.match.params.id_proyecto;
        await Axios.get(`http://localhost:8080/api/subProyecto/pertenecientes/${id_proy}`,{headers: {"Authorization": `Bearer ${token}`}})
        .then(response=>{
            //var subp = response.data
            this.cargarPropuestas(response.data);
        })
        /*Axios.get('http://localhost:8080/api/propuestacambio/',{headers: {"Authorization": `Bearer ${token}`}})
        .then(response=>{
            this.setState({
                propuestas: response.data
            });
        })
        .catch(()=>{
            this.props.history.push('/noAutorizado');
        })*/
    }

    cargarPropuestas=async(subproy)=>{
        const token = localStorage.getItem('token');

        this.setState({
            propuestas: [],
        });

        //console.log(this.state.subProyectos);


        for (let index = 0; index < subproy.length; index++) {
            await Axios.get(`http://localhost:8080/api/propuestacambio/obtener/${subproy[index].id_subProyecto}`,{headers: {"Authorization": `Bearer ${token}`}})
            .then(response=>{
                var datos = this.state.propuestas;
                this.setState({
                    propuestas: datos.concat(response.data)
                });
                //console.log(response.data);
            })
        }
        //console.log(this.state.propuestas);
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
                    id_subproyecto: 0,
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
                <button type="button" class="btn boton" onClick={() => this.modalInsertar()}>Insertar</button>

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
                    id_proyecto={this.props.match.params.id_proyecto}
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