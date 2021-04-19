import axios from 'axios';
import React, { Component } from 'react'
import { Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';

const url=localStorage.getItem('url')+"/api/empresa/";

export default class EmpresaModal extends Component {
    state ={
        empresa: {
            id_empresa: '',
            razon_social: '',
            rut_empresa: '',
            representante: ''
        },
        msj_razon_social: "",
        msj_rut_empresa: "",
        msj_representante: ""
    }

    componentWillReceiveProps(next_props) {
        this.setState({ empresa: this.props.empresa});
    }

    validar=()=>{
        let salida = true;
        if(!this.state.empresa.razon_social){
            this.setState({
                msj_razon_social: "Campo Vacio"
            });
            salida = false;
        }
        if(!this.state.empresa.rut_empresa){
            this.setState({
                msj_rut_empresa: "Campo Vacio"
            });
            salida = false;
        }
        if(!this.state.empresa.representante){
            this.setState({
                msj_representante: "Campo Vacio"
            });
            salida = false;
        }
        return salida;
    }

    guardarEmpresa = async (empresa) => {
        if(this.validar()){
            const token = localStorage.getItem('token');
            var urlGuardar = url + 'guardar';
            console.log(urlGuardar);
            console.log(empresa);
            
            await axios.post(urlGuardar, empresa,{headers: {"Authorization": `Bearer  ${token}`}})
            .then(response => {
                this.setState({
                    msj_razon_social: "",
                    msj_representante: "",
                    msj_rut_empresa: ""
                });
                (this.props.estadoEditar) ? this.props.cambiarEstadoEditar() : this.props.cambiarEstadoInsertar();
                this.props.getEmpresas();
            })
            .catch(error => {
                console.log(error)
            })
        }
    }

    changeHandler = async (e) => {
        await this.setState({
            empresa : {
              ...this.state.empresa, [e.target.name]: e.target.value
            }
          });
    }

    cerrarInsertar=()=>{
        this.setState({
            msj_razon_social: "",
            msj_representante: "",
            msj_rut_empresa: ""
        });
        this.props.cambiarEstadoInsertar();
    }

    cerrarEditar=()=>{
        this.setState({
            msj_razon_social: "",
            msj_representante: "",
            msj_rut_empresa: ""
        });
        this.props.cambiarEstadoEditar();
    }

    render(){
        return(
            <React.Fragment>
                <Modal isOpen = {this.props.estadoInsertar || this.props.estadoEditar} toggle={() => {(this.props.estadoInsertar) ? this.cerrarInsertar() : this.cerrarEditar()}}>
                    <ModalHeader style={{display : 'block'}}>
                        <span>{(this.props.estadoInsertar) ? 'Ingresar Empresa' :'Editar Empresa'}</span>
                        <span style={{cursor : 'pointer' , float : 'right'}} onClick={() => {(this.props.estadoEditar) ? this.cerrarEditar() : this.cerrarInsertar()}}>X</span>
                    </ModalHeader>
                    <ModalBody>
                        <div className="form-group">
                            <label htmlFor="razon_social">Razon Social</label>
                            <input className={ (this.state.msj_razon_social)? "form-control is-invalid" : "form-control"} type="text" name="razon_social" id="razon_social" onChange={this.changeHandler} value={this.state.empresa.razon_social} onClick={()=>{this.setState({msj_razon_social:""})}}/>
                            <div className="invalid-feedback">
                                {this.state.msj_razon_social}
                            </div>
                            <br/>
                            <label htmlFor="rut_empresa">RUT</label>
                            <input className={ (this.state.msj_rut_empresa)? "form-control is-invalid" : "form-control"} type="text" name="rut_empresa" id="rut_empresa" onChange={this.changeHandler} value={this.state.empresa.rut_empresa} onClick={()=>{this.setState({msj_rut_empresa:""})}}/>
                            <div className="invalid-feedback">
                                {this.state.msj_rut_empresa}
                            </div>
                            <br/>
                            <label htmlFor="representante">Representante</label>
                            <input className={ (this.state.msj_representante)? "form-control is-invalid" : "form-control"} type="text" name="representante" id="representante" onChange={this.changeHandler} value={this.state.empresa.representante} onClick={()=>{this.setState({msj_representante:""})}}/>
                            <div className="invalid-feedback">
                                {this.state.msj_representante}
                            </div>
                        </div>
                    </ModalBody>
                    <ModalFooter>
                        <button className="btn btn-success" onClick={() => this.guardarEmpresa(this.state.empresa)}> {(this.props.estadoInsertar)? "Insertar" : "Actualizar"}</button>
                        <button className="btn btn-danger" onClick={() => {(this.props.estadoInsertar) ? this.cerrarInsertar() : this.cerrarEditar()}} >Cancelar</button>
                    </ModalFooter>
                </Modal>

            </React.Fragment>
        );
    }
}