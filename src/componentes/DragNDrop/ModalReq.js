import React, {Component} from 'react';
import { Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import Axios from 'axios';

class ModalReq extends Component{
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
            estado: 'Propuesto',
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
        Axios.get(localStorage.getItem("url")+'/api/template/',{headers: {"Authorization" : `Bearer ${token}`}})
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
        Axios.get(localStorage.getItem("url")+`/api/usuario/`,{headers: {"Authorization" : `Bearer ${token}`}})
        .then(response=>{
            this.setState({usuarios : response.data});
        })
    }

    getUsuariosSubProyecto=async()=>{
        const token = localStorage.getItem('token');
        await Axios.get(localStorage.getItem("url")+`/api/encargadosubproyecto/obtener/${this.props.id_subProyecto}`,{headers: {"Authorization" : `Bearer ${token}`}})
        .then(response=>{
            this.setState({usuariosSubProyecto: response.data});
        });
        this.getLiderJefe();
    }

    getLiderJefe = async () => {
        const token = localStorage.getItem('token');
        var id_jefe;
        var id_lider;
        
        await Axios.get(localStorage.getItem('url')+`/api/subProyecto/${this.props.id_subProyecto}`,{headers: {"Authorization" : `Bearer ${token}`}})
        .then(async response => {
            id_lider = response.data.id_usuario;
            await Axios.get(localStorage.getItem('url')+`/api/proyecto/${response.data.id_proyecto}`,{headers: {"Authorization" : `Bearer ${token}`}})
            .then(response2 => {
                id_jefe = response2.data.id_usuario;
            })
        });

        var ultimoUsuario = this.state.usuariosSubProyecto[this.state.usuariosSubProyecto.length-1];
        var usuarioJefe = {id_encargadoSubProyecto: ultimoUsuario.id_encargadoSubProyecto+1, id_subProyecto: ultimoUsuario.id_subProyecto, id_usuario: id_jefe};
        var usuarioLider = {id_encargadoSubProyecto: ultimoUsuario.id_encargadoSubProyecto+2, id_subProyecto: ultimoUsuario.id_subProyecto, id_usuario: id_lider};

        var copiaUsuarios = [...this.state.usuariosSubProyecto];
        copiaUsuarios.push(usuarioLider);
        copiaUsuarios.push(usuarioJefe);
        this.setState({usuariosSubProyecto: copiaUsuarios});
    }

    getUser=async()=>{
        const token = localStorage.getItem('token');
        await Axios.get(localStorage.getItem("url")+`/api/usuario/${localStorage.getItem('email')}`,{headers: {"Authorization": `Bearer ${token}`}})
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

    guardar=async()=>{
        const token = localStorage.getItem('token');
        if(this.validar()){
            await Axios.post(localStorage.getItem("url")+'/api/requerimiento/guardar/',{
                nombre_descriptivo: this.state.requerimiento.nombre_descriptivo,
                descripcion: this.state.requerimiento.descripcion,
                id_usuario: this.state.requerimiento.id_usuario,
                id_subProyecto: this.props.id_subProyecto,
                fecha_creacion: new Date().toLocaleString(),
                prioridad: this.state.requerimiento.prioridad,
                estado: 'Propuesto',
                categoria: this.state.requerimiento.categoria,
                id_template: this.state.requerimiento.id_template
            }, {headers: {"Authorization" : `Bearer ${token}`}})
            .then(response=>{
                this.completarDatos(response.data);
            });
            this.initErrores();
        }
    }

    completarDatos=async(requerimiento)=>{
        const token = localStorage.getItem('token');
        await Axios.get(localStorage.getItem("url")+`/api/template/${requerimiento.id_template}`,{headers: {"Authorization" : `Bearer ${token}`}})
        .then(response=>{
            var req = requerimiento;
            req.nombre = requerimiento.categoria.concat(requerimiento.id_requerimiento);
            req.descripcion = response.data.template;
            this.ejecutarCompletacionDatos(req);
        });
        await Axios.post(localStorage.getItem("url")+'/api/usuarioactividad/guardar',{
            fecha: new Date().toLocaleString(),
            id_requerimiento: requerimiento.id_requerimiento,
            id_usuario: this.state.id_usuario_responsable
        },{headers: {"Authorization" : `Bearer ${token}`}});
    }

    ejecutarCompletacionDatos=async(req)=>{
        const token = localStorage.getItem('token');
        await Axios.post(localStorage.getItem("url")+'/api/requerimiento/editar/', req, {headers: {"Authorization" : `Bearer ${token}`}})
        .then(response=>{
            this.props.begin();
            this.props.modalInsertar();
        })
    }

    componentWillReceiveProps(next_props){
        this.setState({requerimiento: this.props.requerimiento, id_usuario_responsable: ''});
    }

    render(){
        return(
            <React.Fragment>
                <Modal isOpen={this.props.estadoModalInsertar} toggle={()=>{this.props.modalInsertar();this.initErrores();}}>
                    <ModalHeader style={{display:'block'}}>
                        <span>Ingresar Requerimiento</span>
                        <span style={{cursor:'pointer', float:'right'}} onClick={()=>{this.props.modalInsertar();this.initErrores();}}>X</span>
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
                                {this.state.usuariosSubProyecto.reverse().map(usuario => {
                                    const usuarioEncontrado = this.state.usuarios.find(posibleUsuario => posibleUsuario.id === usuario.id_usuario); 
                                    if(usuarioEncontrado !== undefined){
                                        if(usuarioEncontrado.tipo !== "cliente" && usuarioEncontrado.estado === 'Activo')
                                            return(
                                                <option value={usuario.id_usuario}>{this.obtenerNombreUsuario(usuario.id_usuario)+" - "+usuarioEncontrado.tipo.toUpperCase()}</option>
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
                        <button className="btn btn-success" onClick={()=>this.guardar()}>
                            Insertar
                        </button>
                        <button className="btn btn-danger" onClick={()=>{this.props.modalInsertar();this.initErrores();}}>Cancelar</button>
                    </ModalFooter>
                </Modal>
                
            </React.Fragment>
        )
    }

}

export default ModalReq;