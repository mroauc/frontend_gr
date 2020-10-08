import React, {Component} from 'react'
import './Glosario.css'
import '../vistaCrud.css'
import axios from 'axios'
import { Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap'
import { Link } from 'react-router-dom'

const url="http://localhost:8080/api/glosario/";

export default class Glosario extends Component {
    
    state ={
        data:[],
        glosario: {
            id_glosario: '',
            id_proyecto: ''
        },
        modalInsertar: false,
        modalEditar: false
    }
    
    componentDidMount(){
        this.getGlosarios();
    }
    
    getGlosarios = () => {
        axios.get(url).then(response=>{
            this.setState({
                data: response.data,
                glosario: {
                    id_glosario: '',
                    id_proyecto: ''
                }
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
            this.setState({glosario : {id_glosario : '', id_proyecto : ''}})
        }
    }
    
    obtenerGlosario = (elemento) => {
        this.setState({
            glosario : elemento
        });
        this.cambiarEstadoEditar();
    }
    
    insertarGlosario = async (glosario) => {
        var urlGuardar = url + 'guardar';
        console.log(urlGuardar);
        console.log(glosario);
        
        await axios.post(urlGuardar, glosario)
        .then(response => {
            (this.state.modalEditar) ? this.cambiarEstadoEditar() : this.cambiarEstadoInsertar();
            this.getGlosarios();
            console.log(response);
        })
        .catch(error => {
            console.log(error)
        })
    }
    
    eliminarGlosario = (id_glosario) => {
        var urlEliminar = url + 'eliminar/' + id_glosario;
        axios.delete(urlEliminar).then(response=>{
            this.getGlosarios();
        });
    }


    
    changeHandler = (e) => {
        this.setState({
            glosario : {
              ...this.state.glosario, [e.target.name]: e.target.value
            }
          });
    }

    render(){
        return(
            <div>
                <div className="glosario col-10">
                    <div className="Encabezado"><p>Glosario</p></div>

                    <button type="button" class="btn boton" onClick={() => this.cambiarEstadoInsertar()}>Ingresar Glosario</button>

                    <table class="table table-hover">
                        <thead>
                            <tr>
                            <th scope="col" style={{width:'30%'}}>ID</th>
                            <th style={{width:'30%'}}>ID Proyecto</th>
                            <th style={{width:'30%'}}>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.state.data.map(glosario => {
                                return(
                                    <tr>
                                        <td scope="col">{glosario.id_glosario}</td>
                                        <td>{glosario.id_proyecto}</td>
                                        <td >
                                            <Link to={"/glosario/"+glosario.id_glosario} ><button className="btn btn-success" >Ver Definiciones</button></Link> &nbsp;
                                            <button type="button" class="btn btn-warning" data-toggle="modal" data-target="#modalEditar" onClick={() => this.obtenerGlosario(glosario)}>Editar</button> &nbsp;
                                            <button type="button" class="btn btn-danger" data-toggle="modal" data-target="#modalEditar" onClick={() => this.eliminarGlosario(glosario.id_glosario)}>Eliminar</button>
                                            
                                            
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
                            <span>{(this.state.modalInsertar) ? 'Ingresar Glosario' :'Editar Glosario'}</span>
                            
                            <span style={{cursor : 'pointer' , float : 'right'}} onClick={() => {(this.state.modalEditar) ? this.cambiarEstadoEditar() : this.cambiarEstadoInsertar()}}>x</span>
                        </ModalHeader>
                        <ModalBody>
                            <div className="form-group">
                                <label htmlFor="id">ID</label>
                                <input className="form-control" type="text" name="id_glosario" id="id_glosario" value={(this.state.modalEditar) ? this.state.glosario.id_glosario : this.state.data.length+1} readOnly />
                                <br/>
                                <label htmlFor="id_proyecto">ID Proyecto</label>
                                <input className="form-control" type="text" name="id_proyecto" id="id_proyecto" onChange={this.changeHandler} value={this.state.glosario.id_proyecto}/>
                                <br/>
                            </div>
                        </ModalBody>
                        <ModalFooter>
                            <button type="submit" className="btn btn-success" onClick={() => this.insertarGlosario(this.state.glosario)} >Guardar Cambios</button>
                            <button className="btn btn-danger" onClick={() => {(this.state.modalInsertar) ? this.cambiarEstadoInsertar() : this.cambiarEstadoEditar()}} >Cancelar</button>
                        </ModalFooter>
                    </Modal>

            </div>
        );
    }
}
