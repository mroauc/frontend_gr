import Axios from 'axios';
import React, {Component} from 'react';
import { Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import Menu from '../Menu/Menu';
import TablaUsuario from './TablaUsuario';
import UsuarioModal from './UsuarioModal';
import './Usuarios.css';
import '../vistaCrud.css';

class Usuario extends Component{

    state={
        usuarios: [],
        modalInsertar: false,
        modalEliminar: false,
        tipoModal: '',
        usuario: {
            id_usuario: 0,
            estado: 'Activo',
            nombre: '',
            password: '',
            rol: 'analista',
            email:''
        }
    }

    index=()=>{
        const token = localStorage.getItem('token');
        Axios.get('http://localhost:8080/api/usuario/',{headers: {"Authorization": `Bearer ${token}`}})
        .then(response=>{
            this.setState({
                usuarios: response.data
            });
        })
        .catch(()=>{
            this.props.history.push('/noAutorizado');
        })
    }

    componentDidMount(){
        this.index();
    }

    modalInsertar=()=>{
        this.setState({
            usuario: '',
            usuario: {estado:'Activo',rol:'Analista'},
            modalInsertar: !this.state.modalInsertar,
            tipoModal: 'insertar'
        });
    }

    editar=async(usuario)=>{
        await this.setState({
            usuario: usuario
        });
        this.modalActualizar();
    }

    modalActualizar=()=>{
        this.setState({
            modalInsertar: !this.state.modalInsertar,
            tipoModal: 'actualizar'
        });
    }

    modalEliminar=(usuario)=>{
        this.setState({
            modalEliminar:true,
            usuario: usuario
        });
    }

    eliminar=()=>{
        Axios.delete(`http://localhost:8080/api/usuario/eliminar/${this.state.usuario.id_usuario}`)
        .then(response=>{
            this.setState({modalEliminar:false, usuario:'', usuario: {estado:'Activo',rol:'analista'},});
            this.index();
        })
    }

    render(){
        return(
            <React.Fragment>
            <Menu />
            <div className="usuarios col-10">
                <div className="Encabezado"><p>Usuarios</p></div>
                <button type="button" class="btn boton" onClick={() => this.modalInsertar()}>Insertar</button>

                <TablaUsuario
                    usuarios={this.state.usuarios}
                    editar={this.editar}
                    modalEliminar={this.modalEliminar}
                />

                <UsuarioModal
                    usuario={this.state.usuario}
                    index={this.index}
                    tipoModal={this.state.tipoModal}
                    estadoModalInsertar={this.state.modalInsertar}
                    modalInsertar={this.modalInsertar}
                />

                <Modal isOpen={this.state.modalEliminar}>
                    <ModalBody>
                        ¿Seguro que desea eliminar el usuario?
                    </ModalBody>
                    <ModalFooter>
                        <button className="btn btn-danger" onClick={()=>this.eliminar()}>Si</button>
                        <button className="btn btn-secundary" onClick={()=>this.setState({modalEliminar:false})}>No</button>
                    </ModalFooter>
                </Modal>
            </div>
            </React.Fragment>
        );
    }
}

export default Usuario;