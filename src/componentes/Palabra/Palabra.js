import React, {Component} from 'react'
import './Palabra.css'
import '../vistaCrud.css'
import axios from 'axios'
import { Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap'
import ModalPalabra from './PalabraModal'
import TablaPalabra from './PalabraTabla'
import Menu from '../Menu/Menu'

const url="http://localhost:8080/api/palabra/";


export default class Palabra extends Component{
   
    state ={
        data:[],
        palabra: {
            id_palabra: '',
            palabra: '',
            significado : '',
            id_glosario: ''
        },
        modalInsertar: false,
        modalEditar: false,
        modalEliminar: false
    }

    componentDidMount(){
        this.getPalabras();
    }

    getPalabras = () => {
        const token = localStorage.getItem('token');

        axios.get(url,{headers: {"Authorization": `Bearer  ${token}`}}).then(response=>{
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
                    id_glosario: ''
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
                <div className="palabra col-10">
                    <div className="Encabezado"><p>Palabra</p></div>
                    <button type="button" className="btn boton" onClick={() => this.cambiarEstadoInsertar()}>Ingresar Palabra</button>

                    <TablaPalabra
                        palabras={this.state.data}
                        obtenerPalabra= {this.obtenerPalabra}
                        eliminarPalabra = {this.eliminarPalabra}
                        cambiarEstadoEliminar = {this.cambiarEstadoEliminar}
                    />

                    <ModalPalabra
                        palabra = {this.state.palabra}
                        getPalabras = {this.getPalabras}
                        estadoEditar = {this.state.modalEditar} 
                        estadoInsertar = {this.state.modalInsertar}
                        cambiarEstadoInsertar = {this.cambiarEstadoInsertar}
                        cambiarEstadoEditar = {this.cambiarEstadoEditar}    
                    />

                    <Modal isOpen={this.state.modalEliminar}>
                        <ModalHeader></ModalHeader>
                        <ModalBody>Estas seguro que quiere eliminar la palabra</ModalBody>
                        <ModalFooter>
                            <button className="btn btn-danger" onClick ={() => {this.eliminarPalabra(); this.setState({palabra : ''})}}>SI</button>
                            <button className="btn btn-secunday" onClick={() => this.setState({modalEliminar : false})}>NO</button>
                        </ModalFooter>
                    </Modal>

                </div>
            </React.Fragment>
        )
}
}
