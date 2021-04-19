import Axios from 'axios';
import React, {Component} from 'react';
import { Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import Menu from '../Menu/Menu';
import TablaTemplate from './TablaTemplate';
import TemplateModal from './TemplateModal';
import VistaTemplate from './VistaTemplate';
import './Template.css';
import '../vistaCrud.css';
import jQuery from 'jquery';

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
            template: '<figure class="table"><table><tbody><tr id="titulo_t"><td><strong>Ingrese Titulo</strong></td></tr><tr><td>&nbsp;</td></tr></tbody></table></figure>',
            fecha: ''
        }
    }

    index=()=>{
        const token = localStorage.getItem('token');
        Axios.get(localStorage.getItem('url') + '/api/template/', {headers: {"Authorization": `Bearer ${token}`}})
        .then(response=>{
            this.setState({
                templates: response.data
            });
        })
        .catch(()=>{
            this.props.history.push('/noAutorizado');
        })
    }

    componentDidMount(){
        this.index();
    }

    modalInsertar=()=>{
        this.setState({
            template: '',
            template:{template:'<figure class="table"><table><tbody><tr id="titulo_t"><td><strong>Ingrese Titulo</strong></td></tr><tr><td>&nbsp;</td></tr></tbody></table></figure>'},
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
        if(this.state.modalVista===true){
            this.setState({
                template: '',
                template:{template:'<figure class="table"><table><tbody><tr id="titulo_t"><td><strong>Ingrese Titulo</strong></td></tr><tr><td>&nbsp;</td></tr></tbody></table></figure>'},
            });
        }
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
        const token = localStorage.getItem('token');
        Axios.delete(localStorage.getItem('url') + `/api/template/eliminar/${this.state.template.id_template}`,{headers: {"Authorization": `Bearer ${token}`}})
        .then(response=>{
            this.setState({modalEliminar:false, template:'', template:{template:'<figure class="table"><table><tbody><tr id="titulo_t"><td><strong>Ingrese Titulo</strong></td></tr><tr><td>&nbsp;</td></tr></tbody></table></figure>'}});
            this.index();
        })
    }

    render(){
        return(
            <React.Fragment>
                <Menu/>
                <div className="template col-10">
                <div className="Encabezado"><p>Templates</p></div>
                <button type="button" class="btn boton" onClick={() => this.modalInsertar()}>Insertar</button>

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
            </React.Fragment>
        );
    }
}

export default Template;