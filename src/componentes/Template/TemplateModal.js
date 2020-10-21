import Axios from 'axios';
import React, { Component } from 'react'
import { act } from 'react-dom/test-utils';
import { Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import TemplateTextEditor from './TemplateTextEditor';

class TemplateModal extends Component{
    state={
        template: {
            id_template: 0,
            prefijo: '',
            nombre: '',
            tipo: '',
            template: '',
            fecha: ''
        },
    }

    componentWillReceiveProps(next_props){
        this.setState({template:this.props.template});
    }

    guardar=async()=>{
        const token = localStorage.getItem('token');
        await Axios.post('http://localhost:8080/api/template/guardar/',{
            prefijo: this.state.template.prefijo,
            nombre: this.state.template.nombre,
            tipo: this.state.template.tipo,
            template: this.state.template.template,
            fecha: new Date().toLocaleString()
        }, {headers: {"Authorization" : `Bearer ${token}`}})
        .then(response=>{
            this.props.modalInsertar();
            this.props.index();
        })
    }

    guardarActualizacion=()=>{
        const token = localStorage.getItem('token');
        const requestInfo = {
            method: 'POST',
            body: JSON.stringify(this.state.template),
            headers: new Headers({
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            })
        };
        Axios.post('http://localhost:8080/api/template/editar/',this.state.template, {headers: {"Authorization": `Bearer ${token}`}})
        .then(response=>{
            this.props.modalInsertar();
            this.props.index();
        })
    }

    changeHandler=async(e)=>{
        await this.setState({
            template:{
                ...this.state.template, [e.target.name]: e.target.value
            }
        });
    }

    obtenerTemplate=async(e)=>{
        const actual = this.state.template;
        await this.setState({
            template:{
                id_template: actual.id_template,
                prefijo: actual.prefijo,
                nombre: actual.nombre,
                tipo: actual.tipo,
                template: e,
                fecha: actual.fecha
            }
        });
    }

    mostrar=()=>{
        console.log(this.state.template);
    }

    render(){
        return(
            <React.Fragment>
                <Modal isOpen={this.props.estadoModalInsertar}>
                    <ModalHeader style={{display: 'block'}}>
                        <span style={{cursor:'pointer', float:'right'}} onClick={()=>{this.props.modalInsertar()}}>X</span>
                    </ModalHeader>
                    <ModalBody>
                        <div className="form-group">
                            <label htmlFor="id_template">ID</label>
                            <input className="form-control" type="text" name="id_template" id="id_template" value={this.state.template.id_template} readOnly/>
                            <br/>
                            <label htmlFor="prefijo">Prefijo</label>
                            <input className="form-control" type="text" name="prefijo" id="prefijo" onChange={this.changeHandler} value={this.state.template.prefijo} />
                            <br/>
                            <label htmlFor="nombre">Nombre</label>
                            <input className="form-control" type="text" name="nombre" id="nombre" onChange={this.changeHandler} value={this.state.template.nombre} />
                            <br/>
                            <label htmlFor="tipo">Tipo</label>
                            <input className="form-control" type="text" name="tipo" id="tipo" onChange={this.changeHandler} value={this.state.template.tipo} />
                            <br/>
                            <TemplateTextEditor
                                template={this.state.template.template}
                                obtenerTemplate={this.obtenerTemplate}
                            />                            
                        </div>
                    </ModalBody>
                    <ModalFooter>
                        {this.props.tipoModal==='insertar'?
                            <button className="btn btn-success" onClick={()=>this.guardar()}>
                                Insertar
                            </button>
                            :
                            <button className="btn btn-success" onClick={()=>this.guardarActualizacion()}>
                                Actualizar
                            </button>
                        }
                        <button className="btn btn-danger" onClick={()=>this.props.modalInsertar()}>Cancelar</button>
                    </ModalFooter>
                </Modal>
            </React.Fragment>
        );
    }

}

export default TemplateModal;