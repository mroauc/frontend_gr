import Axios from 'axios';
import React, { Component } from 'react'
import { act } from 'react-dom/test-utils';
import { Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import TemplateTextEditor from './TemplateTextEditor';
import jQuery from 'jquery';

class TemplateModal extends Component{
    state={
        template: {
            id_template: 0,
            prefijo: '',
            nombre: '',
            tipo: '',
            template: '<figure class="table"><table><tbody><tr id="titulo_t"><td><strong>Ingrese Titulo</strong></td></tr><tr><td>&nbsp;</td></tr></tbody></table></figure>',
            fecha: ''
        },
        antiguo_template: "",
        msj_prefijo: "",
        msj_nombre: "",
        msj_tipo: ""
    }

    componentWillReceiveProps(next_props){
        this.setState({template:this.props.template, antiguo_template:this.props.template.template});
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
                if(this.state.antiguo_template !== this.state.template.template){
                    this.modificarRequerimientos(response.data.id_template, response.data.template, this.state.antiguo_template);
                }
                this.props.modalInsertar();
                this.props.index();
            })
        }
    }

    modificarRequerimientos=(id_template, nuevoTemplate, oldTemplate)=>{
        const token = localStorage.getItem('token');
        var nt = nuevoTemplate.replace(/<[^>]+>/g, '');
        var nuevotitulo = nt.replace('&nbsp;','');

        Axios.get(`http://localhost:8080/api/requerimiento/obtener/template/${id_template}`, {headers: {"Authorization": `Bearer ${token}`}})
        .then(response=>{
            for (let index = 0; index < response.data.length; index++) {
                var requeri = response.data[index];
                var tl = oldTemplate.replace(/<[^>]+>/g, '');
                var titulo = tl.replace('&nbsp;', '')
                var nueva_descr = requeri.descripcion.replace(titulo, nuevotitulo);
                requeri.descripcion = nueva_descr;
                Axios.post('http://localhost:8080/api/requerimiento/editar/',requeri, {headers: {"Authorization" : `Bearer ${token}`}});
            }
        });
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