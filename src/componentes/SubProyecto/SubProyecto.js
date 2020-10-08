import React, {Component} from 'react'
import './SubProyecto.css'
import '../vistaCrud.css'
import axios from 'axios'
import { Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap'

const url="http://localhost:8080/api/subProyecto/";

export default class Comentario extends Component{
    
    

    state ={
        data:[],
        subProyecto: {
            id_subProyecto : '',
            nombre_subProyecto :'',
            fecha_inicio : '',
            fecha_fin : '',
            id_proyecto : '',
            tipo_subProyecto : '',
            id_usuario : ''
        },
        modalInsertar: false,
        modalEditar: false
    }

    componentDidMount(){
        this.getSubProyectos();
    }

    getSubProyectos = () => {
        axios.get(url).then(response=>{
            this.setState({
                data: response.data,
                subProyecto: {
                    id_subProyecto : '',
                    nombre_subProyecto :'',
                    fecha_inicio : '',
                    fecha_fin : '',
                    id_proyecto : '',
                    tipo_subProyecto : '',
                    id_usuario : ''
                }
            });
        })
    }

    cambiarEstadoInsertar = () => {
        this.setState({
            modalInsertar : !this.state.modalInsertar,
        });
    }

    cambiarEstadoEditar = async () => {
        await this.setState({
            modalEditar : !this.state.modalEditar
        });

        if(!this.state.modalEditar){
            this.setState({
                subProyecto: {
                    id_subProyecto : '',
                    nombre_subProyecto :'',
                    fecha_inicio : '',
                    fecha_fin : '',
                    id_proyecto : '',
                    tipo_subProyecto : '',
                    id_usuario : ''
                }
            });
        }
    }

    obtenerSubProyecto = (elemento) => {
        this.setState({
            subProyecto : elemento
        });
        this.cambiarEstadoEditar();
    }

    insertarSubProyecto = async (subProyecto) => {
        var urlGuardar = url + 'guardar';
        console.log(urlGuardar);
        console.log(subProyecto);
        
        await axios.post(urlGuardar, subProyecto)
        .then(response => {
            (this.state.modalEditar) ? this.cambiarEstadoEditar() : this.cambiarEstadoInsertar();
            this.getSubProyectos();
            console.log(response);
        })
        .catch(error => {
            console.log(error)
        })
    }

    eliminarSubProyecto = (id_subProyecto) => {
        var urlEliminar = url + 'eliminar/' + id_subProyecto;
        axios.delete(urlEliminar).then(response=>{
            this.getSubProyectos();
        });
    }

    changeHandler = (e) => {
        this.setState({
            subProyecto : {
              ...this.state.subProyecto, [e.target.name]: e.target.value
            }
          });
    }



    render(){
        return(
            <div>
                <div className="subProyecto col-10">
                    <div className="Encabezado"><p>SubProyecto</p></div>

                    <button type="button" class="btn boton" onClick={() => this.cambiarEstadoInsertar()}>Ingresar SubProyecto</button>

                    <table class="table table-hover">
                        <thead>
                            <tr>
                            <th scope="col">ID</th>
                            <th scope="col">Nombre</th>
                            <th scope="col">Fecha de Inicio</th>
                            <th scope="col">Fecha de Termino</th>
                            <th scope="col">ID Proyecto</th>
                            <th scope="col">Tipo Proyecto</th>
                            <th scope="col">ID Usuario</th>
                            <th scope="col">Acciones</th>

                            </tr>
                        </thead>
                        <tbody>
                            {this.state.data.map(subProyecto => {
                                return(
                                    <tr>
                                        <td scope="col">{subProyecto.id_subProyecto}</td>
                                        <td>{subProyecto.nombre_subProyecto}</td>
                                        <td>{subProyecto.fecha_inicio}</td>
                                        <td>{subProyecto.fecha_fin}</td>
                                        <td>{subProyecto.id_proyecto}</td>
                                        <td>{subProyecto.tipo_subProyecto}</td>
                                        <td>{subProyecto.id_usuario}</td>
                                        <td>
                                            <button type="button" class="btn btn-warning" data-toggle="modal" data-target="#modalEditar" onClick={() => this.obtenerSubProyecto(subProyecto)}>Editar</button> &nbsp;
                                            <button type="button" class="btn btn-danger" data-toggle="modal" data-target="#modalEditar" onClick={() => this.eliminarSubProyecto(subProyecto.id_subProyecto)}>Eliminar</button>
                                        </td>

                                    </tr>
                                )
                            })}
                        
                        </tbody>
                    </table>
                </div>
                    
                    {/* MODAL INSERTAR */}

                    <Modal isOpen = {this.state.modalInsertar || this.state.modalEditar} >
                        <ModalHeader style={{display : 'block'}}>
                            <span>{(this.state.modalInsertar) ? 'Ingresar SubProyecto' :'Editar SubProyecto'}</span>
                            
                            <span style={{cursor : 'pointer' , float : 'right'}} onClick={() => {(this.state.modalEditar) ? this.cambiarEstadoEditar() : this.cambiarEstadoInsertar()}}>x</span>
                        </ModalHeader>
                        <ModalBody>
                            <div className="form-group">
                                <label htmlFor="id">ID</label>
                                <input className="form-control" type="text" name="id_subProyecto" id="id_subProyecto" value={(this.state.modalEditar) ? this.state.subProyecto.id_subProyecto : this.state.data.length+1} readOnly />
                                <br/>
                                <label htmlFor="subProyecto">SubProyecto</label>
                                <input className="form-control" type="text" name="nombre_subProyecto" id="nombre_subProyecto" onChange={this.changeHandler} value={this.state.subProyecto.nombre_subProyecto}/>
                                <br/>
                                <label htmlFor="fecha_inicio">Fecha Inicio</label>
                                <input className="form-control" type="date" name="fecha_inicio" id="fecha_inicio" onChange={this.changeHandler} value={this.state.subProyecto.fecha_inicio}/>
                                <br/>
                                <label htmlFor="id_usuario">Fecha Termino</label>
                                <input className="form-control" type="date" name="fecha_fin" id="fecha_fin" onChange={this.changeHandler} value={this.state.subProyecto.fecha_fin}/>
                                <br/>
                                <label htmlFor="id_proyecto">ID Proyecto</label>
                                <input className="form-control" type="text" name="id_proyecto" id="id_proyecto" onChange={this.changeHandler} value={this.state.subProyecto.id_proyecto}/>
                                <br/>
                                <label htmlFor="id_proyecto">Tipo SubProyecto</label>
                                <input className="form-control" type="text" name="tipo_subProyecto" id="tipo_subProyecto" onChange={this.changeHandler} value={this.state.subProyecto.tipo_subProyecto}/>
                                <br/>
                                <label htmlFor="id_proyecto">ID Usuario</label>
                                <input className="form-control" type="text" name="id_usuario" id="id_usuario" onChange={this.changeHandler} value={this.state.subProyecto.id_usuario}/>
                            </div>
                        </ModalBody>
                        <ModalFooter>
                            <button className="btn btn-success" onClick={() => this.insertarSubProyecto(this.state.subProyecto)} >Guardar Cambios</button>
                            <button className="btn btn-danger" onClick={() => {(this.state.modalInsertar) ? this.cambiarEstadoInsertar() : this.cambiarEstadoEditar()}} >Cancelar</button>
                        </ModalFooter>
                    </Modal>

            </div>
        )
}
}