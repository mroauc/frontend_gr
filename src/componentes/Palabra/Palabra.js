import React, {Component} from 'react'
import './Palabra.css'
import '../vistaCrud.css'
import axios from 'axios'
import { Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap'

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
        modalEditar: false
    }

    componentDidMount(){
        this.getPalabras();
    }

    getPalabras = () => {
        axios.get(url).then(response=>{
            this.setState({
                data: response.data,
                palabra: {
                    id_palabra: '',
                    palabra: '',
                    significado : '',
                    id_glosario: ''
                }
            });
            console.log(response.data);
            console.log(this.state.data);
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

    obtenerPalabra = (elemento) => {
        this.setState({
            palabra : elemento
        });
        this.cambiarEstadoEditar();
    }

    insertarPalabra = async (palabra) => {
        var urlGuardar = url + 'guardar';
        console.log(urlGuardar);
        
        await axios.post(urlGuardar, palabra)
        .then(response => {
            (this.state.modalEditar) ? this.cambiarEstadoEditar() : this.cambiarEstadoInsertar();
            this.getPalabras();
            console.log(response);
        })
        .catch(error => {
            console.log(error)
        })
    }

    eliminarPalabra = (id_palabra) => {
        var urlEliminar = url + 'eliminar/' + id_palabra;
        axios.delete(urlEliminar).then(response=>{
            this.getPalabras();
        });
    }

    changeHandler = (e) => {
        this.setState({
            palabra : {
              ...this.state.palabra, [e.target.name]: e.target.value
            }
          });
        console.log(this.state.palabra);
    }



    render(){
        return(
            <div>
                <div className="palabra col-10">
                    <div className="Encabezado"><p>Palabra</p></div>

                    <button type="button" class="btn boton" onClick={() => this.cambiarEstadoInsertar()}>Ingresar Palabra</button>

                    <table class="table table-hover">
                        <thead>
                            <tr>
                            <th scope="col">ID</th>
                            <th scope="col">Palabra</th>
                            <th scope="col">Significado</th>
                            <th scope="col">ID Glosario</th>
                            <th scope="col">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.state.data.map(palabra => {
                                return(
                                    <tr>
                                        <td scope="col">{palabra.id_palabra}</td>
                                        <td>{palabra.palabra}</td>
                                        <td>{palabra.significado}</td>
                                        <td>{palabra.id_glosario}</td>
                                        <td>
                                            <button type="button" class="btn btn-warning" data-toggle="modal" data-target="#modalEditar" onClick={() => this.obtenerPalabra(palabra)}>Editar</button> &nbsp;
                                            <button type="button" class="btn btn-danger" data-toggle="modal" data-target="#modalEditar" onClick={() => this.eliminarPalabra(palabra.id_palabra)}>Eliminar</button>
                                        </td>

                                    </tr>
                                )
                            })}
                        
                        </tbody>
                    </table>
                </div>
                    
                    {/* MODAL INSERTAR */}

                    <Modal isOpen = {this.state.modalInsertar || this.state.modalEditar} >
                        <ModalHeader style={{display : 'block'}}>
                            <span>{(this.state.modalEditar) ? 'Editar Palabra' :'Ingresar Palabra'}</span>
                            
                            <span style={{cursor : 'pointer' , float : 'right'}} onClick={() => {(this.state.modalEditar) ? this.cambiarEstadoEditar() : this.cambiarEstadoInsertar()}}>x</span>
                        </ModalHeader>
                        <ModalBody>
                            <div className="form-group">
                                <label htmlFor="id">ID</label>
                                <input className="form-control" type="text" name="id_palabra" id="id_palabra" value={(this.state.modalEditar) ? this.state.palabra.id_palabra : this.state.data.length+1} readOnly />
                                <br/>
                                <label htmlFor="palabra">Palabra</label>
                                <input className="form-control" type="text" name="palabra" id="palabra" onChange={this.changeHandler} value={this.state.palabra.palabra}/>
                                <br/>
                                <label htmlFor="significado">Significado</label>
                                <input className="form-control" type="text" name="significado" id="significado" onChange={this.changeHandler} value={this.state.palabra.significado}/>
                                <br/>
                                <label htmlFor="id_proyecto">Id Glosario</label>
                                <input className="form-control" type="text" name="id_glosario" id="id_glosario" onChange={this.changeHandler} value={this.state.palabra.id_glosario}/>
                            </div>
                        </ModalBody>
                        <ModalFooter>
                            <button className="btn btn-success" onClick={() => this.insertarPalabra(this.state.palabra)} >Guardar Cambios</button>
                            <button className="btn btn-danger" onClick={() => {(this.state.modalEditar) ? this.cambiarEstadoEditar() : this.cambiarEstadoInsertar()}} >Cancelar</button>
                        </ModalFooter>
                    </Modal>

            </div>
        )
}
}
