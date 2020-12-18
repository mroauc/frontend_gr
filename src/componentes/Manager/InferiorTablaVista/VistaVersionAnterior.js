import React, {Component} from 'react';
import { Modal, ModalBody, ModalHeader } from 'reactstrap';
import TemplateTextEditor from '../../Template/TemplateTextEditor';

class VistaVersionAnterior extends Component{
    state={
        version: {
            id_version_anterior: '',
            estado: '',
            fecha: '',
            id_requerimiento: '',
            id_usuario: '',
            descripcion: '',
            nombre_descriptivo: '',
            prioridad: '',
            cambios_realizados: ''
        }
    }

    componentWillReceiveProps(next_props){
        this.setState({version: this.props.version});
    }

    obtenerNombre=(id_usuario)=>{
        for (let index = 0; index < this.props.usuarios.length; index++) {
            if(this.props.usuarios[index].id === id_usuario){
                return this.props.usuarios[index].nombre;
            }
        }
    }

    obtenerTemplate=()=>{
    }

    render(){
        return(
            <React.Fragment>
                <Modal isOpen={this.props.modalVista} toggle={()=>this.props.cambiarEstadoModal()}>
                    <ModalHeader style={{display: 'block'}}>
                        <span>Version Anterior</span>
                        <span style={{cursor:'pointer', float:'right'}} onClick={()=>{this.props.cambiarEstadoModal()}}>X</span>
                    </ModalHeader>
                    <ModalBody>
                        <div className="form-group">
                            <label htmlFor="nombre_descriptivo">Descripcion</label>
                            <input className="form-control" type="text" name="nombre_descriptivo" id="nombre_descriptivo" value={this.state.version.nombre_descriptivo} readOnly />
                            <br/>
                            <label htmlFor="estado">Estado</label>
                            <input className="form-control" type="text" name="estado" id="estado" value={this.state.version.estado} readOnly/>
                            <br/>
                            <label htmlFor="prioridad">Prioridad</label>
                            <input className="form-control" type="text" name="prioridad" id="prioridad" value={this.state.version.prioridad} readOnly/>
                            <br/>
                            <label htmlFor="id_usuario">Usuario Responsable</label>
                            <input className="form-control" type="text" name="id_usuario" id="id_usuario" value={this.obtenerNombre(this.state.version.id_usuario)} readOnly/>
                            <br/>
                            <label htmlFor="fecha">Fecha</label>
                            <input className="form-control" type="text" name="fecha" id="fecha" value={this.state.version.fecha} readOnly/>
                            <br/>
                            <label htmlFor="tipo">Template</label>
                            <TemplateTextEditor
                                template = {this.state.version.descripcion}
                                obtenerTemplate = {this.obtenerTemplate}
                                soloLeer = {true}
                            />
                        </div>
                    </ModalBody>
                </Modal>
            </React.Fragment>
        );
    }
}

export default VistaVersionAnterior;