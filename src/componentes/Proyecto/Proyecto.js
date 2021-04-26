import Axios from 'axios';
import React, {Component} from 'react';
import { Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import Menu from '../Menu/Menu';
import ProyectoModal from './ProyectoModal';
import TablaProyecto from './TablaProyecto';
import './Proyecto.css';
import '../vistaCrud.css';
import './TablaPDF.css';
import finalizarGeneracionPDF from './FinalizarDocumento'

class Proyecto extends Component{

    state={
        proyectos: [],
        modalInsertar: false,
        modalEliminar: false,
        tipoModal: '',
        proyecto: {
            id_proyecto: 0,
            nombre: '',
            fecha_inicio: new Date().toLocaleDateString('fr-CA'),
            fecha_fin: '',
            id_usuario: 0,
            fecha_creacion: ''
        }
    }

    index=()=>{
        const token = localStorage.getItem('token');
        const tipo_usuario = localStorage.getItem("tipo");
        const id_usuario = localStorage.getItem("id");
        Axios.get(localStorage.getItem('url') + `/api/proyecto/id_usuario/${id_usuario}/${tipo_usuario}`, {headers: {"Authorization": `Bearer ${token}`}})
        .then(response=>{
            this.setState({
                proyectos: response.data
            });
        })
        .catch(()=>{
            this.props.history.push('/noAutorizado');
        })
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
        await Axios.get(localStorage.getItem('url') + `/api/usuario/${localStorage.getItem('email')}`,{headers: {"Authorization": `Bearer ${token}`}})
        .then(response=>{
            this.setState({
                proyecto:{id_proyecto: 0, nombre: '', fecha_inicio: new Date().toLocaleDateString('fr-CA'), fecha_fin: '',id_usuario:0, fecha_creacion: ''},
            });
        })

        this.setState({
            modalInsertar: !this.state.modalInsertar,
            tipoModal: 'insertar'
        })
    }

    editar=async(proyecto)=>{
        await this.setState({
            proyecto: proyecto
        });
        this.modalActualizar();
    }

    modalActualizar=()=>{
        this.setState({
            modalInsertar: !this.state.modalInsertar,
            tipoModal: 'actualizar'
        });
    }

    modalEliminar=(proyecto)=>{
        this.setState({
            modalEliminar: true,
            proyecto: proyecto
        });
    }

    eliminar=()=>{
        const token = localStorage.getItem('token');
        Axios.delete(localStorage.getItem('url') + `/api/proyecto/eliminar/${this.state.proyecto.id_proyecto}`,{headers: {"Authorization": `Bearer ${token}`}})
        .then(response=>{
            this.setState({modalEliminar:false, proyecto:''});
            this.index();
        })
    }

    generarPDF=async(id_proyecto)=>{
        const token = localStorage.getItem('token');
        var copiaSubProyectos = [];
        await Axios.get(localStorage.getItem('url') + `/api/subProyecto/pertenecientes/${id_proyecto}`,{headers: {"Authorization": `Bearer ${token}`}})
        .then(response=>{
            copiaSubProyectos = response.data;
        })
        copiaSubProyectos = copiaSubProyectos
            .sort((a,b) => {
                if(a.index_documento === 0) return 1;
                if(b.index_documento === 0) return 0;
                
                return a.index_documento-b.index_documento
            });
        finalizarGeneracionPDF(copiaSubProyectos, id_proyecto);
    }

    accesoUsuario = () => {
        if(localStorage.getItem("tipo") === "admin" || localStorage.getItem("tipo") === "lider" || localStorage.getItem("tipo") === "jefe")
            return true;
        return false;
    }

    render(){
        return(
            <React.Fragment>
                <Menu/>
                <div id="principal" className="contenedorPrincipal">
                <div className="proyecto col-10">
                <div className="Encabezado"><p>Listado de Proyectos</p></div>
                {
                    this.accesoUsuario() ? 
                        <React.Fragment>
                            <button type="button" class="btn boton" onClick={() => this.modalInsertar()}>Nuevo Proyecto</button>
                        </React.Fragment>
                    : <div style={{height:"40px"}}></div>
                }

                <TablaProyecto
                    proyectos={this.state.proyectos}
                    editar={this.editar}
                    modalEliminar={this.modalEliminar}
                    generarPDF={this.generarPDF}
                />

                <ProyectoModal
                    proyecto={this.state.proyecto}
                    index={this.index}
                    tipoModal={this.state.tipoModal}
                    estadoModalInsertar={this.state.modalInsertar}
                    modalInsertar={this.modalInsertar}
                />

                <Modal isOpen={this.state.modalEliminar}>
                    <ModalBody>
                        ¿Seguro que desea eliminar el proyecto?
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

export default Proyecto;