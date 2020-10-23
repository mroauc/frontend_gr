import axios from 'axios';
import React, { Component } from 'react'
import { Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';

const url="http://localhost:8080/api/glosario/";


export default class GlosarioModal extends Component {
    
    state ={
        glosario: {
            id_glosario: '',
            id_proyecto: ''
        },
        proyectos: []
    }

    componentDidMount(){
        this.getProyectos();
    }

    componentWillReceiveProps(next_props) {
        this.setState({ glosario: this.props.glosario});
        // console.log("WILL RECIVE");
    }

    guardarGlosario= async (glosario) => {
        const token = localStorage.getItem('token');

        var urlGuardar = url + 'guardar';
        console.log(urlGuardar);
        console.log(glosario);
        
        await axios.post(urlGuardar, glosario,{headers: {"Authorization": `Bearer  ${token}`}})
        .then(response => {
            (this.props.estadoEditar) ? this.props.cambiarEstadoEditar() : this.props.cambiarEstadoInsertar();
            this.props.getGlosarios();
            console.log(response);
        })
        .catch(error => {
            console.log(error)
        })
    }

    getProyectos = async () => {
        const token = localStorage.getItem('token');

        await axios.get("http://localhost:8080/api/proyecto/",{headers: {"Authorization": `Bearer  ${token}`}}).then(response=>{
            this.setState({
                proyectos: response.data
            })
        });
    }

    changeHandler = async (e) => {
        await this.setState({
            glosario : {
              ...this.state.glosario, [e.target.name]: e.target.value
            }
          });
    }

    render(){
        return(
            <React.Fragment>
                <Modal isOpen = {this.props.estadoInsertar || this.props.estadoEditar} >
                    <ModalHeader style={{display : 'block'}}>
                        <span>{(this.props.estadoInsertar) ? 'Ingresar Glosario' :'Editar Glosario'}</span>
                        
                        <span style={{cursor : 'pointer' , float : 'right'}} onClick={() => {(this.props.estadoEditar) ? this.props.cambiarEstadoEditar() : this.props.cambiarEstadoInsertar()}}>x</span>
                    </ModalHeader>
                    <ModalBody>
                        <div className="form-group">
                            <label htmlFor="id">ID</label>
                            <input className="form-control" type="text" name="id_glosario" id="id_glosario" value={this.state.glosario.id_glosario} readOnly />
                            <br/>
                            <label htmlFor="id_proyecto">ID Proyecto</label>
                            <select className="form-control" type="text" name="id_proyecto" id="id_proyecto" onChange={this.changeHandler} value={this.state.glosario.id_proyecto}>
                                <option>Selecciona un Proyecto</option>
                                {this.state.proyectos.map(proyecto => {
                                    return(
                                    <option value={proyecto.id_proyecto}>{proyecto.id_proyecto + " - " + proyecto.nombre}</option>
                                    )
                                })}
                            </select>
                            <br/>
                        </div>
                    </ModalBody>
                    <ModalFooter>
                        <button className="btn btn-success" onClick={() => this.guardarGlosario(this.state.glosario)} >Guardar Cambios</button>
                        <button className="btn btn-danger" onClick={() => {(this.props.estadoInsertar) ? this.props.cambiarEstadoInsertar() : this.props.cambiarEstadoEditar()}} >Cancelar</button>
                    </ModalFooter>
                </Modal>

            </React.Fragment>
        );
    }
}