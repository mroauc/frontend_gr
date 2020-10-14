import axios from 'axios';
import React, { Component } from 'react'
import { Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';

const url="http://localhost:8080/api/comentario/";

export default class ComentarioModal extends Component {

    state = {
        comentario: {
            id_comentario: '',
            texto: '',
            id_requerimiento : '',
            fecha_ingreso: '',
            id_usuario: ''
        },
        requerimientos: [],
        usuarios: []
    }

    componentDidMount(){
        this.getRequerimientos();
        this.getUsuarios();
    }

    componentWillReceiveProps(next_props) {
        this.setState({ comentario: this.props.comentario});
        // console.log("WILL RECIVE");
    }


    guardarComentario = async (comentario) => {
        var urlGuardar = url + 'guardar';
        
        if(this.props.estadoInsertar)
            comentario.fecha_ingreso = new Date().toLocaleString();
        
        await axios.post(urlGuardar, comentario)
        .then(response => {
            (this.props.estadoEditar) ? this.props.cambiarEstadoEditar() : this.props.cambiarEstadoInsertar();
            this.props.getComentarios();
            console.log(response);
        })
        .catch(error => {
            console.log(error)
        })
    }

    changeHandler = async (e) => {
        await this.setState({
            comentario : {
              ...this.state.comentario, [e.target.name]: e.target.value
            }
          });
    }

    getRequerimientos = async () => {
        await axios.get("http://localhost:8080/api/requerimiento/").then(response=>{
            this.setState({
                requerimientos: response.data
            })
        });
        console.log(this.state.requerimientos);
    }

    getUsuarios = async () => {
        await axios.get("http://localhost:8080/api/usuario/").then(response=>{
            this.setState({
                usuarios: response.data
            })
        });
        console.log(this.state.usuarios);
    }


    render(){
        return(
            
            <React.Fragment>
                <Modal isOpen = {this.props.estadoInsertar || this.props.estadoEditar} >
                    <ModalHeader style={{display : 'block'}}>
                        <span>{(this.props.estadoInsertar) ? 'Ingresar Comentario' :'Editar Comentario'}</span>
                        
                        <span style={{cursor : 'pointer' , float : 'right'}} onClick={() => {(this.props.estadoEditar) ? this.props.cambiarEstadoEditar() : this.props.cambiarEstadoInsertar()}}>x</span>
                    </ModalHeader>
                    <ModalBody>
                        <div className="form-group">
                            <label htmlFor="id">ID</label>
                            <input className="form-control" type="text" name="id_comentario" id="id_comentario" value={this.state.comentario.id_comentario} readOnly/>
                            <br/>
                            <label htmlFor="texto">Comentario</label>
                            <input className="form-control" type="text" name="texto" id="texto" onChange={this.changeHandler} value={this.state.comentario.texto}/>
                            <br/>
                            <label htmlFor="id_requerimiento">ID Requerimiento</label>
                            <select className="form-control" type="text" name="id_requerimiento" id="id_requerimiento" onChange={this.changeHandler} value={this.state.comentario.id_requerimiento}>
                                <option>Seleccione un Requerimiento</option>
                                {this.state.requerimientos.map(requerimiento => {
                                    return(
                                    <option value={requerimiento.id_requerimiento}>{requerimiento.id_requerimiento + " - " + requerimiento.categoria}</option>
                                    )
                                })}
                            </select>
                            <br/>
                            <label htmlFor="id_usuario">ID Usuario</label>
                            <select className="form-control" type="text" name="id_usuario" id="id_usuario" onChange={this.changeHandler} value={this.state.comentario.id_usuario}>
                                <option>Selecciona un Usuario</option>
                                {this.state.usuarios.map(usuario => {
                                    return(
                                    <option value={usuario.id_usuario}>{usuario.id_usuario + " - " + usuario.nombre}</option>
                                    )
                                })}
                            </select>
                            <br/>
                            {/* <label htmlFor="fecha_ingreso">Fecha Ingreso</label>
                            <input className="form-control" type="date" name="fecha_ingreso" onChange={this.changeHandler} value={this.state.comentario.fecha_ingreso}/> */}
                        </div>
                    </ModalBody>
                    <ModalFooter>
                        <button className="btn btn-success" onClick={() => this.guardarComentario(this.state.comentario)} >Guardar Cambios</button>
                        <button className="btn btn-danger" onClick={() => {(this.props.estadoInsertar) ? this.props.cambiarEstadoInsertar() : this.props.cambiarEstadoEditar()}} >Cancelar</button>
                    </ModalFooter>
                </Modal>

            </React.Fragment>
        );
    }
}