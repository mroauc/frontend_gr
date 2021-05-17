import Axios from 'axios';
import React, {Component} from 'react';
import { Modal, ModalBody, ModalFooter, ModalHeader} from 'reactstrap';
import swal from 'sweetalert';

class cambiarConfiguracion extends Component{

    state={
        config:{
            id_config: '',
            prioridad: '',
            categoria: '',
            id_template: ''
        },
        user: '',
        templates: [],
        errorInputPrioridad: '',
        errorInputCategoria: '',
        errorInputTemplate: ''
    }

    componentDidMount(){
        this.cargarConfig();
        this.cargarTemplates();
    }

    cargarConfig=async()=>{
        const token=localStorage.getItem('token');
        await Axios.get(localStorage.getItem('url')+`/api/configReq/obtener/${localStorage.getItem('id')}`,{headers: {"Authorization":`Bearer ${token}`}})
        .then(response=>{
            if(response.data !== null){
                var aux = this.state.config;
                aux.id_config = response.data.id_config;
                aux.prioridad = response.data.prioridad;
                aux.categoria = response.data.categoria;
                aux.id_template = response.data.id_template;
                this.setState({
                    config: aux
                });
            }
        })
    }

    cargarTemplates=async()=>{
        const token=localStorage.getItem('token');
        await Axios.get(localStorage.getItem('url')+'/api/template/',{headers: {"Authorization" : `Bearer ${token}`}})
        .then(response=>{
            this.setState({
                templates: response.data
            });
        })
    }

    changeHandler=async(e)=>{
        await this.setState({
            config:{
                ...this.state.config, [e.target.name]: e.target.value
            }
        });
    }

    validar=()=>{
        let salida=true;
        if(this.state.config.prioridad === ""){
            this.setState({errorInputPrioridad : "Debe seleccionar una prioridad al requerimiento."});
            salida = false;
        }
        if(this.state.config.categoria === ""){
            this.setState({errorInputCategoria : "Debe seleccionar una categoria para el requerimiento."});
            salida = false;
        }
        if(this.state.config.id_template === ""){
            this.setState({errorInputTemplate : "Debe seleccionar una categoria para el requerimiento."});
            salida = false;
        }
        return salida;
    }

    initErrores=()=>{
        this.setState({
            errorInputCategoria: '',
            errorInputPrioridad: '',
            errorInputTemplate:''
        });
    }

    realizarCambio=async()=>{
        const token = localStorage.getItem('token');
        if(this.validar()){
            if(this.state.config.id_config === ''){ //nuevo
                await Axios.post(localStorage.getItem('url')+'/api/configReq/guardar/',{
                    id_usuario: localStorage.getItem("id"),
                    categoria: this.state.config.categoria,
                    prioridad: this.state.config.prioridad,
                    id_template: this.state.config.id_template
                }, {headers: {"Authorization" : `Bearer ${token}`}})
                .then(response=>{
                    var aux = this.state.config;
                    aux.id_config = response.data.id_config;
                    this.setState({
                        config: aux
                    });
                    this.initErrores();
                    this.props.cambiarEstadoConfig();
                })
            }else{  //reemplazo
                await Axios.post(localStorage.getItem('url')+'/api/configReq/editar/',{
                    id_config: this.state.config.id_config,
                    id_usuario: localStorage.getItem("id"),
                    categoria: this.state.config.categoria,
                    prioridad: this.state.config.prioridad,
                    id_template: this.state.config.id_template
                }, {headers: {"Authorization" : `Bearer ${token}`}})
                .then(response=>{
                    this.initErrores();
                    this.props.cambiarEstadoConfig();
                })
            }            
        }
    }

    eliminarConfiguracion=()=>{
        const token = localStorage.getItem('token');
        if(this.state.config.id_config !== ''){
            Axios.delete(localStorage.getItem('url')+`/api/configReq/eliminar/${this.state.config.id_config}`,{headers: {"Authorization": `Bearer ${token}`}})
            .then(response=>{
                this.setState({
                    config:{
                        id_config: '',
                        prioridad: '',
                        categoria: '',
                        id_template: ''
                    }
                });
                this.props.cambiarEstadoConfig();
            });
        }else{
            this.props.cambiarEstadoConfig();
        }
    }

    render(){
        return(
            <Modal isOpen={this.props.estadoCambiarConfig} toggle={()=>{this.props.cambiarEstadoConfig();this.initErrores()}}>
                <ModalHeader style={{display: 'block'}}>
                    <span>Configurar eleccion requerimientos</span>
                    <span style={{cursor:'pointer', float:'right'}} onClick={()=>{this.props.cambiarEstadoConfig();this.initErrores()}}>X</span>
                </ModalHeader>

                <ModalBody>
                    <div className="form-group">

                        <label htmlFor="prioridad">Prioridad</label>
                        <select className={(this.state.errorInputPrioridad)? "form-control is-invalid" : "form-control"} name="prioridad" id="prioridad" value={this.state.config.prioridad} onChange={this.changeHandler} onClick={() => {this.setState({errorInputPrioridad : ''})}}>
                            <option value="" selected>Seleccione una categoría</option>
                            <option value="Baja">Baja</option>
                            <option value="Media">Media</option>
                            <option value="Alta">Alta</option>
                        </select>
                        <div class="invalid-feedback" style={{display: 'block'}}>
                            {this.state.errorInputPrioridad}
                        </div>
                        <br/>

                        <label htmlFor="categoria">Categoría</label>
                        <select className={(this.state.errorInputCategoria)? "form-control is-invalid" : "form-control"} name="categoria" id="categoria" value={this.state.config.categoria} onChange={this.changeHandler} onClick={() => {this.setState({errorInputCategoria : ''})}}>
                            <option value="">Seleccione una categoría</option>
                            <option value="RUSA">Requerimiento Analista</option>
                            <option value="RUSL">Requerimiento Lider de subproyecto</option>
                            <option value="RUSJ">Requerimiento Jefe de proyecto</option>
                            <option value="RUSC">Requerimiento Cliente</option>
                            <option value="RUSS">Requerimiento Administrador</option>
                            <option value="REQF">Requerimiento Funcional</option>
                            <option value="RENF">Requerimiento No Funcional</option>
                        </select>
                        <div class="invalid-feedback" style={{display: 'block'}}>
                            {this.state.errorInputCategoria}
                        </div>
                        <br/> 

                        <label htmlFor="id_template">Template</label>
                        <select className={(this.state.errorInputTemplate)? "form-control is-invalid" : "form-control"} name="id_template" id="id_template" value={this.state.config.id_template} onChange={this.changeHandler} onClick={() => {this.setState({errorInputTemplate : ''})}}>
                            <option value="" selected>Seleccione un Template</option>
                            {this.state.templates.map(template=>{
                                return(
                                    <option value={template.id_template}>{template.nombre}</option>
                                )
                            })}
                        </select>
                        <div class="invalid-feedback" style={{display: 'block'}}>
                            {this.state.errorInputTemplate}
                        </div>
                        <br/>
                    </div>
                </ModalBody>
                <ModalFooter>
                    <button className="btn btn-dark" onClick={()=>this.eliminarConfiguracion()}>Eliminar configuracion</button>
                    <button className="btn btn-success" onClick={()=>this.realizarCambio()}>Guardar</button>
                    <button className="btn btn-danger" onClick={()=>{this.props.cambiarEstadoConfig();this.initErrores()}}>Cancelar</button>
                </ModalFooter>
            </Modal>
        )
    }
}

export default cambiarConfiguracion;