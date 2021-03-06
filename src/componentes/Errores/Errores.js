import Axios from 'axios';
import React, { Component } from 'react';
import { Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import {Link} from 'react-router-dom';
import Menu from '../Menu/Menu';
import ErroresModal from './ErroresModal';
import TablaErrores from './TablaErrores';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import './Errores.css';
import '../vistaCrud.css';

class Errores extends Component{

    state={
        errores: [],
        modalInsertar: false,
        modalEliminar: false,
        tipoModal: '',
        dataError: {
            id_error: 0,
            id_proyecto: '',
            contenido: '',
            id_usuario: '',
            fecha: ''
        }
    }

    index=()=>{
        const token = localStorage.getItem('token');
        const id_proy = this.props.match.params.id_proyecto;
        Axios.get(localStorage.getItem('url') + `/api/errores/pertenecientes/${id_proy}`,{headers: {"Authorization": `Bearer ${token}`}})
        .then(response=>{
            this.setState({
                errores: response.data
            });
        })
        .catch(()=>{
            this.props.history.push('/noAutorizado');
        })
    }

    componentDidMount(){
        this.index();
        this.cargarColor();
    }

    cargarColor=()=>{
        var divPrincipal = document.getElementById("principal");
        divPrincipal.style.backgroundColor = localStorage.getItem('color_bckgr');
    }

    modalInsertar=async()=>{
        const token = localStorage.getItem('token');
        await Axios.get(localStorage.getItem('url') + `/api/usuario/${localStorage.getItem('email')}`,{headers: {"Authorization": `Bearer ${token}`}})
        .then(response=>{
            this.setState({
                dataError:{id_error: 0, contenido: '', id_usuario:response.data.id,fecha:''}
            });
        })

        this.setState({
            modalInsertar: !this.state.modalInsertar,
            tipoModal: 'insertar'
        })
    }

    editar=async(errorsingle)=>{
        await this.setState({
            dataError: errorsingle
        });
        this.modalActualizar();
    }

    modalActualizar=()=>{
        this.setState({
            modalInsertar: !this.state.modalInsertar,
            tipoModal: 'actualizar'
        });
    }

    modalEliminar=(errorSingle)=>{
        this.setState({
            modalEliminar: true,
            dataError: errorSingle
        });
    }

    eliminar=()=>{
        const token = localStorage.getItem('token');
        Axios.delete(localStorage.getItem('url') + `/api/errores/eliminar/${this.state.dataError.id_error}`,{headers: {"Authorization": `Bearer ${token}`}})
        .then(response=>{
            this.setState({modalEliminar:false, dataError:''});
            this.index();
        })
    }

    accesoUsuario = () => {
        if(localStorage.getItem("tipo") === "admin" || localStorage.getItem("tipo") === "lider" || localStorage.getItem("tipo") === "jefe")
            return true;
        return false;
    }

    render(){
        return(
            <React.Fragment>
                <Menu/>
                <div id="principal" className="contenedorPrincipal">
                <div className="errores col-10">
                <div className="Encabezado"><p>Errores</p></div>
                {this.accesoUsuario() ?
                    <React.Fragment>
                        <button type="button" class="btn boton" onClick={() => this.modalInsertar()}>Insertar</button> &nbsp;
                    </React.Fragment>
                    : ""
                }
                
                <Link to={"/seleccionarError"}><button type="button" className="btn boton"><ArrowBackIcon/> Volver</button></Link>

                <TablaErrores
                    errores={this.state.errores}
                    editar={this.editar}
                    modalEliminar={this.modalEliminar}
                />
                <ErroresModal
                    dataError={this.state.dataError}
                    index={this.index}
                    tipoModal={this.state.tipoModal}
                    estadoModalInsertar={this.state.modalInsertar}
                    modalInsertar={this.modalInsertar}
                    id_proyecto = {this.props.match.params.id_proyecto}
                />

                <Modal isOpen={this.state.modalEliminar}>
                    <ModalBody>
                        ¿Seguro que desea eliminar el error?
                    </ModalBody>
                    <ModalFooter>
                        <button className="btn btn-danger" onClick={()=>this.eliminar()}>Si</button>
                        <button className="btn btn-secundary" onClick={()=>this.setState({modalEliminar:false})}>No</button>
                    </ModalFooter>
                </Modal>
            </div>
            </div>
            </React.Fragment>
        );
    }
}

export default Errores;