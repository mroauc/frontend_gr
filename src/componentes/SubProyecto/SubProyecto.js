import React, {Component} from 'react'
import './SubProyecto.css'
import '../vistaCrud.css'
import axios from 'axios'
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap'
import ModalsubProyecto from './subProyectoModal'
import TablasubProyecto from './subProyectoTabla'
import Menu from '../Menu/Menu'
import { Link } from 'react-router-dom'
import ArrowBackIcon from '@material-ui/icons/ArrowBack';

const url="http://localhost:8080/api/subProyecto/";

export default class SubProyecto extends Component{

    state ={
        data:[],
        subProyecto: {
            id_subProyecto : 0,
            nombre_subProyecto :'',
            fecha_inicio : new Date().toLocaleDateString('fr-CA'),
            fecha_fin : '',
            id_proyecto : '',
            tipo_subProyecto : '',
            id_usuario : '',
            index_documento: 0
        },
        modalInsertar: false,
        modalEditar: false,
        modalEliminar : false,
        nombre_proyecto: ''
    }

    componentDidMount(){
        this.getProyectos();
        this.getSubProyectos();
    }

    getProyectos = async() =>{
        const token = localStorage.getItem('token');
        await axios.get(`http://localhost:8080/api/proyecto/${this.props.match.params.id_proyecto}`,{headers: {"Authorization": `Bearer  ${token}`}})
        .then(response=>{
            this.setState({
                nombre_proyecto: response.data.nombre
            })
        })
    }

    getSubProyectos = () => {
        const token = localStorage.getItem('token');
        const id_proy = this.props.match.params.id_proyecto;

        axios.get(`http://localhost:8080/api/subProyecto/pertenecientes/${id_proy}`,{headers: {"Authorization": `Bearer  ${token}`}}).then(response=>{
            this.setState({
                data: response.data,
                subProyecto:{
                    id_subProyecto : 0,
                    nombre_subProyecto :'',
                    fecha_inicio : new Date().toLocaleDateString('fr-CA'),
                    fecha_fin : '',
                    id_proyecto : id_proy,
                    tipo_subProyecto : '',
                    id_usuario : '',
                    index_documento: 0
                }
            });
        })
        .catch(()=>{
            this.props.history.push('/noAutorizado');
        });
    }

    cambiarEstadoInsertar = async () => {
        const token = localStorage.getItem('token');
        const id_proy = this.props.match.params.id_proyecto;
        await axios.get(`http://localhost:8080/api/usuario/${localStorage.getItem('email')}/`,{headers: {"Authorization": `Bearer ${token}`}})
        .then(response=>{
            this.setState({
                subProyecto: {
                    id_subProyecto : 0,
                    nombre_subProyecto :'',
                    fecha_inicio : new Date().toLocaleDateString('fr-CA'),
                    fecha_fin : '',
                    id_proyecto : id_proy,
                    tipo_subProyecto : '',
                    id_usuario : 0,  
                    index_documento : 0
                }
            });
        });
        this.setState({
            modalInsertar : !this.state.modalInsertar,
        });
    }

    cambiarEstadoEditar = async () => {
        const id_proy = this.props.match.params.id_proyecto;
        await this.setState({
            modalEditar : !this.state.modalEditar
        });

        if(!this.state.modalEditar){
            this.setState({
                subProyecto: {
                    id_subProyecto : 0,
                    nombre_subProyecto :'',
                    fecha_inicio : new Date().toLocaleDateString('fr-CA'),
                    fecha_fin : '',
                    id_proyecto : id_proy,
                    tipo_subProyecto : '',
                    id_usuario : ''
                }
            });
        }
    }

    cambiarEstadoEliminar = (elemento) => {
        this.setState({
            subProyecto : elemento,
            modalEliminar : true
        })
    }

    obtenerSubProyecto = async (elemento) => {
        await this.setState({
            subProyecto : elemento
        });
        this.cambiarEstadoEditar();
    }

    eliminarSubProyecto = () => {
        const token = localStorage.getItem('token');
        var urlEliminar = url + 'eliminar/' + this.state.subProyecto.id_subProyecto;
        axios.delete(urlEliminar,{headers: {"Authorization": `Bearer  ${token}`}}).then(response=>{
            this.setState({
                modalEliminar: !this.state.modalEliminar
            })
            this.getSubProyectos();
        });
    }

    accesoUsuario = () => {
        if(localStorage.getItem("tipo") === "admin" || localStorage.getItem("tipo") === "lider" || localStorage.getItem("tipo") === "jefe")
            return true;
        return false;
    }

    render(){
        return(
            <React.Fragment>
                <Menu />
                <div className="subProyecto col-10">
                    <div className="Encabezado" style={{fontSize:'35px', textAlign:'initial', color:'white'}}><p>Módulos del proyecto: {this.state.nombre_proyecto}</p></div>

                    {
                       this.accesoUsuario() ? 
                            <React.Fragment>
                                <button type="button" className="btn boton" onClick={() => this.cambiarEstadoInsertar()}>Nuevo Módulo</button> &nbsp;
                            </React.Fragment>
                        : ""
                        
                    }
                    <Link to={"/proyecto"}><button type="button" className="btn boton"><ArrowBackIcon/> Volver</button></Link>

                    <div style={{float: "right" , textDecoration: 'none'}}>
                        <Link to={"/graficoRequerimientos/"+this.props.match.params.id_proyecto}><button type="button" className="btn boton" >Estado Requerimientos</button> </Link>
                        <Link to= {`/palabra/${this.props.match.params.id_proyecto}`}><button type="button" className="btn boton">Ver Glosario</button> </Link>
                        <Link to={"/propuestaCambio/"+this.props.match.params.id_proyecto}><button type="button" className="btn boton" >Propuestas de cambio</button> </Link>
                        {(this.accesoUsuario()) ? 
                            <Link to= {`/c_documento/${this.props.match.params.id_proyecto}`}><button type="button" className="btn boton">Construir Documento</button></Link>    
                            : ""
                        }
                        
                    </div>

                    <TablasubProyecto
                        subProyectos={this.state.data}
                        obtenerSubProyecto = {this.obtenerSubProyecto}
                        eliminarSubProyecto = {this.eliminarSubProyecto}
                        cambiarEstadoEliminar = {this.cambiarEstadoEliminar}
                    />

                    <ModalsubProyecto
                        subProyecto = {this.state.subProyecto}
                        getSubProyectos = {this.getSubProyectos}
                        estadoEditar = {this.state.modalEditar} 
                        estadoInsertar = {this.state.modalInsertar}
                        cambiarEstadoInsertar = {this.cambiarEstadoInsertar}
                        cambiarEstadoEditar = {this.cambiarEstadoEditar}
                        id_proyecto = {this.props.match.params.id_proyecto}
                    />

                    <Modal isOpen={this.state.modalEliminar} toggle= {() => this.setState({modalEliminar : false})}>
                        <ModalHeader></ModalHeader>
                        <ModalBody>Estas seguro que quiere eliminar el Sub-Proyecto</ModalBody>
                        <ModalFooter>
                            <button className="btn btn-danger" onClick ={() => {this.eliminarSubProyecto(); this.setState({subProyecto : ''})}}>SI</button>
                            <button className="btn btn-secunday" onClick={() => this.setState({modalEliminar : false})}>NO</button>
                        </ModalFooter>
                    </Modal>


                </div>

            </React.Fragment>
        )
}
}