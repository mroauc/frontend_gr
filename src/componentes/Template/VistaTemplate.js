import React, { Component } from 'react'
import { Modal, ModalBody, ModalHeader } from 'reactstrap';
import parse from 'html-react-parser';
import TemplateTextEditor from './TemplateTextEditor';

class VistaTemplate extends Component{

    state={
        template: {
            id_template: 0,
            prefijo: '',
            nombre: '',
            tipo: '',
            template: '',
            fecha: ''
        }
    }

    componentWillReceiveProps(next_props){
        this.setState({template: this.props.template});
    }

    obtenerTemplate=()=>{
    }

    render(){
        return(
            <React.Fragment>
                <Modal isOpen={this.props.modalVista} toggle={()=>this.props.estadoModalVista()}>
                    <ModalHeader style={{display: 'block'}}>
                        <span style={{cursor:'pointer', float:'right'}} onClick={()=>{this.props.estadoModalVista()}}>X</span>
                    </ModalHeader>
                    <ModalBody>
                        <div className="form-group">
                            <label htmlFor="id_template">ID</label>
                            <input className="form-control" type="text" name="id_template" id="id_template" value={this.state.template.id_template} readOnly/>
                            <br/>
                            <label htmlFor="prefijo">Prefijo</label>
                            <input className="form-control" type="text" name="prefijo" id="prefijo" value={this.state.template.prefijo} readOnly/>
                            <br/>
                            <label htmlFor="nombre">Nombre</label>
                            <input className="form-control" type="text" name="nombre" id="nombre" value={this.state.template.nombre} readOnly />
                            <br/>
                            <label htmlFor="tipo">Tipo</label>
                            <input className="form-control" type="text" name="tipo" id="tipo" value={this.state.template.tipo} readOnly/>
                            <br/>
                            <label htmlFor="tipo">Template</label>
                            <TemplateTextEditor
                                template = {this.state.template.template}
                                obtenerTemplate={this.obtenerTemplate}
                                soloLeer={true}
                            />
                
                        </div>
                    </ModalBody>
                </Modal>
            </React.Fragment>
        );
    }
}
export default VistaTemplate;