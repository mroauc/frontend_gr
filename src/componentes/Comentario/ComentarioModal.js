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
        }
    }

    componentWillReceiveProps(next_props) {
        this.setState({ comentario: this.props.comentario});
        // console.log("WILL RECIVE");
    }


    guardarComentario = async (comentario) => {
        var urlGuardar = url + 'guardar';
        console.log(urlGuardar);
        console.log(comentario);
        
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
                            <input className="form-control" type="text" name="id_requerimiento" id="id_requerimiento" onChange={this.changeHandler} value={this.state.comentario.id_requerimiento} />
                            <br/>
                            <label htmlFor="id_usuario">ID Usuario</label>
                            <input className="form-control" type="text" name="id_usuario" id="id_usuario" onChange={this.changeHandler} value={this.state.comentario.id_usuario}/>
                            <br/>
                            <label htmlFor="fecha_ingreso">Fecha Ingreso</label>
                            <input className="form-control" type="date" name="fecha_ingreso" onChange={this.changeHandler} value={this.state.comentario.fecha_ingreso}/>
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