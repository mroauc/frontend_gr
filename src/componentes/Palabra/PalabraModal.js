import axios from 'axios';
import React, { Component } from 'react'
import { Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';

const url="http://localhost:8080/api/palabra/";

export default class PalabraModal extends Component {
    
    state ={
        palabra: {
            id_palabra: '',
            palabra: '',
            significado : '',
            id_glosario: ''
        },
        glosarios: []
    }

    componentDidMount(){
        this.getGlosarios();
    }

    componentWillReceiveProps(next_props) {
        this.setState({ palabra: this.props.palabra});
        // console.log("WILL RECIVE");
    }

    guardarPalabra = async (palabra) => {
        var urlGuardar = url + 'guardar';
        console.log(urlGuardar);
        console.log(palabra);
        
        await axios.post(urlGuardar, palabra)
        .then(response => {
            (this.props.estadoEditar) ? this.props.cambiarEstadoEditar() : this.props.cambiarEstadoInsertar();
            this.props.getPalabras();
            console.log(response);
        })
        .catch(error => {
            console.log(error)
        })
    }

    changeHandler = async (e) => {
        await this.setState({
            palabra : {
              ...this.state.palabra, [e.target.name]: e.target.value
            }
          });
    }

    getGlosarios = async () => {
        await axios.get("http://localhost:8080/api/glosario/").then(response=>{
            this.setState({
                glosarios: response.data
            })
        });
        console.log(this.state.glosarios);
    }

    render(){
        return(
            <React.Fragment>
                <Modal isOpen = {this.props.estadoInsertar || this.props.estadoEditar} >
                    <ModalHeader style={{display : 'block'}}>
                        <span>{(this.props.estadoInsertar) ? 'Ingresar Palabra' :'Editar Palabra'}</span>
                        
                        <span style={{cursor : 'pointer' , float : 'right'}} onClick={() => {(this.props.estadoEditar) ? this.props.cambiarEstadoEditar() : this.props.cambiarEstadoInsertar()}}>x</span>
                    </ModalHeader>
                    <ModalBody>
                        <div className="form-group">
                            <label htmlFor="id">ID</label>
                            <input className="form-control" type="text" name="id_palabra" id="id_palabra" value={this.state.palabra.id_palabra} readOnly />
                            <br/>
                            <label htmlFor="palabra">Palabra</label>
                            <input className="form-control" type="text" name="palabra" id="palabra" onChange={this.changeHandler} value={this.state.palabra.palabra}/>
                            <br/>
                            <label htmlFor="significado">Significado</label>
                            <input className="form-control" type="text" name="significado" id="significado" onChange={this.changeHandler} value={this.state.palabra.significado}/>
                            <br/>
                            <label htmlFor="id_glosario">Id Glosario</label>
                            <select className="form-control" type="text" name="id_glosario" id="id_glosario" onChange={this.changeHandler} value={this.state.palabra.id_glosario}>
                                <option>Seleccione un Glosario</option>
                                {this.state.glosarios.map(glosario => {
                                    return(
                                    <option value={glosario.id_glosario}>{glosario.id_glosario}</option>
                                    )
                                })}
                            </select>
                        </div>
                    </ModalBody>
                    <ModalFooter>
                        <button className="btn btn-success" onClick={() => this.guardarPalabra(this.state.palabra)} >Guardar Cambios</button>
                        <button className="btn btn-danger" onClick={() => {(this.props.estadoInsertar) ? this.props.cambiarEstadoInsertar() : this.props.cambiarEstadoEditar()}} >Cancelar</button>
                    </ModalFooter>
                </Modal>

            </React.Fragment>
        );
    }
}