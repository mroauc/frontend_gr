import React, {Component} from 'react'
import './Empresa.css'
import '../vistaCrud.css'
import axios from 'axios'
import { Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap'

const url="http://localhost:8080/api/empresa/";

export default class Empresa extends Component{
   
    state ={
        data:[],
        empresa: {
            id_empresa: '',
            razon_social: '',
            rut_empresa: '',
            representante: ''
        },
        modalInsertar: false,
        modalEditar: false
    }

    componentDidMount(){
        this.getEmpresas();
    }

    getEmpresas = () => {
        axios.get(url).then(response=>{
            this.setState({
                data: response.data,
                empresa: {
                    id_empresa: '',
                    razon_social: '',
                    rut_empresa: '',
                    representante: ''
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
        if(!this.state.modalEditar){
            this.setState({
                empresa: {
                    id_empresa: '',
                    razon_social: '',
                    rut_empresa: '',
                    representante: ''
                }
            })
        }

    }

    obtenerEmpresa = (elemento) => {
        this.setState({
            empresa : elemento
        });
        this.cambiarEstadoEditar();
    }

    insertarEmpresa = async (empresa) => {
        var urlGuardar = url + 'guardar';
        console.log(urlGuardar);
        console.log(empresa);
        
        await axios.post(urlGuardar, empresa)
        .then(response => {
            (this.state.modalEditar) ? this.cambiarEstadoEditar() : this.cambiarEstadoInsertar();
            this.getEmpresas();
            console.log(response);
        })
        .catch(error => {
            console.log(error)
        })
    }

    eliminarEmpresa = (id_empresa) => {
        var urlEliminar = url + 'eliminar/' + id_empresa;
        axios.delete(urlEliminar).then(response=>{
            this.getEmpresas();
        });
    }

    changeHandler = (e) => {
        this.setState({
            empresa : {
              ...this.state.empresa, [e.target.name]: e.target.value
            }
          });
    }



    render(){
        return(
            <div>
                <div className="empresa col-10">
                    <div className="Encabezado"><p>Empresa</p></div>

                    <button type="button" class="btn boton" onClick={() => this.cambiarEstadoInsertar()}>Ingresar Empresa</button>

                    <table class="table table-hover">
                        <thead>
                            <tr>
                            <th scope="col">ID</th>
                            <th scope="col">Razon Social</th>
                            <th scope="col">RUT</th>
                            <th scope="col">representante</th>
                            <th scope="col">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.state.data.map(empresa => {
                                return(
                                    <tr>
                                        <td scope="col">{empresa.id_empresa}</td>
                                        <td>{empresa.razon_social}</td>
                                        <td>{empresa.rut_empresa}</td>
                                        <td>{empresa.representante}</td>
                                        <td>
                                            <button type="button" class="btn btn-warning" data-toggle="modal" data-target="#modalEditar" onClick={() => this.obtenerEmpresa(empresa)}>Editar</button> &nbsp;
                                            <button type="button" class="btn btn-danger" data-toggle="modal" data-target="#modalEditar" onClick={() => this.eliminarEmpresa(empresa.id_empresa)}>Eliminar</button>
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
                            <span>{(this.state.modalInsertar) ? 'Ingresar Empresa' :'Editar Empresa'}</span>
                            
                            <span style={{cursor : 'pointer' , float : 'right'}} onClick={() => {(this.state.modalEditar) ? this.cambiarEstadoEditar() : this.cambiarEstadoInsertar()}}>x</span>
                        </ModalHeader>
                        <ModalBody>
                            <div className="form-group">
                                <label htmlFor="id">ID</label>
                                <input className="form-control" type="text" name="id_empresa" id="id_empresa" value={(this.state.modalEditar) ? this.state.empresa.id_empresa : this.state.data.length+1} readOnly />
                                <br/>
                                <label htmlFor="razon_social">Razon Social</label>
                                <input className="form-control" type="text" name="razon_social" id="razon_social" onChange={this.changeHandler} value={this.state.empresa.razon_social}/>
                                <br/>
                                <label htmlFor="rut_empresa">RUT</label>
                                <input className="form-control" type="text" name="rut_empresa" id="rut_empresa" onChange={this.changeHandler} value={this.state.empresa.rut_empresa}/>
                                <br/>
                                <label htmlFor="representante">Representante</label>
                                <input className="form-control" type="text" name="representante" id="representante" onChange={this.changeHandler} value={this.state.empresa.representante}/>
                            </div>
                        </ModalBody>
                        <ModalFooter>
                            <button className="btn btn-success" onClick={() => this.insertarEmpresa(this.state.empresa)} >Guardar Cambios</button>
                            <button className="btn btn-danger" onClick={() => {(this.state.modalInsertar) ? this.cambiarEstadoInsertar() : this.cambiarEstadoEditar()}} >Cancelar</button>
                        </ModalFooter>
                    </Modal>

            </div>
        )
}
}
