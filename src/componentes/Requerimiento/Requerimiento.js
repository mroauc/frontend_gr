import Axios from 'axios';
import React, {Component} from 'react';
import { Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import RequerimientoModal from './RequerimientoModal';
import TablaRequerimiento from './TablaRequerimiento';

class Requerimiento extends Component{

    state={
        requerimientos: [],
        modalInsertar: false,
        modalEliminar: false,
        tipoModal: '',
        requerimiento: {
            id_requerimiento: 0,
            descripcion: '',
            id_usuario: 0,
            id_subProyecto: 0,
            fecha_creacion: '',
            prioridad: 'Baja',
            estado: 'Creado',
            categoria: '',
            id_template: 0
        }
    }

    index=()=>{
        Axios.get('http://localhost:8080/api/requerimiento/')
        .then(response=>{
            this.setState({
                requerimientos: response.data
            });
        })
    }

    componentDidMount(){
        this.index();
    }

    modalInsertar=()=>{
        this.setState({
            requerimiento: '',
            requerimiento: {prioridad:'Baja',estado:'Creado'},
            modalInsertar: !this.state.modalInsertar,
            tipoModal: 'insertar'
        });
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
        Axios.delete(`http://localhost:8080/api/requerimiento/eliminar/${this.state.requerimiento.id_requerimiento}`)
        .then(response=>{
            this.setState({modalEliminar:false, requerimiento:'', requerimiento:{prioridad:'Baja',estado:'Creado'},});
            this.index();
        })
    }

    render(){
        return(
            <div className="requerimientos col-10">
                <div className="Encabezado"><p>Requerimientos</p></div>
                <button type="button" class="btn btn-success" onClick={() => this.modalInsertar()}>Insertar</button>

                <TablaRequerimiento
                    requerimientos={this.state.requerimientos}
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
        );
    }
}

export default Requerimiento;