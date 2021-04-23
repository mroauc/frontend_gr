import React, {Component} from 'react'
import './Palabra.css'
import '../vistaCrud.css'
import axios from 'axios'
import { Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap'
import ModalPalabra from './PalabraModal'
import TablaPalabra from './PalabraTabla'
import Menu from '../Menu/Menu'
import ModalVerPalabra from './ModalVerPalabra'
import { Link } from 'react-router-dom';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';

const url= localStorage.getItem('url')+"/api/palabra/";


export default class Palabra extends Component{
   
    state ={
        data:[],
        palabra: {
            id_palabra: '',
            palabra: '',
            significado : '',
            id_proyecto: this.props.match.params.id_proyecto
        },
        modalInsertar: false,
        modalEditar: false,
        modalVer: false,
        modalEliminar: false
    }

    componentDidMount(){
        this.getPalabras();
        this.cargarPalabra();
    }

    cargarPalabra=()=>{
        var divPrincipal = document.getElementById("principal");
        divPrincipal.style.backgroundColor = localStorage.getItem('color_bckgr');
    }

    getPalabras = () => {
        const token = localStorage.getItem('token');
        const url_f = url + "consulta/" + this.props.match.params.id_proyecto;

        axios.get(url_f,{headers: {"Authorization": `Bearer  ${token}`}}).then(response=>{
            this.setState({
                data: response.data
            });
        })
        .catch(()=>{
            this.props.history.push('/noAutorizado');
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
                palabra: {
                    id_palabra: '',
                    palabra: '',
                    significado : '',
                    id_proyecto: this.props.match.params.id_proyecto
                }
            });
        }
    }

    cambiarEstadoVer=async()=>{
        await this.setState({
            modalVer: !this.state.modalVer
        });
        if(!this.state.modalVer){
            this.setState({
                palabra: {
                    id_palabra: '',
                    palabra: '',
                    significado: '',
                    id_proyecto: this.props.match.params.id_proyecto
                }
            });
        }
    }

    cambiarEstadoEliminar = (elemento) => {
        this.setState({
            palabra : elemento,
            modalEliminar : true
        })
    }

    obtenerPalabra = async (elemento) => {
        await this.setState({
            palabra : elemento
        });
        this.cambiarEstadoEditar();
    }

    verPalabra=async(elemento)=>{
        await this.setState({
            palabra: elemento
        });
        this.cambiarEstadoVer();
    }

    eliminarPalabra = () => {
        const token = localStorage.getItem('token');

        var urlEliminar = url + 'eliminar/' + this.state.palabra.id_palabra;
        axios.delete(urlEliminar,{headers: {"Authorization": `Bearer  ${token}`}}).then(response=>{
            this.getPalabras();
        });
        this.setState({
            modalEliminar: false
        })
    }

    render(){
        return(
            <React.Fragment>
                <Menu/>
                <div id="principal" className="contenedorPrincipal">
                <div className="palabra col-10">
                    <div className="Encabezado"><p>Palabras</p></div>
                    <button type="button" className="btn boton" onClick={() => this.cambiarEstadoInsertar()}>Ingresar Palabra</button> &nbsp;
                    <Link to={"/subProyecto/"+this.props.match.params.id_proyecto}><button type="button" className="btn boton"><ArrowBackIcon/> Volver</button></Link>

                    <TablaPalabra
                        palabras={this.state.data}
                        obtenerPalabra= {this.obtenerPalabra}
                        eliminarPalabra = {this.eliminarPalabra}
                        cambiarEstadoEliminar = {this.cambiarEstadoEliminar}
                        verPalabra = {this.verPalabra}
                    />

                    <ModalPalabra
                        palabra = {this.state.palabra}
                        getPalabras = {this.getPalabras}
                        estadoEditar = {this.state.modalEditar} 
                        estadoInsertar = {this.state.modalInsertar}
                        cambiarEstadoInsertar = {this.cambiarEstadoInsertar}
                        cambiarEstadoEditar = {this.cambiarEstadoEditar}    
                    />

                    <ModalVerPalabra
                        palabra = {this.state.palabra}
                        estadoVer = {this.state.modalVer}
                        modalEstadoVer = {this.cambiarEstadoVer}
                    />

                    <Modal isOpen={this.state.modalEliminar} toggle={() => this.setState({modalEliminar : false})}>
                        <ModalHeader></ModalHeader>
                        <ModalBody>Estas seguro que quiere eliminar la palabra</ModalBody>
                        <ModalFooter>
                            <button className="btn btn-danger" onClick ={() => {this.eliminarPalabra(); this.setState({palabra: {id_palabra: '', palabra: '', significado : '', id_proyecto: ''}})}}>SI</button>
                            <button className="btn btn-secunday" onClick={() => this.setState({modalEliminar : false})}>NO</button>
                        </ModalFooter>
                    </Modal>

                </div>
                </div>
            </React.Fragment>
        )
}
}
