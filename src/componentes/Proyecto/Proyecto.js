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
        const tipo_usuario = localStorage.getItem("tipo");
        const id_usuario = localStorage.getItem("id");
        console.log(tipo_usuario);
        console.log(id_usuario);

        Axios.get(`http://localhost:8080/api/proyecto/id_usuario/${id_usuario}/${tipo_usuario}`, {headers: {"Authorization": `Bearer ${token}`}})
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
        var conjuntoImprimir = [];
        var imprimir = '';
        for (let index = 0; index < subProyectos.length; index++) {
            imprimir = imprimir + '<div class="formatoSubproyecto"><div class="cabeceraSubProyecto"><h4>Subproyecto <strong>'+ subProyectos[index].nombre_subProyecto +'</strong></h4></div>';
            await Axios.get(`http://localhost:8080/api/requerimiento/obtener/${subProyectos[index].id_subProyecto}`, {headers: {"Authorization": `Bearer ${token}`}})
            .then(response=>{
                var rusa = response.data.filter(req => req.categoria === 'RUSA');
                var rusl = response.data.filter(req => req.categoria === 'RUSL');
                var rusj = response.data.filter(req => req.categoria === 'RUSJ');
                var rusc = response.data.filter(req => req.categoria === 'RUSC');
                var russ = response.data.filter(req => req.categoria === 'RUSS');
                var reqf = response.data.filter(req => req.categoria === 'REQF');
                var renf = response.data.filter(req => req.categoria === 'RENF');
                
                if(rusa.length > 0){
                    imprimir = imprimir + '<div class="formatoRequerimiento">'; //primer div (tabla celeste)
                    imprimir = imprimir + '<div class="cabeceraRequerimiento"> <h5>Requerimientos de Analista</h5></div><br>'; //apertura y cierre cabecera celeste
                    for (let index = 0; index < rusa.length; index++) {    
                        imprimir = imprimir + '<strong>' + rusa[index].nombre + '</strong><br><br>' + rusa[index].descripcion + '<br>';
                    }
                    imprimir = imprimir + '</div>';
                }

                if(rusl.length > 0){
                    imprimir = imprimir + '<div class="formatoRequerimiento">'; //primer div (tabla celeste)
                    imprimir = imprimir + '<div class="cabeceraRequerimiento"> <h5>Requerimientos de Líder de Subproyecto</h5></div><br>'; //apertura y cierre cabecera celeste
                    for (let index = 0; index < rusl.length; index++) {    
                        imprimir = imprimir + '<strong>' + rusl[index].nombre + '</strong><br><br>' + rusl[index].descripcion + '<br>';
                    }
                    imprimir = imprimir + '</div>';
                }

                if(rusj.length > 0){
                    imprimir = imprimir + '<div class="formatoRequerimiento">'; //primer div (tabla celeste)
                    imprimir = imprimir + '<div class="cabeceraRequerimiento"> <h5>Requerimientos de Jefe de Proyecto</h5></div><br>'; //apertura y cierre cabecera celeste
                    for (let index = 0; index < rusj.length; index++) {    
                        imprimir = imprimir + '<strong>' + rusj[index].nombre + '</strong><br><br>' + rusj[index].descripcion + '<br>';
                    }
                    imprimir = imprimir + '</div>';
                }

                if(rusc.length > 0){
                    imprimir = imprimir + '<div class="formatoRequerimiento">'; //primer div (tabla celeste)
                    imprimir = imprimir + '<div class="cabeceraRequerimiento"> <h5>Requerimientos de Cliente</h5></div><br>'; //apertura y cierre cabecera celeste
                    for (let index = 0; index < rusc.length; index++) {    
                        imprimir = imprimir + '<strong>' + rusc[index].nombre + '</strong><br><br>' + rusc[index].descripcion + '<br>';
                    }
                    imprimir = imprimir + '</div>';
                }

                if(russ.length > 0){
                    imprimir = imprimir + '<div class="formatoRequerimiento">'; //primer div (tabla celeste)
                    imprimir = imprimir + '<div class="cabeceraRequerimiento"> <h5>Requerimientos de Administrador del Sistema</h5></div><br>'; //apertura y cierre cabecera celeste
                    for (let index = 0; index < russ.length; index++) {    
                        imprimir = imprimir + '<strong>' + russ[index].nombre + '</strong><br><br>' + russ[index].descripcion + '<br>';
                    }
                    imprimir = imprimir + '</div>';
                }

                if(reqf.length > 0){
                    imprimir = imprimir + '<div class="formatoRequerimiento">'; //primer div (tabla celeste)
                    imprimir = imprimir + '<div class="cabeceraRequerimiento"> <h5>Requerimientos Funcionales</h5></div><br>'; //apertura y cierre cabecera celeste
                    for (let index = 0; index < reqf.length; index++) {    
                        imprimir = imprimir + '<strong>' + reqf[index].nombre + '</strong><br><br>' + reqf[index].descripcion + '<br>';
                    }
                    imprimir = imprimir + '</div>';
                }

                if(renf.length > 0){
                    imprimir = imprimir + '<div class="formatoRequerimiento">'; //primer div (tabla celeste)
                    imprimir = imprimir + '<div class="cabeceraRequerimiento"> <h5>Requerimientos No Funcionales</h5></div><br>'; //apertura y cierre cabecera celeste
                    for (let index = 0; index < renf.length; index++) {    
                        imprimir = imprimir + '<strong>' + renf[index].nombre + '</strong><br><br>' + renf[index].descripcion + '<br>';
                    }
                    imprimir = imprimir + '</div>';
                }
            })
            imprimir = imprimir + '</div><br>';
        }

        html2pdf().set({filename: 'documentoSalida'}).from(imprimir).save();
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