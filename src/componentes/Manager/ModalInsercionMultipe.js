import Axios from 'axios';
import React, {Component} from 'react';
import { Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';

class ModalInsercionMultiple extends Component{

    state={
        base_requerimiento: {
            prioridad: '',
            categoria: '',
            id_template: '',
            id_usuario_responsable: ''
        },
        id_usuario: '',
        nombre_descriptivo: '',
        usuarios: [],
        templates: [],
        usuariosSubProyecto: [],
        errorInputUsuarioResponsable: '',
        errorInputPrioridad: '',
        errorInputCategoria: '',
        errorInputTemplate: '',
        errorNombreDescriptivo: ''
    }

    componentDidMount(){
        this.getUsuario();
        this.getUsuarios();
        this.getUsuariosSubproyecto();
        this.getTemplates();
    }

    getUsuarios=async()=>{
        const token = localStorage.getItem('token');
        await Axios.get(localStorage.getItem('url')+`/api/usuario/`,{headers: {"Authorization" : `Bearer ${token}`}})
        .then(response=>{
            this.setState({usuarios : response.data});
        });
    }

    getTemplates=async()=>{
        const token = localStorage.getItem('token');
        await Axios.get(localStorage.getItem('url')+'/api/template/',{headers: {"Authorization" : `Bearer ${token}`}})
        .then(response=>{
            this.setState({
                templates: response.data,
            });
        });
    }

    getUsuariosSubproyecto=async()=>{
        const token = localStorage.getItem('token');
        await Axios.get(localStorage.getItem('url')+`/api/encargadosubproyecto/obtener/${this.props.id_subProyecto}`,{headers: {"Authorization" : `Bearer ${token}`}})
        .then(response=>{
            this.setState({usuariosSubProyecto: response.data});
        });
    }

    getUsuario=async()=>{
        const token = localStorage.getItem('token');
        await Axios.get(localStorage.getItem('url')+`/api/usuario/${localStorage.getItem('email')}`,{headers: {"Authorization": `Bearer ${token}`}})
        .then(response=>{
            this.setState({id_usuario: response.data.id});
        });
    }

    obtenerNombreUsuario=(id_usuario)=>{
        if(this.state.usuarios.length !== 0){
            const usuarioEncontrado = this.state.usuarios.find(usuario => usuario.id === id_usuario);
            return usuarioEncontrado.nombre;    
        }
    }

    changeHandler=async(e)=>{
        await this.setState({
            base_requerimiento:{
                ...this.state.base_requerimiento, [e.target.name]: e.target.value
            }
        });
    }

    initErrores=()=>{
        this.setState({
            errorInputCategoria: '',
            errorInputPrioridad: '',
            errorInputUsuarioResponsable: '',
            errorInputTemplate:'',
            base_requerimiento: {
                id_usuario: '',
                prioridad: '',
                categoria: '',
                id_template: '',
                id_usuario_responsable: ''
            },
            nombre_descriptivo: '',
        });
    }

    validar=()=>{
        let salida= true;
        if(this.state.base_requerimiento.id_usuario_responsable === "" || this.state.base_requerimiento.id_usuario_responsable === undefined){
            this.setState({errorInputUsuarioResponsable : "Debe seleccionar un usuario."});
            salida = false;
        }
        if(this.state.base_requerimiento.prioridad === ""){
            this.setState({errorInputPrioridad : "Debe seleccionar una prioridad al requerimiento."});
            salida = false;
        }
        if(this.state.base_requerimiento.categoria === ""){
            this.setState({errorInputCategoria : "Debe seleccionar una categoria para el requerimiento."});
            salida = false;
        }
        if(this.state.base_requerimiento.id_template === ""){
            this.setState({errorInputTemplate : "Debe seleccionar una categoria para el requerimiento."});
            salida = false;
        }
        return salida;
    }

    siguiente=()=>{
        if(this.validar()){
            var pagina1 = document.getElementById("pagina1");
            var pagina2 = document.getElementById("pagina2");
            var botonSig = document.getElementById("botonSiguiente");
            var botonVolv = document.getElementById("botonVolver");
            var botonIns = document.getElementById("botonInsertar");
            pagina1.style.display = 'none';
            botonSig.style.display = 'none';
            pagina2.style.display = '';
            botonVolv.style.display = '';
            botonIns.style.display = '';
        }
    }

    anterior=()=>{
        var pagina1 = document.getElementById("pagina1");
        var pagina2 = document.getElementById("pagina2");
        var botonSig = document.getElementById("botonSiguiente");
        var botonVolv = document.getElementById("botonVolver");
        var botonIns = document.getElementById("botonInsertar");
        var exito = document.getElementById("span_insercion");
        pagina2.style.display = 'none';
        botonVolv.style.display = 'none';
        botonIns.style.display = 'none';
        exito.style.display = 'none';
        pagina1.style.display = '';
        botonSig.style.display = '';
    }

    insertar=async()=>{
        if(this.state.nombre_descriptivo === ""){
            this.setState({errorNombreDescriptivo: "Campo Vacío"});
        }else{
            var exito = document.getElementById("span_insercion");
            exito.style.display = '';

            const token = localStorage.getItem('token');
            await Axios.post(localStorage.getItem('url')+'/api/requerimiento/guardar/',{
                nombre_descriptivo: this.state.nombre_descriptivo,
                descripcion: '',
                id_usuario: this.state.base_requerimiento.id_usuario_responsable,
                id_subProyecto: this.props.id_subProyecto,
                fecha_creacion: new Date().toLocaleString(),
                prioridad: this.state.base_requerimiento.prioridad,
                estado: 'Propuesto',
                categoria: this.state.base_requerimiento.categoria,
                id_template: this.state.base_requerimiento.id_template
            }, {headers: {"Authorization" : `Bearer ${token}`}})
            .then(response=>{
                this.completarDatos(response.data);
            });
            this.setState({nombre_descriptivo: ''});
            this.props.funcionGetRequerimientos();
        }
    }

    desactivarAlerta=()=>{
        if(this.state.nombre_descriptivo===""){
            var exito = document.getElementById("span_insercion");
            exito.style.display = 'none';
        }
    }

    completarDatos=async(requerimiento)=>{
        const token = localStorage.getItem('token');
        await Axios.get(localStorage.getItem('url')+`/api/template/${requerimiento.id_template}`,{headers: {"Authorization" : `Bearer ${token}`}})
        .then(response=>{
            var req = requerimiento;
            req.nombre = requerimiento.categoria.concat(requerimiento.id_requerimiento);
            req.descripcion = response.data.template;
            this.ejecutarCompletacionDatos(req);
        });
        await Axios.post(localStorage.getItem('url')+'/api/usuarioactividad/guardar',{
            fecha: new Date().toLocaleString(),
            id_requerimiento: requerimiento.id_requerimiento,
            id_usuario: requerimiento.id_usuario
        },{headers: {"Authorization" : `Bearer ${token}`}});
    }

    ejecutarCompletacionDatos=async(requerimiento)=>{
        const token = localStorage.getItem('token');
        await Axios.post(localStorage.getItem('url')+'/api/requerimiento/editar/', requerimiento, {headers: {"Authorization" : `Bearer ${token}`}})
        .then(response=>{
            this.props.getUsuarios();
            this.props.getDataUsuarioActividad();
            this.props.funcionGetRequerimientos();
        });
    }

    render(){
        return(
            <React.Fragment>
                <Modal isOpen={this.props.estadoModalInsertar} toggle={()=>{this.props.modalInsertar();this.initErrores()}}>

                    <ModalHeader style={{display:'block'}}>
                        <span>Ingresar Requerimiento</span>
                        <span style={{cursor:'pointer', float:'right'}} onClick={()=>{this.props.modalInsertar();this.initErrores()}}>X</span>
                    </ModalHeader>

                    <ModalBody>
                        <div className="form-group" id="pagina1">                       
                            <label htmlFor="id_usuario_responsable">Usuario Responsable</label>
                            <select className={(this.state.errorInputUsuarioResponsable)? "form-control is-invalid" : "form-control"} type="text" name="id_usuario_responsable" id="id_usuario_responsable" value={this.state.base_requerimiento.id_usuario_responsable} onChange={this.changeHandler} onClick={() => {this.setState({errorInputUsuarioResponsable : ''})}}>
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
                            <select className={(this.state.errorInputPrioridad)? "form-control is-invalid" : "form-control"} name="prioridad" id="prioridad" value={this.state.base_requerimiento.prioridad} onChange={this.changeHandler} onClick={() => {this.setState({errorInputPrioridad : ''})}}>
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
                            <select className={(this.state.errorInputCategoria)? "form-control is-invalid" : "form-control"} name="categoria" id="categoria" value={this.state.base_requerimiento.categoria} onChange={this.changeHandler} onClick={() => {this.setState({errorInputCategoria : ''})}}>
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
                            <select className={(this.state.errorInputTemplate)? "form-control is-invalid" : "form-control"} name="id_template" id="id_template" value={this.state.base_requerimiento.id_template} onChange={this.changeHandler} onClick={() => {this.setState({errorInputTemplate : ''})}}>
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

                        <div className="form-group" id="pagina2" style={{display:'none'}}>
                            <label htmlFor="nombre_descriptivo">Descripcion</label>
                            <input className={(this.state.errorNombreDescriptivo)? "form-control is-invalid" : "form-control"} type="text" name="nombre_descriptivo" id="nombre_descriptivo" value={this.state.nombre_descriptivo} onChange={(e)=>{this.setState({nombre_descriptivo: e.target.value})}} onClick={()=>{this.setState({errorNombreDescriptivo : ''});this.desactivarAlerta();}}/>
                            <div class="invalid-feedback" style={{display: 'block'}}>
                                {this.state.errorNombreDescriptivo}
                            </div>
                            <p id="span_insercion" style={{float:'left',display:'none'}}><span style={{color: 'green'}}>¡inserción exitosa!</span></p>
                        </div>

                    </ModalBody>
                    <ModalFooter>
                        <button className="btn btn-danger" onClick={()=>{this.props.modalInsertar();this.initErrores()}}>Cancelar</button>
                        <button id="botonSiguiente" className="btn btn-primary" onClick={()=>this.siguiente()}>Siguiente</button>
                        <button id="botonVolver" className="btn btn-primary" style={{display:'none'}} onClick={()=>this.anterior()}>Volver</button>
                        <button id="botonInsertar" className="btn btn-success" style={{display:'none'}} onClick={()=>this.insertar()}>Insertar</button>
                    </ModalFooter>
                </Modal>
            </React.Fragment>
        )
    }
}

export default ModalInsercionMultiple;