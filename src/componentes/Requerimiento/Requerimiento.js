import Axios from 'axios';
import React, {Component} from 'react';
import { Link } from 'react-router-dom';
import { Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import Menu from '../Menu/Menu';
import RequerimientoModal from './RequerimientoModal';
import TablaRequerimiento from './TablaRequerimiento';
import './Requerimiento.css';
import '../vistaCrud.css';
import RedactarReqModal from './RedactarReqModal';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';

class Requerimiento extends Component{

    state={
        requerimientos: [],
        modalInsertar: false,
        modalEliminar: false,
        modalRedactar: false,
        tipoModal: '',
        requerimiento: {
            id_requerimiento: 0,
            nombre: '', 
            descripcion: '',
            id_usuario: 0,
            id_subProyecto: this.props.match.params.id_subproyecto,
            fecha_creacion: '',
            prioridad: '',
            estado: '',
            categoria: '',
            id_template: 0
        },
        id_proy : ''
    }

    index=()=>{
        const id_subp = this.props.match.params.id_subproyecto;
        const token = localStorage.getItem('token');

        Axios.get(`http://localhost:8080/api/requerimiento/obtener/${id_subp}`,{headers: {"Authorization": `Bearer ${token}`}})
        .then(response=>{
            this.setState({
                requerimientos: response.data
            });
        })
        .catch(()=>{
            this.props.history.push('/noAutorizado');
        })
    }

    componentDidMount(){
        this.index();
        const token = localStorage.getItem('token');
        Axios.get(`http://localhost:8080/api/subProyecto/${this.props.match.params.id_subproyecto}`,{headers: {"Authorization": `Bearer ${token}`}})
        .then(response=>{
            this.setState({
                id_proy : response.data.id_proyecto
            });
        });
    }

    modalInsertar=async()=>{
        const token = localStorage.getItem('token');
        await Axios.get(`http://localhost:8080/api/usuario/${localStorage.getItem('email')}`,{headers: {"Authorization": `Bearer ${token}`}})
        .then(response=>{
            this.setState({
                requerimiento:{
                    id_requerimiento: 0,
                    nombre: '',
                    descripcion: '',
                    id_usuario: response.data.id,
                    id_subProyecto: this.props.match.params.id_subproyecto,
                    fecha_creacion: '',
                    prioridad: '',
                    estado: '',
                    categoria: '',
                    id_template: ''
                }
            });
        })
        this.setState({
            modalInsertar: !this.state.modalInsertar,
            tipoModal: 'insertar'
        })
    }

    editar=async(requerimiento)=>{
        await this.setState({
            requerimiento: requerimiento
        });
        this.modalActualizar();
    }

    modalActualizar=()=>{
        this.setState({
            modalInsertar: !this.state.modalInsertar,
            tipoModal: 'actualizar'
        });
    }

    modalEliminar=(requerimiento)=>{
        this.setState({
            modalEliminar: true,
            requerimiento: requerimiento
        });
    }

    eliminar=()=>{
        const token = localStorage.getItem('token');
        Axios.delete(`http://localhost:8080/api/usuarioactividad/eliminar/id_requerimiento/${this.state.requerimiento.id_requerimiento}`,{headers: {"Authorization": `Bearer ${token}`}})
        .then(response=>{
            console.log(response.data);    
        })
        Axios.delete(`http://localhost:8080/api/requerimiento/eliminar/${this.state.requerimiento.id_requerimiento}`,{headers: {"Authorization": `Bearer ${token}`}})
        .then(response=>{
            this.setState({modalEliminar:false, requerimiento:'', requerimiento:{prioridad:'Baja',estado:'Creado'},});
            this.index();
        })
    }

    redactar=async(requerimiento)=>{
        await this.setState({
            requerimiento: requerimiento
        });
        this.modalRedactar();
    }

    modalRedactar=()=>{
        this.setState({
            modalRedactar : !this.state.modalRedactar
        });
    }

    render(){
        return(
            <React.Fragment>
            <Menu />
            <div className="requerimiento col-10">
                <div className="Encabezado"><p>Requerimientos</p></div>
                <button type="button" className="btn boton" onClick={() => this.modalInsertar()}>Insertar</button> &nbsp;
                <Link to={"/subProyecto/"+this.state.id_proy}><button type="button" className="btn boton"><ArrowBackIcon/></button></Link>
                
                <div style={{float:'right', textDecoration:'none'}}>
                    <Link to={"/matrizRelacion/"+this.props.match.params.id_subproyecto}><button type="button" className="btn boton">Ver Relacion Requerimientos</button></Link>
                </div>
                
                <TablaRequerimiento
                    requerimientos={this.state.requerimientos}
                    redactar={this.redactar}
                    editar={this.editar}
                    modalEliminar={this.modalEliminar}
                />

                <RequerimientoModal
                    requerimiento={this.state.requerimiento}
                    index={this.index}
                    tipoModal={this.state.tipoModal}
                    estadoModalInsertar={this.state.modalInsertar}
                    modalInsertar={this.modalInsertar}
                />

                <RedactarReqModal
                    requerimiento={this.state.requerimiento}
                    index={this.index}
                    estadoModalRedactar={this.state.modalRedactar}
                    modalRedactar={this.modalRedactar}
                />

                <Modal isOpen={this.state.modalEliminar}>
                    <ModalBody>
                        ¿Seguro que desea eliminar el requerimiento?
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

export default Requerimiento;