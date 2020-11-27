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
            estado: '',
            nombre: '',
            password: '',
            rol: '',
            email:''
        }
    }

    index=async()=>{
        const token = localStorage.getItem('token');
        await Axios.get('http://localhost:8080/api/usuario/',{headers: {"Authorization": `Bearer ${token}`}})
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
            usuario: {estado: ""},
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
        console.log(usuario);
    }

    eliminar= async ()=>{
        const token = localStorage.getItem('token');
        if(this.state.usuario.tipo === 'cliente'){
            await Axios.get(`http://localhost:8080/api/cliente/id_usuario/${this.state.usuario.id}`, {headers: {"Authorization": `Bearer  ${token}`}})
            .then(async response => {
                await Axios.delete(`http://localhost:8080/api/cliente/eliminar/${response.data.id_cliente}`, {headers: {"Authorization": `Bearer  ${token}`}})
            })
        }

        await Axios.delete(`http://localhost:8080/api/usuario/eliminar/${this.state.usuario.id}`, {headers: {"Authorization": `Bearer  ${token}`}})
        .then(response=>{
            this.index();
            this.setState({
                modalEliminar:false, 
                usuario:{
                    id_usuario: 0,
                    estado: '',
                    nombre: '',
                    password: '',
                    rol: '',
                    email:''
                }});
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