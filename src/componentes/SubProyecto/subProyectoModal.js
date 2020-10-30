
import axios from 'axios';
import React, { Component } from 'react'
import { Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import ChipsSubProyectoUsuario from './ChipsSubProyectoUsuario';

const url="http://localhost:8080/api/subProyecto/";

export default class subProyectoModal extends Component {
    
    state ={
        subProyecto: {
            id_subProyecto : '',
            nombre_subProyecto :'',
            fecha_inicio : '',
            fecha_fin : '',
            id_proyecto : '',
            tipo_subProyecto : '',
            id_usuario : ''
        },
        usuarios: [],
        usuariosSeleccionados : []
    }

    componentDidMount(){
        this.getUsuarios();
        //this.getProyectos();
    }

    componentWillReceiveProps(next_props) {
        this.setState({subProyecto: this.props.subProyecto});
    }

    guardarSubproyecto = async (subProyecto) => {
        const token = localStorage.getItem('token');
        var urlGuardar = url + 'guardar';
        
        await axios.post(urlGuardar, subProyecto,{headers: {"Authorization": `Bearer  ${token}`}})
        .then(response => {
            if(this.props.estadoEditar){
                this.props.cambiarEstadoEditar();
            }
            else{
                this.insertar_usuariosSubProyecto(response.data.id_subProyecto);
                this.props.cambiarEstadoInsertar();
            }
            this.props.getSubProyectos();
            console.log(response);
        })
        .catch(error => {
            console.log(error)
        })
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
        console.log(filtrado);        
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
        this.setState({usuariosSeleccionados: []});
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
                        <span>{(this.props.estadoInsertar) ? 'Ingresar Sub-Proyecto' :'Editar Sub-Proyecto'}</span>
                        
                        <span style={{cursor : 'pointer' , float : 'right'}} onClick={this.cerrarModal}>X</span>
                    </ModalHeader>
                    <ModalBody>
                        <div className="form-group">
                            <label htmlFor="id">ID</label>
                            <input className="form-control" type="text" name="id_subProyecto" id="id_subProyecto" value={this.state.subProyecto.id_subProyecto} readOnly />
                            <br/>
                            <label htmlFor="subProyecto">SubProyecto</label>
                            <input className="form-control" type="text" name="nombre_subProyecto" id="nombre_subProyecto" onChange={this.changeHandler} value={this.state.subProyecto.nombre_subProyecto}/>
                            <br/>
                            <ChipsSubProyectoUsuario
                                tipo="Clientes"
                                usuarios = {this.state.usuarios.filter(usuario => usuario.tipo === "cliente")}
                                ingresarChip = {this.insertarChip}
                                eliminarChip = {this.eliminarChip}
                            />
                            <br/>
                            <ChipsSubProyectoUsuario
                                tipo="Analistas"
                                usuarios = {this.state.usuarios.filter(usuario => usuario.tipo === "analista")}
                                ingresarChip = {this.insertarChip}
                                eliminarChip = {this.eliminarChip}
                            />
                            <br/>
                            <label htmlFor="fecha_inicio">Fecha Inicio</label>
                            <input className="form-control" type="date" name="fecha_inicio" id="fecha_inicio" onChange={this.changeHandler} value={this.state.subProyecto.fecha_inicio}/>
                            <br/>
                            <label htmlFor="id_usuario">Fecha Termino</label>
                            <input className="form-control" type="date" name="fecha_fin" id="fecha_fin" onChange={this.changeHandler} value={this.state.subProyecto.fecha_fin}/>
                            <br/>
                            <label htmlFor="id_proyecto">ID Proyecto</label>
                            <input className="form-control" type="text" name="id_proyecto" id="id_proyecto" value={this.state.subProyecto.id_proyecto} readOnly />
                            <br/>
                            <label htmlFor="id_proyecto">Tipo SubProyecto</label>
                            <input className="form-control" type="text" name="tipo_subProyecto" id="tipo_subProyecto" onChange={this.changeHandler} value={this.state.subProyecto.tipo_subProyecto}/>
                            <br/>
                            <label htmlFor="id_proyecto">ID Usuario</label>
                            <input className="form-control" type="text" name="id_usuario" id="id_usuario" onChange={this.changeHandler} value={this.state.subProyecto.id_usuario} readOnly />                       
                        </div>
                    </ModalBody>
                    <ModalFooter>
                        <button className="btn btn-success" onClick={() => this.guardarSubproyecto(this.state.subProyecto)} > {(this.props.estadoInsertar)? "Insertar" : "Actualizar"} </button>
                        <button className="btn btn-danger" onClick={this.cerrarModal} >Cancelar</button>
                    </ModalFooter>
                </Modal>

            </React.Fragment>
        );
    }
}