import Axios from 'axios';
import React, { Component } from 'react'
import { Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';

class RequerimientoModal extends Component{
    state={
        requerimiento:{
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
        templates : [],
        usuarios: [],
        usuariosSubProyecto: [],
        id_usuario_responsable : ''
    }

    componentDidMount(){
        const token = localStorage.getItem('token');

        Axios.get('http://localhost:8080/api/template/',{headers: {"Authorization" : `Bearer ${token}`}})
        .then(response=>{
            this.setState({
                templates: response.data
            });
        })
        this.getUsuarios();
        this.getUsuariosSubProyecto();
    }

    componentWillReceiveProps(next_props){
        this.setState({requerimiento: this.props.requerimiento});
        const token = localStorage.getItem("token");
        if(this.props.requerimiento.id_requerimiento !== undefined){
            Axios.get('http://localhost:8080/api/usuarioactividad/id_requerimiento/'+this.props.requerimiento.id_requerimiento,{headers: {"Authorization" : `Bearer ${token}`}})
            .then(response=>{
                this.setState({
                    id_usuario_responsable : response.data.id_usuario
                });
            })
            .catch(console.log("error"));
        }

    }

    guardar=async()=>{
        const token = localStorage.getItem('token');
        await Axios.post('http://localhost:8080/api/requerimiento/guardar/',{
            descripcion: this.state.requerimiento.descripcion,
            id_usuario: this.state.requerimiento.id_usuario,
            id_subProyecto: this.state.requerimiento.id_subProyecto,
            fecha_creacion: new Date().toLocaleString(),
            prioridad: this.state.requerimiento.prioridad,
            estado: this.state.requerimiento.estado,
            categoria: this.state.requerimiento.categoria,
            id_template: this.state.requerimiento.id_template
        }, {headers: {"Authorization" : `Bearer ${token}`}})
        .then(response=>{
            this.completarDatos(response.data);
        });
    }

    completarDatos=(requerimiento)=>{
        const token = localStorage.getItem('token');

        Axios.get(`http://localhost:8080/api/template/${requerimiento.id_template}`,{headers: {"Authorization" : `Bearer ${token}`}})
        .then(response=>{
            var req = requerimiento;
            req.nombre = requerimiento.categoria.concat(requerimiento.id_requerimiento);
            req.descripcion = response.data.template;
            this.ejecutarCompletacionDatos(req);
        });
        
        Axios.post('http://localhost:8080/api/usuarioactividad/guardar',{
            fecha: new Date().toLocaleString(),
            id_requerimiento: requerimiento.id_requerimiento,
            id_usuario: this.state.id_usuario_responsable
        },{headers: {"Authorization" : `Bearer ${token}`}})
    }

    ejecutarCompletacionDatos=(req)=>{
        const token = localStorage.getItem('token');
        Axios.post('http://localhost:8080/api/requerimiento/editar/', req, {headers: {"Authorization" : `Bearer ${token}`}})
        .then(response=>{
            this.props.modalInsertar();
            this.props.index();
        })
    }

    guardarActualizacion=()=>{
        const actual = this.state.requerimiento;
        actual.nombre = actual.categoria.concat(actual.id_requerimiento);
        const token = localStorage.getItem('token');
        Axios.get('http://localhost:8080/api/usuarioactividad/id_requerimiento/'+ actual.id_requerimiento, {headers: {"Authorization" : `Bearer ${token}`}})
        .then(response => {
            console.log(response.data);
            Axios.post('http://localhost:8080/api/usuarioactividad/guardar',{
                id_usuarioActividad: response.data.id_usuarioActividad,
                fecha: response.data.fecha,
                id_requerimiento: actual.id_requerimiento,
                id_usuario: this.state.id_usuario_responsable
            }, {headers: {"Authorization" : `Bearer ${token}`}})
            console.log(response.data)
        })
        
        Axios.post('http://localhost:8080/api/requerimiento/editar/',actual, {headers: {"Authorization" : `Bearer ${token}`}})
        .then(response=>{
            this.props.modalInsertar();
            this.props.index();
        })
    }

    getUsuarios=()=>{
        const token = localStorage.getItem('token');
        Axios.get(`http://localhost:8080/api/usuario/`,{headers: {"Authorization" : `Bearer ${token}`}})
        .then(response=>{
            this.setState({usuarios : response.data});
            console.log(response.data);
        })
    }

    getUsuariosSubProyecto= async ()=>{
        const token = localStorage.getItem('token');
        await Axios.get(`http://localhost:8080/api/encargadosubproyecto/obtener/${this.props.requerimiento.id_subProyecto}`,{headers: {"Authorization" : `Bearer ${token}`}})
        .then(response=>{
            this.setState({usuariosSubProyecto: response.data})
        })
    }

    obtenerNombreUsuario = (id_usuario) => {
        console.log(this.state.usuarios)
        if(this.state.usuarios.length !== 0){
            const usuarioEncontrado = this.state.usuarios.find(usuario => usuario.id === id_usuario);
            return usuarioEncontrado.nombre;    
        }
    }

    changeHandler=async(e)=>{
        await this.setState({
            requerimiento:{
                ...this.state.requerimiento, [e.target.name]: e.target.value
            }
        });
    }

    render(){
        return(
            <React.Fragment>
                <Modal isOpen={this.props.estadoModalInsertar} toggle={()=>this.props.modalInsertar()}>
                    <ModalHeader style={{display:'block'}}>
                        <span style={{cursor:'pointer', float:'right'}} onClick={()=>this.props.modalInsertar()}>X</span>
                    </ModalHeader>
                    <ModalBody>
                        <div className="form-group">
                            <label htmlFor="id_requerimiento">ID</label>
                            <input className="form-control" type="text" name="id_requerimiento" id="id_requerimiento" value={this.state.requerimiento.id_requerimiento} readOnly/>
                            <br/>
                            <label htmlFor="nombre">Nombre</label>
                            <input className="form-control" type="text" name="nombre" id="nombre" value={this.state.requerimiento.nombre} readOnly/>
                            <br/>
                            <label htmlFor="id_usuario">ID Usuario</label>
                            <input className="form-control" type="text" name="id_usuario" id="id_usuario" value={this.state.requerimiento.id_usuario} readOnly/>
                            <br/>
                            <label htmlFor="id_subProyecto">ID Sub-Proyecto</label>
                            <input className="form-control" type="text" name="id_subProyecto" id="id_subProyecto" value={this.state.requerimiento.id_subProyecto} readOnly />
                            <br/>
                            <label htmlFor="id_responsable">Usuario Responsable</label>
                            <select className="form-control" type="text" name="id_usuario_responsable" id="id_usuario_responsable" value={this.state.id_usuario_responsable} onChange={(e) => {this.setState({id_usuario_responsable : e.target.value})}}>
                                <option value="">Seleccionar Usuario Responsable</option>
                                {this.state.usuariosSubProyecto.map(usuario => {
                                    return(
                                        <option value={usuario.id_usuario}>{this.obtenerNombreUsuario(usuario.id_usuario)}</option>
                                    );
                                    
                                })}
                            </select>
                            <br/>
                            <label htmlFor="prioridad">Prioridad</label>
                            <select className="form-control" name="prioridad" id="prioridad" value={this.state.requerimiento.prioridad} onChange={this.changeHandler}>
                                <option value="Baja">Baja</option>
                                <option value="Media">Media</option>
                                <option value="Alta">Alta</option>
                            </select>
                            <br/>
                            <label htmlFor="estado">Estado</label><br/>
                            <select className="form-control" name="estado" id="estado" value={this.state.requerimiento.estado} onChange={this.changeHandler}>
                                <option value="Creado">Creado</option>
                                <option value="En Redaccion">En Redaccion</option>
                                <option value="Aprobado">Aprobado</option>
                            </select>
                            <br/>
                            <label htmlFor="categoria">Categoría</label>
                            <select className="form-control" name="categoria" id="categoria" value={this.state.requerimiento.categoria} onChange={this.changeHandler}>
                                <option value="">Seleccione una categoría</option>
                                <option value="RUSA">Requerimiento Analista</option>
                                <option value="RUSL">Requerimiento Lider de subproyecto</option>
                                <option value="RUSJ">Requerimiento Jefe de proyecto</option>
                                <option value="RUSC">Requerimiento Cliente</option>
                                <option value="RUSS">Requerimiento Administrador</option>
                                <option value="REQF">Requerimiento Funcional</option>
                                <option value="RENF">Requerimiento No Funcional</option>
                            </select>
                            <br/>
                            <label htmlFor="id_template">ID Template</label>
                            <select className="form-control" name="id_template" id="id_template" value={this.state.requerimiento.id_template} onChange={this.changeHandler}>
                                <option value="">Seleccione un Template</option>
                                {this.state.templates.map(template=>{
                                    return(
                                        <option value={template.id_template}>{template.nombre}</option>
                                    )
                                })}
                            </select>
                            <br/>
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

export default RequerimientoModal;