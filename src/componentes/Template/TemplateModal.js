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
        msj_prefijo: "",
        msj_nombre: "",
        msj_tipo: ""
    }

    componentWillReceiveProps(next_props){
        this.setState({template:this.props.template});
    }

    validar=()=>{
        let salida = true;
        if(!this.state.template.prefijo){
            this.setState({
                msj_prefijo: "Campo Vacio"
            });
            salida = false;
        }
        if(!this.state.template.nombre){
            this.setState({
                msj_nombre: "Campo Vacio"
            });
            salida = false;
        }
        if(!this.state.template.tipo){
            this.setState({
                msj_tipo: "Campo Vacio"
            });
            salida = false;
        }
        if(!this.state.template.template){
            salida = false;
        }
        return salida;
    }

    guardar=async()=>{
        if(this.validar()){
            const token = localStorage.getItem('token');
            console.log(this.state.template.template)
            await Axios.post('http://localhost:8080/api/template/guardar/',{
                prefijo: this.state.template.prefijo,
                nombre: this.state.template.nombre,
                tipo: this.state.template.tipo,
                template: this.state.template.template,
                fecha: new Date().toLocaleString()
            }, {headers: {"Authorization" : `Bearer ${token}`}})
            .then(response=>{
                this.setState({
                    msj_prefijo: "",
                    msj_nombre: "",
                    msj_tipo: "",
                });
                this.props.modalInsertar();
                this.props.index();
            })
        }
    }

    guardarActualizacion=()=>{
        if(this.validar()){
            const token = localStorage.getItem('token');
            Axios.post('http://localhost:8080/api/template/editar/',this.state.template, {headers: {"Authorization": `Bearer ${token}`}})
            .then(response=>{
                this.props.modalInsertar();
                this.props.index();
            })
        }
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

    cerrar=()=>{
        this.setState({
            msj_prefijo: "",
            msj_nombre: "",
            msj_tipo: "",
        });
        this.props.modalInsertar();
    }

    mostrar=()=>{
        console.log(this.state.template);
    }

    render(){
        return(
            <React.Fragment>
                <Modal isOpen={this.props.estadoModalInsertar} size="lg" toggle={()=>this.cerrar()}>
                    <ModalHeader style={{display: 'block'}}>
                        <span>{(this.props.tipoModal==='insertar') ? 'Ingresar Template' :'Editar Template'}</span>

                        <span style={{cursor:'pointer', float:'right'}} onClick={()=>{this.cerrar()}}>X</span>
                    </ModalHeader>
                    <ModalBody>
                        <div className="form-group">
                            <label htmlFor="id_template">ID</label>
                            <input className="form-control" type="text" name="id_template" id="id_template" value={this.state.template.id_template} readOnly/>
                            <br/>
                            <label htmlFor="prefijo">Prefijo</label>
                            <input className={ (this.state.msj_prefijo)? "form-control is-invalid" : "form-control"} type="text" name="prefijo" id="prefijo" onChange={this.changeHandler} value={this.state.template.prefijo} onClick={()=>{this.setState({msj_prefijo:""})}} />
                            <div className="invalid-feedback">
                                {this.state.msj_prefijo}
                            </div>
                            <br/>
                            <label htmlFor="nombre">Nombre</label>
                            <input className={ (this.state.msj_nombre)? "form-control is-invalid" : "form-control"} type="text" name="nombre" id="nombre" onChange={this.changeHandler} value={this.state.template.nombre} onClick={()=>{this.setState({msj_nombre:""})}} />
                            <div className="invalid-feedback">
                                {this.state.msj_nombre}
                            </div>
                            <br/>
                            <label htmlFor="tipo">Tipo</label>
                            <input className={ (this.state.msj_tipo)? "form-control is-invalid" : "form-control"} type="text" name="tipo" id="tipo" onChange={this.changeHandler} value={this.state.template.tipo} onClick={()=>{this.setState({msj_tipo:""})}} />
                            <div className="invalid-feedback">
                                {this.state.msj_tipo}
                            </div>
                            <br/>
                            <label htmlFor="tipo">Template</label>
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
                        <button className="btn btn-danger" onClick={()=>this.cerrar()}>Cancelar</button>
                    </ModalFooter>
                </Modal>
            </React.Fragment>
        );
    }

}

export default TemplateModal;