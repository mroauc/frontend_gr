import React, {Component} from 'react';
import { Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import Axios from 'axios';

class ModalReqSelected extends Component{
    state={
        requerimiento:{
            id_requerimiento: 0,
            nombre: '',
            nombre_descriptivo: '',
            descripcion: '',
            id_usuario: '',
            id_subProyecto: this.props.id_subProyecto,
            fecha_creacion: '',
            prioridad: '',
            estado: 'Creado',
            categoria: '',
            id_template: ''
        },
        id_usuario_responsable : '',
        template_actual : '',
        templates : [],
        usuarios: [],
        usuariosSubProyecto: [],

        errorNombreDescriptivo: '',
        errorInputUsuarioResponsable: '',
        errorInputPrioridad: '',
        errorInputCategoria: '',
        errorInputTemplate: ''
    }

    componentDidMount(){
        const token = localStorage.getItem('token');
        Axios.get('http://localhost:8080/api/template/',{headers: {"Authorization" : `Bearer ${token}`}})
        .then(response=>{
            this.setState({
                templates: response.data,
            });
        })
        this.getUsuarios();
        this.getUsuariosSubProyecto();
        this.getUser();
    }

    getUsuarios=()=>{
        const token = localStorage.getItem('token');
        Axios.get(`http://localhost:8080/api/usuario/`,{headers: {"Authorization" : `Bearer ${token}`}})
        .then(response=>{
            this.setState({usuarios : response.data});
        })
    }

    getUsuariosSubProyecto=async()=>{
        const token = localStorage.getItem('token');
        await Axios.get(`http://localhost:8080/api/encargadosubproyecto/obtener/${this.props.id_subProyecto}`,{headers: {"Authorization" : `Bearer ${token}`}})
        .then(response=>{
            this.setState({usuariosSubProyecto: response.data});
        });
    }

    getUser=async()=>{
        const token = localStorage.getItem('token');
        await Axios.get(`http://localhost:8080/api/usuario/${localStorage.getItem('email')}`,{headers: {"Authorization": `Bearer ${token}`}})
        .then(response=>{
            var dataold = this.state.requerimiento;
            dataold.id_usuario = response.data.id;
            this.setState({requerimiento: dataold});
        })
    }

    changeHandler=async(e)=>{
        await this.setState({
            requerimiento:{
                ...this.state.requerimiento, [e.target.name]: e.target.value
            }
        });
    }

    validar=()=>{
        let salida= true;
        
        if(this.state.id_usuario_responsable === "" || this.state.id_usuario_responsable === undefined){
            this.setState({errorInputUsuarioResponsable : "Debe seleccionar un usuario."});
            salida = false;
        }
        if(this.state.requerimiento.prioridad === ""){
            this.setState({errorInputPrioridad : "Debe seleccionar una prioridad al requerimiento."});
            salida = false;
        }
        if(this.state.requerimiento.categoria === ""){
            this.setState({errorInputCategoria : "Debe seleccionar una categoria para el requerimiento."});
            salida = false;
        }
        if(this.state.requerimiento.id_template === ""){
            this.setState({errorInputTemplate : "Debe seleccionar una categoria para el requerimiento."});
            salida = false;
        }
        if(this.state.requerimiento.nombre_descriptivo === ""){
            this.setState({errorNombreDescriptivo: "Campo Vacío"});
            salida = false;
        }

        return salida;
    }

    obtenerNombreUsuario=(id_usuario)=>{
        if(this.state.usuarios.length !== 0){
            const usuarioEncontrado = this.state.usuarios.find(usuario => usuario.id === id_usuario);
            return usuarioEncontrado.nombre;    
        }
    }

    initErrores=()=>{
        this.setState({
            errorNombreDescriptivo: '',
            errorInputCategoria: '',
            errorInputPrioridad: '',
            errorInputUsuarioResponsable: '',
            errorInputTemplate:''
        })
    }

    componentWillReceiveProps(next_props){
        const token = localStorage.getItem('token');
        this.setState({requerimiento: this.props.requerimiento, template_actual: this.props.requerimiento.id_template});
        Axios.get(`http://localhost:8080/api/usuarioactividad/id_requerimiento/${this.props.requerimiento.id_requerimiento}`, {headers: {"Authorization" : `Bearer ${token}`}})
        .then(response=>{
            this.setState({id_usuario_responsable: response.data.id_usuario})
        })
    }

    actualizar=async()=>{
        if(this.validar()){
            const token = localStorage.getItem('token');
            var actual = this.state.requerimiento;
            actual.nombre = actual.categoria.concat(actual.id_requerimiento);

            Axios.get('http://localhost:8080/api/usuarioactividad/id_requerimiento/'+ actual.id_requerimiento, {headers: {"Authorization" : `Bearer ${token}`}})
            .then(response => {
                Axios.post('http://localhost:8080/api/usuarioactividad/guardar',{
                    id_usuarioActividad: response.data.id_usuarioActividad,
                    fecha: response.data.fecha,
                    id_requerimiento: actual.id_requerimiento,
                    id_usuario: this.state.id_usuario_responsable
                }, {headers: {"Authorization" : `Bearer ${token}`}})
            })

            if(this.state.template_actual !== this.state.requerimiento.id_template){
                await Axios.get(`http://localhost:8080/api/template/${this.state.requerimiento.id_template}`,{headers: {"Authorization" : `Bearer ${token}`}})
                .then(response=>{
                    actual.descripcion = response.data.template;
                });
            }

            Axios.post('http://localhost:8080/api/requerimiento/editar/',actual, {headers: {"Authorization" : `Bearer ${token}`}})
            .then(response=>{
                this.props.modalEditar();
                this.props.begin();
            })
            this.initErrores();
        }
    }

    render(){
        return(
            <React.Fragment>
                <Modal isOpen={this.props.estadoModalEditar} toggle={()=>{this.props.modalEditar();this.initErrores();}}>
                    <ModalHeader style={{display:'block'}}>
                        <span>Editar Requerimiento</span>
                        <span style={{cursor:'pointer', float:'right'}} onClick={()=>{this.props.modalEditar();this.initErrores();}}>X</span>
                    </ModalHeader>
                    <ModalBody>
                        <div className="form-group">
                            <label htmlFor="nombre_descriptivo">Descripcion</label>
                            <input className={(this.state.errorNombreDescriptivo)? "form-control is-invalid" : "form-control"} type="text" name="nombre_descriptivo" id="nombre_descriptivo" value={this.state.requerimiento.nombre_descriptivo} onChange={this.changeHandler} onClick={() => {this.setState({errorNombreDescriptivo : ''})}}/>
                            <div class="invalid-feedback" style={{display: 'block'}}>
                                {this.state.errorNombreDescriptivo}
                            </div>
                            <br/>                
                            <label htmlFor="id_responsable">Usuario Responsable</label>
                            <select className={(this.state.errorInputUsuarioResponsable)? "form-control is-invalid" : "form-control"} type="text" name="id_usuario_responsable" id="id_usuario_responsable" value={this.state.id_usuario_responsable} onChange={(e) => {this.setState({id_usuario_responsable : e.target.value})}} onClick={() => {this.setState({errorInputUsuarioResponsable : ''})}}>
                                <option value="">Seleccionar Usuario Responsable</option>
                                {this.state.usuariosSubProyecto.map(usuario => {
                                    const usuarioEncontrado = this.state.usuarios.find(posibleUsuario => posibleUsuario.id === usuario.id_usuario); 
                                    if(usuarioEncontrado !== undefined){
                                        if(usuarioEncontrado.tipo !== "cliente" && usuarioEncontrado.estado === 'Activo')
                                            return(
                                                <option value={usuario.id_usuario}>{this.obtenerNombreUsuario(usuario.id_usuario)}</option>
                                        );
                                    }
                                })}
                            </select>
                            <div class="invalid-feedback" style={{display: 'block'}}>
                                {this.state.errorInputUsuarioResponsable}
                            </div>
                            <br/>
                            <label htmlFor="prioridad">Prioridad</label>
                            <select className={(this.state.errorInputPrioridad)? "form-control is-invalid" : "form-control"} name="prioridad" id="prioridad" value={this.state.requerimiento.prioridad} onChange={this.changeHandler} onClick={() => {this.setState({errorInputPrioridad : ''})}}>
                                <option value="" selected>Seleccione una prioridad</option>
                                <option value="Baja">Baja</option>
                                <option value="Media">Media</option>
                                <option value="Alta">Alta</option>
                            </select>
                            <div class="invalid-feedback" style={{display: 'block'}}>
                                {this.state.errorInputPrioridad}
                            </div>
                            <br/>
                            <label htmlFor="categoria">Categoría</label>
                            <select className={(this.state.errorInputCategoria)? "form-control is-invalid" : "form-control"} name="categoria" id="categoria" value={this.state.requerimiento.categoria} onChange={this.changeHandler} onClick={() => {this.setState({errorInputCategoria : ''})}}>
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
                            <label htmlFor="id_template">ID Template</label>
                            <select className={(this.state.errorInputTemplate)? "form-control is-invalid" : "form-control"} name="id_template" id="id_template" value={this.state.requerimiento.id_template} onChange={this.changeHandler} onClick={() => {this.setState({errorInputTemplate : ''})}}>
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
                        <button className="btn btn-success" onClick={()=>this.actualizar()}>
                            Actualizar
                        </button>
                        <button className="btn btn-danger" onClick={()=>{this.props.modalEditar();this.initErrores();}}>Cancelar</button>
                    </ModalFooter>
                </Modal>
                
            </React.Fragment>
        );
    }
}

export default ModalReqSelected;