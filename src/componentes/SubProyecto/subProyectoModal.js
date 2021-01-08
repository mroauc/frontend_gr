import Axios from 'axios';
import axios from 'axios';
import React, { Component } from 'react'
import { Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import ChipsSubProyectoUsuario from './ChipsSubProyectoUsuario';
import SeleccionLider from './SeleccionLider/SeleccionLider'

const url="http://localhost:8080/api/subProyecto/";
let nombre_usuario = "";

export default class subProyectoModal extends Component {
    
    state ={
        subProyecto: {
            id_subProyecto : 0,
            nombre_subProyecto :'',
            fecha_inicio : new Date().toLocaleDateString('fr-CA'),
            fecha_fin : '',
            id_proyecto : '',
            tipo_subProyecto : '',
            id_usuario : ''
        },
        usuarios: [],
        lideres_subProyectos : [],
        usuariosSeleccionados : [],
        clientes: [],
        msj_nombre_subp: "",
        msj_fechaInicio: "",
        msj_tipo_subp: "",
        msj_lider_subp: "",
        estadoModal: false
    }

    componentDidMount(){
        this.getUsuarios();
        this.getLideres();
        this.getClientes();
    }

    componentWillReceiveProps(next_props) {
        this.setState({subProyecto: this.props.subProyecto});
    }

    validar=()=>{
        let salida = true;
        if(!this.state.subProyecto.nombre_subProyecto){
            this.setState({
                msj_nombre_subp: "Campo Vacio"
            });
            salida=false;
        }
        if(!this.state.subProyecto.fecha_inicio){
            this.setState({
                msj_fechaInicio: "Campo Vacio"
            });
            salida=false;
        }
  
        if(!this.state.usuariosSeleccionados){
            salida=false;
        }
        if(!this.state.subProyecto.id_usuario){
            this.setState({
                msj_lider_subp: "Campo Vacio"
            });
            salida=false;
        }
        return salida;
    }

    cambiarEstadoAbrir = () => {
        this.setState({estadoModal : !this.state.estadoModal})
    }

    guardarSubproyecto=async(subProyecto)=>{
        if(this.validar()){
            const token = localStorage.getItem('token');
            var urlGuardar = url + 'guardar';
            await axios.post(urlGuardar, subProyecto,{headers: {"Authorization": `Bearer  ${token}`}})
            .then(response => {
                if(this.props.estadoEditar){
                    this.props.cambiarEstadoEditar();
                    this.guardarActualizacion(response.data.id_subProyecto);
                }
                else{
                    this.insertar_usuariosSubProyecto(response.data.id_subProyecto);
                    this.props.cambiarEstadoInsertar();
                }
                this.props.getSubProyectos();
                this.setState({
                    msj_nombre_subp: "",
                    msj_fechaInicio: "",
                    msj_tipo_subp: "",
                    msj_lider_subp: ""
                });
            })
            .catch(error => {
                console.log(error)
            })
        }
    }

    guardarActualizacion=(id_subProyecto)=>{
        if(this.validar()){
            var existentes = [];
            var original = [];
            const token = localStorage.getItem('token');
            Axios.get(`http://localhost:8080/api/encargadosubproyecto/obtener/${id_subProyecto}`,{headers: {"Authorization": `Bearer ${token}`}})
            .then(response=>{
                original = response.data;
                for (let index = 0; index < original.length; index++) {
                    existentes = [...existentes, response.data[index].id_usuario.toString()];
                }

                //eliminar
                for (let index = 0; index < existentes.length; index++) {
                    if(!this.state.usuariosSeleccionados.includes(existentes[index])){
                        Axios.delete(`http://localhost:8080/api/encargadosubproyecto/eliminar/${original[index].id_encargadoSubProyecto}`,{headers: {"Authorization": `Bearer ${token}`}})
                        .then(response=>{
                        });
                    }
                }

                //agregar
                for (let index = 0; index < this.state.usuariosSeleccionados.length; index++) {
                    if(!existentes.includes(this.state.usuariosSeleccionados[index])){
                        Axios.post("http://localhost:8080/api/encargadosubproyecto/guardar",{
                            id_subProyecto: id_subProyecto,
                            id_usuario: this.state.usuariosSeleccionados[index],
                        }, {headers: {"Authorization": `Bearer ${token}`}})
                    }
                }

                this.setState({
                    msj_nombre_subp: "",
                    msj_fechaInicio: "",
                    msj_tipo_subp: "",
                    msj_lider_subp: ""
                });
            })
        }
    }

    getUsuarios = async () => {
        const token = localStorage.getItem('token');
        await axios.get("http://localhost:8080/api/usuario/",{headers: {"Authorization": `Bearer  ${token}`}}).then(response=>{
            this.setState({
                usuarios: response.data
            })
        });
    }

    buscarNombreUsuario = () => {
        if(this.state.subProyecto.id_usuario === 0) {
            nombre_usuario = "Seleccione Lider de Módulo";
        }
        else{
            let usuarioEncontrado = this.state.usuarios.find(usuario => usuario.id === this.state.subProyecto.id_usuario);
            if(usuarioEncontrado !== undefined)
                nombre_usuario = usuarioEncontrado.nombre;
        }
    } 

    insertarChip=(usuario)=>{
        this.setState({
            usuariosSeleccionados: [ ...this.state.usuariosSeleccionados, usuario],
        });
    }

    eliminarChip=(usuario)=>{
        const filtrado = this.state.usuariosSeleccionados.filter(item => item!==usuario);
        this.setState({
            usuariosSeleccionados : filtrado
        });
    }

    insertar_usuariosSubProyecto = async (id_subProyecto) => {
        const token = localStorage.getItem('token');
        for (let i = 0; i < this.state.usuariosSeleccionados.length; i++) {
            await axios.post("http://localhost:8080/api/encargadosubproyecto/guardar",{id_subProyecto: id_subProyecto, id_usuario: this.state.usuariosSeleccionados[i]},{headers: {"Authorization": `Bearer  ${token}`}})        
        }
    }

    cambiarLider = (id_nuevo_lider) => {
        let copiaSubProyecto = {...this.state.subProyecto};
        copiaSubProyecto.id_usuario = id_nuevo_lider;
        this.setState({subProyecto : copiaSubProyecto});
    }

    cerrarModal = () => {
        (this.props.estadoInsertar) ? this.props.cambiarEstadoInsertar() : this.props.cambiarEstadoEditar(); 
        this.setState({
            usuariosSeleccionados: [],
            msj_nombre_subp: "",
            msj_fechaInicio: "",
            msj_tipo_subp: "",
            msj_lider_subp: ""
        });
        nombre_usuario="";
    }

    getLideres = async () => {
        const token = localStorage.getItem('token');
        await Axios.get('http://localhost:8080/api/usuario/',{headers: {"Authorization": `Bearer ${token}`}})
        .then(response=>{
            this.setState({
                lideres_subProyectos: response.data.filter(usuario => usuario.tipo === "lider" && usuario.estado === "Activo")
            });
        });
    }

    getClientes = async () => {
        const token = localStorage.getItem('token');
        await Axios.get(`http://localhost:8080/api/cliente/id_proyecto/${this.props.id_proyecto}`,{headers: {"Authorization": `Bearer ${token}`}})
        .then(response=>{
            this.setState({
                clientes : response.data
            });
        });
    }

    changeHandler = async (e) => {
        await this.setState({
            subProyecto : {
              ...this.state.subProyecto, [e.target.name]: e.target.value
            }
        });
    }
    
    render(){
        this.buscarNombreUsuario();
        return(
            <React.Fragment>
                <Modal isOpen = {this.props.estadoInsertar || this.props.estadoEditar} toggle= {this.cerrarModal} >
                    <ModalHeader style={{display : 'block'}}>
                        <span>{(this.props.estadoInsertar) ? 'Ingresar Módulo' :'Editar Módulo'}</span>
                        <span style={{cursor : 'pointer' , float : 'right'}} onClick={this.cerrarModal}>X</span>
                    </ModalHeader>
                    <ModalBody>
                        <div className="form-group">
                            <label htmlFor="subProyecto">Módulo</label>
                            <input className={ (this.state.msj_nombre_subp)? "form-control is-invalid" : "form-control"} type="text" name="nombre_subProyecto" id="nombre_subProyecto" onChange={this.changeHandler} value={this.state.subProyecto.nombre_subProyecto} onClick={()=>{this.setState({msj_nombre_subp: ""})}} />
                            <div className="invalid-feedback">
                                {this.state.msj_nombre_subp}
                            </div>
                            <br/>
                            <ChipsSubProyectoUsuario
                                tipo="Clientes"
                                usuarios = {this.state.clientes}
                                ingresarChip = {this.insertarChip}
                                eliminarChip = {this.eliminarChip}
                                id_subProyecto = {this.state.subProyecto.id_subProyecto}
                            />
                            <br/>
                            <ChipsSubProyectoUsuario
                                tipo="Analistas"
                                usuarios = {this.state.usuarios.filter(usuario => usuario.tipo === "analista")}
                                ingresarChip = {this.insertarChip}
                                eliminarChip = {this.eliminarChip}
                                id_subProyecto = {this.state.subProyecto.id_subProyecto}
                            />
                            <br/>
                            <label htmlFor="fecha_inicio">Fecha Inicio</label>
                            <input className={ (this.state.msj_fechaInicio)? "form-control is-invalid" : "form-control"} type="date" name="fecha_inicio" id="fecha_inicio" onChange={this.changeHandler} value={this.state.subProyecto.fecha_inicio} onClick={()=>{this.setState({msj_fechaInicio: ""})}} />
                            <div className="invalid-feedback">
                                {this.state.msj_fechaInicio}
                            </div>
                            <br/>
                            <label htmlFor="id_usuario">Fecha Termino</label>
                            <input className="form-control" type="date" name="fecha_fin" id="fecha_fin" onChange={this.changeHandler} value={this.state.subProyecto.fecha_fin}/>
                            <br/>
                            <label htmlFor="id_proyecto">Lider de Módulo</label>
                            <div style={{display:'flex', alignItems:'center'}}>
                                <input className="form-control" type="text" style={{width:'75%', display:'inline', marginRight:'5px', backgroundColor:'#fff'}} name="id_usuario" id="id_usuario" value={nombre_usuario} disabled/>
                                <button className="btn btn-primary" style={{width:'25%', display:'inline'}} onClick={this.cambiarEstadoAbrir}>Elegir Lider</button>
                            </div>
                            <SeleccionLider
                                usuariosLider = {this.state.lideres_subProyectos}
                                abrir = {this.state.estadoModal}
                                cambiarEstadoAbrir = {this.cambiarEstadoAbrir}
                                valorInput = {this.state.subProyecto.id_usuario}
                                cambiarLider = {this.cambiarLider}
                            />
                            <div className="invalid-feedback">
                                {this.state.msj_lider_subp}
                            </div>
                        </div>
                    </ModalBody>
                    <ModalFooter>
                        <button className="btn btn-success" onClick={() => this.guardarSubproyecto(this.state.subProyecto)}> {(this.props.estadoInsertar)? "Insertar" : "Actualizar"} </button>
                        <button className="btn btn-danger" onClick={this.cerrarModal} >Cancelar</button>
                    </ModalFooter>
                </Modal>

            </React.Fragment>
        );
    }
}