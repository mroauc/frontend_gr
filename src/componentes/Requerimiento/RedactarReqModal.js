import Axios from 'axios';
import React, {Component} from 'react';
import { Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import TemplateTextEditor from '../Template/TemplateTextEditor';

class RedactarReqModal extends Component{
    state={
        requerimiento: {
            id_requerimiento: 0,
            descripcion: '',
            id_usuario: '',
            id_subProyecto: '',
            fecha_creacion: '',
            prioridad: '',
            estado: '',
            categoria: '',
            id_template: ''
        },
        template: '',   //template para escribir el requerimiento
        dataRequerimiento: ''   //redaccion del requerimiento
    }

    componentDidMount(){
        this.buscarTemplate();
    }

    componentWillReceiveProps(next_props){
        this.setState({requerimiento: this.props.requerimiento});
    }

    buscarTemplate=async()=>{
        const token = localStorage.getItem('token');

        await Axios.get(`http://localhost:8080/api/template/${this.state.requerimiento.id_template}`, {headers: {"Authorization": `Bearer ${token}`}})
        .then(response=>{
            this.setState({
                template: response.data[0].template
            });
        })
    }

    obtenerTemplate=async(e)=>{
        await this.setState({
            dataRequerimiento: e
        });
        console.log(this.state.dataRequerimiento);
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
                            <label htmlFor="descripcion">Descripcion</label>
                            <input className="form-control" type="text" name="descripcion" id="descripcion" value={this.state.requerimiento.descripcion} readOnly/>
                            <br/>
                            <TemplateTextEditor 
                                template={this.state.template}
                                obtenerTemplate={this.obtenerTemplate}
                            />
                        </div>
                    </ModalBody>
                    <ModalFooter>
                        <button className="btn btn-success">Insertar</button>
                        <button className="btn btn-danger" onClick={()=>this.props.modalRedactar()}>Cancelar</button>
                    </ModalFooter>
                </Modal>
            </React.Fragment>
        )
    }
}

export default RedactarReqModal;