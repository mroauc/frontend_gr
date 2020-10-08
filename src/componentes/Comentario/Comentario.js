import React, {Component} from 'react'
import './Comentario.css'
import '../vistaCrud.css'
import axios from 'axios'
import { Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap'

const url="http://localhost:8080/api/comentario/";

export default class Comentario extends Component{
    
    

    state ={
        data:[],
        comentario: {
            id_comentario: '',
            texto: '',
            id_requerimiento : '',
            fecha_ingreso: '',
            id_usuario: ''
        },
        modalInsertar: false,
        modalEditar: false
    }

    componentDidMount(){
        this.getComentarios();
    }

    getComentarios = () => {
        axios.get(url).then(response=>{
            this.setState({
                data: response.data,
                comentario: {
                    id_comentario: '',
                    texto: '',
                    id_requerimiento : '',
                    fecha_ingreso: '',
                    id_usuario: ''
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
                comentario: {
                    id_comentario: '',
                    texto: '',
                    id_requerimiento : '',
                    fecha_ingreso: '',
                    id_usuario: ''
                }
            });
        }
    }

    obtenerComentario = (elemento) => {
        this.setState({
            comentario : elemento
        });
        this.cambiarEstadoEditar();
    }

    insertarComentario = async (comentario) => {
        var urlGuardar = url + 'guardar';
        console.log(urlGuardar);
        console.log(comentario);
        
        await axios.post(urlGuardar, comentario)
        .then(response => {
            (this.state.modalEditar) ? this.cambiarEstadoEditar() : this.cambiarEstadoInsertar();
            this.getComentarios();
            console.log(response);
        })
        .catch(error => {
            console.log(error)
        })
    }

    eliminarComentario = (id_comentario) => {
        var urlEliminar = url + 'eliminar/' + id_comentario;
        axios.delete(urlEliminar).then(response=>{
            this.getComentarios();
        });
    }

    changeHandler = (e) => {
        this.setState({
            comentario : {
              ...this.state.comentario, [e.target.name]: e.target.value
            }
          });
    }

    render(){
        return(
            <div>
                <div className="comentario col-10">
                    <div className="Encabezado"><p>Comentario</p></div>

                    <button type="button" class="btn boton" onClick={() => this.cambiarEstadoInsertar()}>Ingresar Comentario</button>

                    <table class="table table-hover">
                        <thead>
                            <tr>
                            <th scope="col">ID</th>
                            <th scope="col">Comentario</th>
                            <th scope="col">ID Requermiento</th>
                            <th scope="col">ID Usuario</th>
                            <th scope="col">Fecha</th>
                            <th scope="col">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.state.data.map(comentario => {
                                return(
                                    <tr>
                                        <td scope="col">{comentario.id_comentario}</td>
                                        <td>{comentario.texto}</td>
                                        <td>{comentario.id_requerimiento}</td>
                                        <td>{comentario.id_usuario}</td>
                                        <td>{comentario.fecha_ingreso}</td>
                                        <td>
                                            <button type="button" class="btn btn-warning" data-toggle="modal" data-target="#modalEditar" onClick={() => this.obtenerComentario(comentario)}>Editar</button> &nbsp;
                                            <button type="button" class="btn btn-danger" data-toggle="modal" data-target="#modalEditar" onClick={() => this.eliminarComentario(comentario.id_comentario)}>Eliminar</button>
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
                            <span>{(this.state.modalInsertar) ? 'Ingresar Comentario' :'Editar Comentario'}</span>
                            
                            <span style={{cursor : 'pointer' , float : 'right'}} onClick={() => {(this.state.modalEditar) ? this.cambiarEstadoEditar() : this.cambiarEstadoInsertar()}}>x</span>
                        </ModalHeader>
                        <ModalBody>
                            <div className="form-group">
                                <label htmlFor="id">ID</label>
                                <input className="form-control" type="text" name="id_comentario" id="id_comentario" value={(this.state.modalEditar) ? this.state.comentario.id_comentario : this.state.data.length+1} readOnly />
                                <br/>
                                <label htmlFor="texto">Comentario</label>
                                <textarea className="form-control" type="text" name="texto" id="texto" onChange={this.changeHandler} value={this.state.comentario.texto} rows="3"></textarea>
                                <br/>
                                <label htmlFor="id_requerimiento">ID Requerimiento</label>
                                <input className="form-control" type="text" name="id_requerimiento" id="id_requerimiento" onChange={this.changeHandler} value={this.state.comentario.id_requerimiento}/>
                                <br/>
                                <label htmlFor="id_usuario">ID Usuario</label>
                                <input className="form-control" type="text" name="id_usuario" id="id_usuario" onChange={this.changeHandler} value={this.state.comentario.id_usuario}/>
                                <br/>
                                <label htmlFor="fecha_ingreso">Fecha Ingreso</label>
                                <input className="form-control" type="date" name="fecha_ingreso" id="datetime" onChange={this.changeHandler} value={this.state.comentario.fecha_ingreso}/>
                            </div>
                        </ModalBody>
                        <ModalFooter>
                            <button className="btn btn-success" onClick={() => this.insertarComentario(this.state.comentario)} >Guardar Cambios</button>
                            <button className="btn btn-danger" onClick={() => {(this.state.modalInsertar) ? this.cambiarEstadoInsertar() : this.cambiarEstadoEditar()}} >Cancelar</button>
                        </ModalFooter>
                    </Modal>

            </div>
        )
}
}