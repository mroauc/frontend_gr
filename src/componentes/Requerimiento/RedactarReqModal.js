import Axios from 'axios';
import React, {Component} from 'react';
import { Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import TemplateTextEditor from '../Template/TemplateTextEditor';

class RedactarReqModal extends Component{
    state={
        requerimiento: {
            id_requerimiento: 0,
            nombre: '',
            descripcion: '',
            id_usuario: '',
            id_subProyecto: '',
            fecha_creacion: '',
            prioridad: '',
            estado: '',
            categoria: '',
            id_template: ''
        },
        dataRequerimiento: ''   //redaccion del requerimiento
    }

    componentWillReceiveProps(next_props){
        this.setState({requerimiento: this.props.requerimiento});
    }

    obtenerTemplate=async(e)=>{
        await this.setState({
            dataRequerimiento: e
        });
    }

    insertar=()=>{
        const actual = this.state.requerimiento;
        actual.descripcion = this.state.dataRequerimiento;
        this.setState({requerimiento: actual});
        const token = localStorage.getItem('token');
        Axios.post('http://localhost:8080/api/requerimiento/editar/',this.state.requerimiento, {headers: {"Authorization": `Bearer ${token}`}})
        .then(response=>{
            this.props.modalRedactar();
            this.props.index();
        })
    }

    render(){
        return(
            <React.Fragment>
                <Modal isOpen={this.props.estadoModalRedactar} toggle={()=>this.props.modalRedactar()}>
                    <ModalHeader style={{display:'block'}}>
                        <span style={{cursor:'pointer', float:'right'}} onClick={()=>this.props.modalRedactar()}>X</span>
                    </ModalHeader>
                    <ModalBody>
                        <div className="form-group">
                            <label htmlFor="id_requerimiento">ID</label>
                            <input className="form-control" type="text" name="id_requerimiento" id="id_requerimiento" value={this.state.requerimiento.id_requerimiento} readOnly/>
                            <br/>
                            <label htmlFor="descripcion">Nombre</label>
                            <input className="form-control" type="text" name="nombre" id="nombre" value={this.state.requerimiento.nombre} readOnly/>
                            <br/>
                            <label htmlFor="tipo">Template</label>
                            <TemplateTextEditor 
                                template={this.state.requerimiento.descripcion}
                                obtenerTemplate={this.obtenerTemplate}
                            />
                        </div>
                    </ModalBody>
                    <ModalFooter>
                        <button className="btn btn-success" onClick={()=>this.insertar()}>Insertar</button>
                        <button className="btn btn-danger" onClick={()=>this.props.modalRedactar()}>Cancelar</button>
                    </ModalFooter>
                </Modal>
            </React.Fragment>
        )
    }
}

export default RedactarReqModal;