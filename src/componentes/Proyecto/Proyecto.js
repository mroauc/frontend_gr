import Axios from 'axios';
import React, {Component} from 'react';
import { Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import Menu from '../Menu/Menu';
import ProyectoModal from './ProyectoModal';
import TablaProyecto from './TablaProyecto';
import html2pdf from 'html2pdf.js';
import './Proyecto.css';
import '../vistaCrud.css';
import './TablaPDF.css';

class Proyecto extends Component{

    state={
        proyectos: [],
        modalInsertar: false,
        modalEliminar: false,
        tipoModal: '',
        proyecto: {
            id_proyecto: 0,
            nombre: '',
            fecha_inicio: '',
            fecha_fin: '',
            id_usuario: '',
            fecha_creacion: ''
        }
    }

    index=()=>{
        const token = localStorage.getItem('token');
        Axios.get('http://localhost:8080/api/proyecto/', {headers: {"Authorization": `Bearer ${token}`}})
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
    }

    modalInsertar=async()=>{
        const token = localStorage.getItem('token');
        await Axios.get(`http://localhost:8080/api/usuario/${localStorage.getItem('email')}`,{headers: {"Authorization": `Bearer ${token}`}})
        .then(response=>{
            this.setState({
                proyecto:{id_proyecto: 0, nombre: '', fecha_inicio: '',fecha_fin: '',id_usuario:response.data.id, fecha_creacion: ''},
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
        Axios.delete(`http://localhost:8080/api/proyecto/eliminar/${this.state.proyecto.id_proyecto}`,{headers: {"Authorization": `Bearer ${token}`}})
        .then(response=>{
            this.setState({modalEliminar:false, proyecto:''});
            this.index();
        })
    }

    generarPDF=async(id_proyecto)=>{
        const token = localStorage.getItem('token');
        await Axios.get(`http://localhost:8080/api/subProyecto/pertenecientes/${id_proyecto}`,{headers: {"Authorization": `Bearer ${token}`}})
        .then(response=>{
            this.finalizarGeneracionPDF(response.data);
        })
    }

    finalizarGeneracionPDF=async(subProyectos)=>{
        const token = localStorage.getItem('token');
        var requerimientos = [];
        for (let index = 0; index < subProyectos.length; index++) {
            await Axios.get(`http://localhost:8080/api/requerimiento/obtener/${subProyectos[index].id_subProyecto}`,{headers: {"Authorization": `Bearer ${token}`}})
            .then(response=>{
                for (let index = 0; index < response.data.length; index++) {
                    var elemento = {nombre: response.data[index].nombre, descripcion: response.data[index].descripcion};
                    requerimientos = [...requerimientos, elemento];
                }
            })

            var imprimir = '<div class="formatoImprimirPrincipal"><div class="cabeceraImprimirPrincipal"><h4>Subproyecto</h4></div>';
            imprimir = imprimir + '<div class="formatoImprimir">'; //primer div
            var cabecera = '<div class="cabeceraImprimir"> <h5>Requerimiento analista</h5></div><br>';
            imprimir = imprimir + cabecera;
            for (let index = 0; index < requerimientos.length; index++) {
                imprimir = imprimir + '<strong>' + requerimientos[index].nombre + '</strong><br><br>' + requerimientos[index].descripcion + '<br>';
            }
            imprimir = imprimir + '</div>'; //cierre primer div
            imprimir = imprimir + '</div>'; //cierre div verde

            html2pdf().set({filename: 'documentoSalida'}).from(imprimir).save();
        }
    }

    render(){
        return(
            <React.Fragment>
                <Menu/>
                <div className="proyecto col-10">
                <div className="Encabezado"><p>Listado de Proyectos</p></div>
                <button type="button" class="btn boton" onClick={() => this.modalInsertar()}>Nuevo Proyecto</button>

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
            </React.Fragment>
        );
    }
}

export default Proyecto;