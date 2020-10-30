import axios from 'axios';
import React, { Component } from 'react'
import { Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';

const url="http://localhost:8080/api/empresa/";


export default class EmpresaModal extends Component {
    state ={
        empresa: {
            id_empresa: '',
            razon_social: '',
            rut_empresa: '',
            representante: ''
        }
    }

    componentWillReceiveProps(next_props) {
        this.setState({ empresa: this.props.empresa});
    }

    guardarEmpresa = async (empresa) => {
        const token = localStorage.getItem('token');

        var urlGuardar = url + 'guardar';
        console.log(urlGuardar);
        console.log(empresa);
        
        await axios.post(urlGuardar, empresa,{headers: {"Authorization": `Bearer  ${token}`}})
        .then(response => {
            (this.props.estadoEditar) ? this.props.cambiarEstadoEditar() : this.props.cambiarEstadoInsertar();
            this.props.getEmpresas();
            console.log(response);
        })
        .catch(error => {
            console.log(error)
        })
    }

    changeHandler = async (e) => {
        await this.setState({
            empresa : {
              ...this.state.empresa, [e.target.name]: e.target.value
            }
          });
    }

    render(){
        return(
            <React.Fragment>
                <Modal isOpen = {this.props.estadoInsertar || this.props.estadoEditar} toggle={() => {(this.props.estadoInsertar) ? this.props.cambiarEstadoInsertar() : this.props.cambiarEstadoEditar()}}>
                    <ModalHeader style={{display : 'block'}}>
                        <span>{(this.props.estadoInsertar) ? 'Ingresar Empresa' :'Editar Empresa'}</span>
                        
                        <span style={{cursor : 'pointer' , float : 'right'}} onClick={() => {(this.props.estadoEditar) ? this.props.cambiarEstadoEditar() : this.props.cambiarEstadoInsertar()}}>X</span>
                    </ModalHeader>
                    <ModalBody>
                        <div className="form-group">
                            <label htmlFor="id">ID</label>
                            <input className="form-control" type="text" name="id_empresa" id="id_empresa" value={this.state.empresa.id_empresa} readOnly />
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
                        <button className="btn btn-success" onClick={() => this.guardarEmpresa(this.state.empresa)}> {(this.props.estadoInsertar)? "Insertar" : "Actualizar"}</button>
                        <button className="btn btn-danger" onClick={() => {(this.props.estadoInsertar) ? this.props.cambiarEstadoInsertar() : this.props.cambiarEstadoEditar()}} >Cancelar</button>
                    </ModalFooter>
                </Modal>

            </React.Fragment>
        );
    }

}