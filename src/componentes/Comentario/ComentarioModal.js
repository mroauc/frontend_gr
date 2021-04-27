import axios from 'axios';
import React, { Component } from 'react'
import { Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';

const url=localStorage.getItem('url')+"/api/comentario/";

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
        const token = localStorage.getItem('token');
        var urlGuardar = url + 'guardar';
        if(this.props.estadoInsertar)
            comentario.fecha_ingreso = new Date().toLocaleString();
        
        await axios.post(urlGuardar, comentario,{headers: {"Authorization": `Bearer  ${token}`}})
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
        const token = localStorage.getItem('token');
        await axios.get(localStorage.getItem('url')+"/api/requerimiento/",{headers: {"Authorization": `Bearer  ${token}`}}).then(response=>{
            this.setState({
                requerimientos: response.data
            })
        });
        console.log(this.state.requerimientos);
    }

    getUsuarios = async () => {
        const token = localStorage.getItem('token');
        await axios.get(localStorage.getItem('url')+"/api/usuario/",{headers: {"Authorization": `Bearer  ${token}`}}).then(response=>{
            this.setState({
                usuarios: response.data
            })
        });
        console.log(this.state.usuarios);
    }


    render(){
        return(
            
            <React.Fragment>
                <Modal isOpen = {this.props.estadoInsertar || this.props.estadoEditar} toggle={() => {(this.props.estadoInsertar) ? this.props.cambiarEstadoInsertar() : this.props.cambiarEstadoEditar()}}>
                    <ModalHeader style={{display : 'block'}}>
                        <span>{(this.props.estadoInsertar) ? 'Ingresar Comentario' :'Editar Comentario'}</span>
                        
                        <span style={{cursor : 'pointer' , float : 'right'}} onClick={() => {(this.props.estadoEditar) ? this.props.cambiarEstadoEditar() : this.props.cambiarEstadoInsertar()}}>X</span>
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
                            <input className="form-control" type="text" name="id_usuario" id="id_usuario" onChange={this.changeHandler} value={this.state.comentario.id_usuario} readOnly />
                        </div>
                    </ModalBody>
                    <ModalFooter>
                        <button className="btn btn-success" onClick={() => this.guardarComentario(this.state.comentario)}> {(this.props.estadoInsertar)? "Insertar" : "Actualizar"} </button>
                        <button className="btn btn-danger" onClick={() => {(this.props.estadoInsertar) ? this.props.cambiarEstadoInsertar() : this.props.cambiarEstadoEditar()}} >Cancelar</button>
                    </ModalFooter>
                </Modal>

            </React.Fragment>
        );
    }
}