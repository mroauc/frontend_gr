import axios from 'axios';
import React, { Component } from 'react'
import { Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import '../vistaCrud.css'
import ModalComentario from './ComentarioModal'
import TablaComentario from './ComentarioTabla'

const url="http://localhost:8080/api/comentario/";

export default class Comentario extends Component {
    
    state = { 
        data : [],
        comentario: {
            id_comentario: '',
            texto: '',
            id_requerimiento : '',
            fecha_ingreso: '',
            id_usuario: ''
        },
        modalInsertar : false,
        modalEditar : false,
        modalEliminar : false
    }

    componentDidMount(){
        this.getComentarios();
    }

    getComentarios = () => {
        const token = localStorage.getItem('token');
        axios.get(url,{headers: {"Authorization": `Bearer  ${token}`}}).then(response=>{
            this.setState({
                data: response.data
            })
        });
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
            console.log("Entro en el IF");
            this.setState( {
                comentario : {
                    id_comentario: '',
                    texto: '',
                    id_requerimiento : '',
                    fecha_ingreso: '',
                    id_usuario: ''
            }})
        }
    }

    cambiarEstadoEliminar = (elemento) => {
        this.setState({
            comentario : elemento,
            modalEliminar : true
        })
    }

    obtenerComentario = async (elemento) => {
        await this.setState({
            comentario : elemento
        });
        this.cambiarEstadoEditar();
    }

    eliminarComentario = () => {
        var urlEliminar = url + 'eliminar/' + this.state.comentario.id_comentario;
        const token = localStorage.getItem('token');
        axios.delete(urlEliminar,{headers: {"Authorization": `Bearer  ${token}`}}).then(response=>{
            this.getComentarios();
        });
        this.setState({
            modalEliminar : false
        })
    }

    render(){
        return(
            
            <div className="comentario col-10">
                <div className="Encabezado"><p>Comentario</p></div>
                <button type="button" className="btn boton" onClick={() => this.cambiarEstadoInsertar()}>Ingresar Comentario</button>
                
                <TablaComentario 
                    comentarios={this.state.data}
                    obtenerComentario = {this.obtenerComentario}
                    eliminarComentario = {this.eliminarComentario}
                    cambiarEstadoEliminar = {this.cambiarEstadoEliminar}
                />
                <ModalComentario
                    comentario = {this.state.comentario}
                    getComentarios = {this.getComentarios}
                    estadoEditar = {this.state.modalEditar} 
                    estadoInsertar = {this.state.modalInsertar}
                    cambiarEstadoInsertar = {this.cambiarEstadoInsertar}
                    cambiarEstadoEditar = {this.cambiarEstadoEditar}
                />

                <Modal isOpen={this.state.modalEliminar}>
                    <ModalHeader></ModalHeader>
                    <ModalBody>Estas seguro que quiere eliminar el comentario</ModalBody>
                    <ModalFooter>
                        <button className="btn btn-danger" onClick ={() => {this.eliminarComentario(); this.setState({comentario : ''})}}>SI</button>
                        <button className="btn btn-secunday" onClick={() => this.setState({modalEliminar : false})}>NO</button>
                    </ModalFooter>
                </Modal>
            </div>
            
        );
    }
}