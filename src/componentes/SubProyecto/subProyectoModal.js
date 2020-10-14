import axios from 'axios';
import React, { Component } from 'react'
import { Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';

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
        proyectos : [],
        usuarios: []
    }

    componentDidMount(){
        this.getUsuarios();
        this.getProyectos();
    }

    componentWillReceiveProps(next_props) {
        this.setState({subProyecto: this.props.subProyecto});
        console.log("WILL RECIVE");
    }

    guardarSubproyecto = async (subProyecto) => {
        var urlGuardar = url + 'guardar';
        console.log(urlGuardar);
        console.log(subProyecto);
        
        await axios.post(urlGuardar, subProyecto)
        .then(response => {
            (this.props.estadoEditar) ? this.props.cambiarEstadoEditar() : this.props.cambiarEstadoInsertar();
            this.props.getSubProyectos();
            console.log(response);
        })
        .catch(error => {
            console.log(error)
        })
    }

    getUsuarios = async () => {
        await axios.get("http://localhost:8080/api/usuario/").then(response=>{
            this.setState({
                usuarios: response.data
            })
        });
    }

    getProyectos = async () => {
        await axios.get("http://localhost:8080/api/proyecto/").then(response=>{
            this.setState({
                proyectos: response.data
            })
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
                <Modal isOpen = {this.props.estadoInsertar || this.props.estadoEditar} >
                    <ModalHeader style={{display : 'block'}}>
                        <span>{(this.props.estadoInsertar) ? 'Ingresar Sub-Proyecto' :'Editar Sub-Proyecto'}</span>
                        
                        <span style={{cursor : 'pointer' , float : 'right'}} onClick={() => {(this.props.estadoEditar) ? this.props.cambiarEstadoEditar() : this.props.cambiarEstadoInsertar()}}>x</span>
                    </ModalHeader>
                    <ModalBody>
                        <div className="form-group">
                            <label htmlFor="id">ID</label>
                            <input className="form-control" type="text" name="id_subProyecto" id="id_subProyecto" value={this.state.subProyecto.id_subProyecto} readOnly />
                            <br/>
                            <label htmlFor="subProyecto">SubProyecto</label>
                            <input className="form-control" type="text" name="nombre_subProyecto" id="nombre_subProyecto" onChange={this.changeHandler} value={this.state.subProyecto.nombre_subProyecto}/>
                            <br/>
                            <label htmlFor="fecha_inicio">Fecha Inicio</label>
                            <input className="form-control" type="date" name="fecha_inicio" id="fecha_inicio" pattern="[0-9]{2}-[0-9]{2}-[0-9]{4}" onChange={this.changeHandler} value={this.state.subProyecto.fecha_inicio}/>
                            <br/>
                            <label htmlFor="id_usuario">Fecha Termino</label>
                            <input className="form-control" type="date" name="fecha_fin" id="fecha_fin" onChange={this.changeHandler} value={this.state.subProyecto.fecha_fin}/>
                            <br/>
                            <label htmlFor="id_proyecto">ID Proyecto</label>
                            <select className="form-control" type="text" name="id_proyecto" id="id_proyecto" onChange={this.changeHandler} value={this.state.subProyecto.id_proyecto}>
                                <option>Selecciona un Proyecto</option>
                                {this.state.proyectos.map(proyecto => {
                                    return(
                                    <option value={proyecto.id_proyecto}>{proyecto.id_proyecto + " - " + proyecto.nombre}</option>
                                    )
                                })}
                            </select>
                            <br/>
                            <label htmlFor="id_proyecto">Tipo SubProyecto</label>
                            <input className="form-control" type="text" name="tipo_subProyecto" id="tipo_subProyecto" onChange={this.changeHandler} value={this.state.subProyecto.tipo_subProyecto}/>
                            <br/>
                            <label htmlFor="id_proyecto">ID Usuario</label>
                            <select className="form-control" type="text" name="id_usuario" id="id_usuario" onChange={this.changeHandler} value={this.state.subProyecto.id_usuario}>
                                <option>Selecciona un Usuario</option>
                                {this.state.usuarios.map(usuario => {
                                    return(
                                    <option value={usuario.id_usuario}>{usuario.id_usuario + " - " + usuario.nombre}</option>
                                    )
                                })}
                            </select>                            
                        </div>
                    </ModalBody>
                    <ModalFooter>
                        <button className="btn btn-success" onClick={() => this.guardarSubproyecto(this.state.subProyecto)} >Guardar Cambios</button>
                        <button className="btn btn-danger" onClick={() => {(this.props.estadoInsertar) ? this.props.cambiarEstadoInsertar() : this.props.cambiarEstadoEditar()}} >Cancelar</button>
                    </ModalFooter>
                </Modal>

            </React.Fragment>
        );
    }
}