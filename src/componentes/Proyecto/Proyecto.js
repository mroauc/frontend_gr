import Axios from 'axios';
import React, {Component} from 'react';
import { Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import ProyectoModal from './ProyectoModal';
import TablaProyecto from './TablaProyecto';

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
    }

    componentDidMount(){
        this.index();
    }

    modalInsertar=()=>{
        this.setState({
            proyecto: '',
            modalInsertar: !this.state.modalInsertar,
            tipoModal: 'insertar'
        });
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

    render(){
        return(
            <div className="proyecto col-10">
                <div className="encabezado"><p>Proyectos</p></div>
                <button type="button" class="btn btn-success" onClick={() => this.modalInsertar()}>Insertar</button>

                <TablaProyecto
                    proyectos={this.state.proyectos}
                    editar={this.editar}
                    modalEliminar={this.modalEliminar}
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
        );
    }
}

export default Proyecto;