import Axios from 'axios';
import React, {Component} from 'react';
import { Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import TablaTemplate from './TablaTemplate';
import TemplateModal from './TemplateModal';
import VistaTemplate from './VistaTemplate';

class Template extends Component{

    state={
        templates: [],
        modalInsertar: false,
        modalEliminar: false,
        modalVista: false,
        tipoModal: '',
        template: {
            id_template: 0,
            prefijo: '',
            nombre: '',
            tipo: '',
            template: '',
            fecha: ''
        }
    }

    index=()=>{
        Axios.get('http://localhost:8080/api/template/')
        .then(response=>{
            this.setState({
                templates: response.data
            });
        })
    }

    componentDidMount(){
        this.index();
    }

    modalInsertar=()=>{
        this.setState({
            template: '',
            template:{template:''},
            modalInsertar: !this.state.modalInsertar,
            tipoModal: 'insertar'
        });
    }

    verTemplate=async(template)=>{
        await this.setState({
            template: template
        });
        this.modalVer();
    }

    modalVer=()=>{
        this.setState({
            modalVista: !this.state.modalVista
        });
    }

    editar=async(template)=>{
        await this.setState({
            template: template
        });
        this.modalActualizar();
    }

    modalActualizar=()=>{
        this.setState({
            modalInsertar: !this.state.modalInsertar,
            tipoModal: 'actualizar'
        });
    }

    modalEliminar=(template)=>{
        this.setState({
            modalEliminar:true,
            template: template
        });
    }

    eliminar=()=>{
        Axios.delete(`http://localhost:8080/api/template/eliminar/${this.state.template.id_template}`)
        .then(response=>{
            this.setState({modalEliminar:false, template:'', template:{template:''}});
            this.index();
        })
    }

    render(){
        return(
            <div className="templates col-10">
                <div className="Encabezado"><p>Templates</p></div>
                <button type="button" class="btn btn-success" onClick={() => this.modalInsertar()}>Insertar</button>

                <TablaTemplate
                    templates={this.state.templates}
                    editar={this.editar}
                    modalEliminar={this.modalEliminar}
                    verTemplate={this.verTemplate}
                />

                <TemplateModal
                    template={this.state.template}
                    index={this.index}
                    tipoModal={this.state.tipoModal}
                    estadoModalInsertar={this.state.modalInsertar}
                    modalInsertar={this.modalInsertar}
                />

                <VistaTemplate
                    template={this.state.template}
                    modalVista={this.state.modalVista}
                    estadoModalVista={this.modalVer}
                />

                <Modal isOpen={this.state.modalEliminar}>
                    <ModalBody>
                        ¿Seguro que desea eliminar el template?
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

export default Template;