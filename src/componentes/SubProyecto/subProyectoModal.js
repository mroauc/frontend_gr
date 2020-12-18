import Axios from 'axios';
import axios from 'axios';
import React, { Component } from 'react'
import { Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import ChipsSubProyectoUsuario from './ChipsSubProyectoUsuario';

const url="http://localhost:8080/api/subProyecto/";

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
        msj_lider_subp: ""
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

    cerrarModal = () => {
        (this.props.estadoInsertar) ? this.props.cambiarEstadoInsertar() : this.props.cambiarEstadoEditar(); 
        this.setState({
            usuariosSeleccionados: [],
            msj_nombre_subp: "",
            msj_fechaInicio: "",
            msj_tipo_subp: "",
            msj_lider_subp: ""
        });
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
                            <select name="id_usuario" id="id_usuario" className={ (this.state.msj_lider_subp)? "form-control is-invalid" : "form-control"} value={this.state.subProyecto.id_usuario} onChange={this.changeHandler} onClick={()=>{this.setState({msj_lider_subp: ""})}}>
                                <option value="">Seleccionar Líder de Módulo</option>
                                {this.state.lideres_subProyectos.map( lider => {
                                    return(
                                    <option key={lider.id} value={lider.id}>{lider.id+" - "+lider.nombre}</option>
                                    )
                                })}
                            </select>
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