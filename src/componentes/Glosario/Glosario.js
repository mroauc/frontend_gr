import React, {Component} from 'react'
import './Glosario.css'
import '../vistaCrud.css'
import axios from 'axios'
import { Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap'
import ModalGlosario from './GlosarioModal'
import TablaGlosario from './GlosarioTabla'
import Menu from '../Menu/Menu'

const url="http://localhost:8080/api/glosario/";


export default class Glosario extends Component {
    
    state ={
        data:[],
        glosario: {
            id_glosario: '',
            id_proyecto: ''
        },
        modalInsertar: false,
        modalEditar: false,
        modalEliminar: false
    }
    
    componentDidMount(){
        this.getGlosarios();
    }
    
    getGlosarios = () => {
        const token = localStorage.getItem('token');

        axios.get(url,{headers: {"Authorization": `Bearer  ${token}`}}).then(response=>{
            this.setState({
                data: response.data
            });
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
        console.log(this.state.modalEditar);

        if(!this.state.modalEditar){
            this.setState({
                glosario : {
                    id_glosario : '',
                    id_proyecto : ''
                }})
        }
    }
    
    cambiarEstadoEliminar = (elemento) => {
        this.setState({
            glosario : elemento,
            modalEliminar : true
        })
    }

    obtenerGlosario = async (elemento) => {
        await this.setState({
            glosario : elemento
        });
        this.cambiarEstadoEditar();
    }

    eliminarGlosario = () => {
        const token = localStorage.getItem('token');

        var urlEliminar = url + 'eliminar/' + this.state.glosario.id_glosario;
        axios.delete(urlEliminar,{headers: {"Authorization": `Bearer  ${token}`}}).then(response=>{
            this.getGlosarios();
        });
        this.setState({
            modalEliminar : false
        })
    }
    
    render(){
        return(
            <React.Fragment>
                <Menu/>
                <div className="glosario col-10">
                    <div className="Encabezado"><p>Glosario</p></div>
                    <button type="button" class="btn boton" onClick={() => this.cambiarEstadoInsertar()}>Ingresar Glosario</button>

                    <TablaGlosario
                        glosarios={this.state.data}
                        obtenerGlosario = {this.obtenerGlosario}
                        eliminarGlosario = {this.eliminarGlosario}
                        cambiarEstadoEliminar = {this.cambiarEstadoEliminar}
                    />

                    <ModalGlosario
                        glosario = {this.state.glosario}
                        getGlosarios = {this.getGlosarios}
                        estadoEditar = {this.state.modalEditar} 
                        estadoInsertar = {this.state.modalInsertar}
                        cambiarEstadoInsertar = {this.cambiarEstadoInsertar}
                        cambiarEstadoEditar = {this.cambiarEstadoEditar}
                    />

                    <Modal isOpen={this.state.modalEliminar}>
                        <ModalHeader></ModalHeader>
                        <ModalBody>Estas seguro que quiere eliminar el glosario de palabras</ModalBody>
                        <ModalFooter>
                            <button className="btn btn-danger" onClick ={() => {this.eliminarGlosario(); this.setState({glosario : ''})}}>SI</button>
                            <button className="btn btn-secunday" onClick={() => this.setState({modalEliminar : false})}>NO</button>
                        </ModalFooter>
                    </Modal>

                </div>
            </React.Fragment>
        );
    }
}
