import Axios from 'axios';
import React, {Component} from 'react';
import { Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import Menu from '../Menu/Menu';
import PropuestaCambioModal from './PropuestaCambioModal';
import TablaPropuestaCambio from './TablaPropuestaCambio';
import VistaPropuestaCambioModal from './VistaPropuestaCambioModal';
import { Link } from 'react-router-dom';
import './PropuestaCambio.css';
import '../vistaCrud.css';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';

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
            fecha_peticion: new Date().toLocaleDateString('fr-CA'),
            id_usuario: 0,
            descripcion: '',
            justificacion: '',
            alternativas: '',
            consecuencias_rechazo: '',
            fecha_resolucion: '',
            comentarios: '',
            estado: 'Pendiente'
        },
        requerimientoImpactoDirecto : ''
    }

    index=async()=>{
        const token = localStorage.getItem('token');
        const id_proy = this.props.match.params.id_proyecto;
        await Axios.get(localStorage.getItem('url') + `/api/subProyecto/pertenecientes/${id_proy}`,{headers: {"Authorization": `Bearer ${token}`}})
        .then(response=>{
            this.cargarPropuestas(response.data);
        })
    }

    cargarPropuestas=async(subproy)=>{
        const token = localStorage.getItem('token');

        this.setState({
            propuestas: [],
        });

        for (let index = 0; index < subproy.length; index++) {
            await Axios.get(localStorage.getItem('url') + `/api/propuestacambio/obtener/${subproy[index].id_subProyecto}`,{headers: {"Authorization": `Bearer ${token}`}})
            .then(response=>{
                var datos = this.state.propuestas;
                this.setState({
                    propuestas: datos.concat(response.data)
                });
            })
        }
    }

    componentDidMount(){
        this.index();
        this.cargarColor();
    }

    cargarColor=()=>{
        var divPrincipal = document.getElementById("principal");
        divPrincipal.style.backgroundColor = localStorage.getItem('color_bckgr');
    }

    modalInsertar=async()=>{
        const token = localStorage.getItem('token');
        await Axios.get(localStorage.getItem('url') + `/api/usuario/${localStorage.getItem('email')}`,{headers:{"Authorization": `Bearer ${token}`}})
        .then(response=>{
            this.setState({
                propuesta:{
                    id_propuestaCambio: 0,
                    nombre: '',
                    id_subproyecto: 0,
                    fecha_peticion: new Date().toLocaleDateString('fr-CA'),
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

        const token = localStorage.getItem('token');
        await Axios.get(localStorage.getItem('url') + `/api/impacto_directo/obtener/${this.state.propuesta.id_propuestaCambio}`,{headers: {"Authorization": `Bearer ${token}`}})
        .then(response=>{
            if(response.data[0] !== undefined){
                this.setState({
                    requerimientoImpactoDirecto : response.data[0].id_requerimiento
                });
            }
        })    
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

    eliminar= async ()=>{
        const token = localStorage.getItem('token');
        Axios.delete(localStorage.getItem('url') + `/api/propuestacambio/eliminar/${this.state.propuesta.id_propuestaCambio}`,{headers: {"Authorization": `Bearer ${token}`}})
        .then(response=>{
            this.setState({modalEliminar:false, propuesta:'', propuesta:{estado:'Pendiente'}});
            this.index();
        })

        let impactoOld = '';

        await Axios.get(localStorage.getItem('url') + `/api/impacto_directo/obtener/${this.state.propuesta.id_propuestaCambio}`,{headers:{"Authorization": `Bearer ${token}`}})
        .then(response => {
            impactoOld = response.data[0]
        })

        Axios.delete(localStorage.getItem('url') + `/api/impacto_directo/eliminar/${impactoOld.id_impacto_directo}`,{headers:{"Authorization": `Bearer ${token}`}})
    }

    render(){
        return(
            <React.Fragment>
                <Menu />
                <div id="principal" className="contenedorPrincipal">
                <div className="propuestaCambio col-10">
                <div className="Encabezado"><p>Propuestas de Cambio</p></div>
                <button type="button" className="btn boton" onClick={() => this.modalInsertar()}>Insertar</button> &nbsp;
                <Link to={"/subProyecto/"+this.props.match.params.id_proyecto}><button type="button" className="btn boton"><ArrowBackIcon/> Volver</button></Link>

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
                    requerimientoImpactoDirecto= {this.state.requerimientoImpactoDirecto}
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
            </div>
            </React.Fragment>
        );
    }
}

export default PropuestaCambio;