import Axios from 'axios';
import React, { Component } from 'react'
import { Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';

export class ErroresModal extends Component{

    state={
        dataError: {
            id_error: 0,
            contenido: '',
            id_usuario: '',
            fecha: ''
        },
        msj_contenido: "",
    }

    componentWillReceiveProps(next_props){
        this.setState({dataError: this.props.dataError});
    }

    validar=()=>{
        let salida = true;
        if(!this.state.dataError.contenido){
            this.setState({
                msj_contenido: "Campo Vacio"
            });
            salida=false;
        }
        return salida;
    }

    guardar=async()=>{
        if(this.validar()){
            const token = localStorage.getItem('token');
            await Axios.post('http://localhost:8080/api/errores/guardar/',{
                contenido: this.state.dataError.contenido,
                id_usuario: this.state.dataError.id_usuario,
                fecha: new Date().toLocaleString()
            },{headers: {"Authorization": `Bearer ${token}`}})
            .then(response=>{
                this.setState({
                    msj_contenido: ""
                });
                this.props.modalInsertar();
                this.props.index();
            })
        }
    }

    guardarActualizacion=()=>{
        if(this.validar()){
            const token = localStorage.getItem('token');
            Axios.post('http://localhost:8080/api/errores/editar/',this.state.dataError, {headers: {"Authorization": `Bearer ${token}`}})
            .then(response=>{
                this.setState({
                    msj_contenido: ""
                });
                this.props.modalInsertar();
                this.props.index();
            })
        }
    }

    changeHandler=async(e)=>{
        await this.setState({
            dataError:{
                ...this.state.dataError, [e.target.name]: e.target.value
            }
        });
        var caracteres_act = this.state.dataError.contenido.length;
        if (caracteres_act < 1000){
            document.getElementById("span_contador").innerHTML = '<span style="color: grey;">' + caracteres_act + '/1000</span>';
        }else{
            document.getElementById("span_contador").innerHTML = '<span style="color: red;">' + caracteres_act + '/1000</span>';
        }
    }

    cerrar=()=>{
        this.setState({
            msj_contenido:""
        });
        this.props.modalInsertar();
    }

    render(){
        return(
            <React.Fragment>
                <Modal isOpen={this.props.estadoModalInsertar} size="lg" toggle={()=>this.cerrar()}>
                    <ModalHeader style={{display:'block'}}>
                        <span>{(this.props.tipoModal==='insertar') ? 'Ingresar Propuesta de Error' :'Editar Propuesta de Error'}</span>

                        <span style={{cursor:'pointer', float:'right'}} onClick={()=>this.cerrar()}>X</span>
                    </ModalHeader>
                    <ModalBody>
                        <div className="form-group">
                            <input className="form-control" type="text" name="id_error" id="id_error" value={this.state.dataError.id_error} readOnly hidden/>
                            <br/>
                            <label htmlFor="contenido">Contenido del Error</label>
                            <p><textarea className={ (this.state.msj_contenido)? "form-control is-invalid" : "form-control"} type="text" name="contenido" id="contenido" rows="4" maxLength="1000" onChange={this.changeHandler} value={this.state.dataError.contenido} onClick={()=>{this.setState({contenido:""})}} /></p>
                            {(this.props.tipoModal==='insertar')?
                                <p id="span_contador" style={{float:'right'}}><span style={{color: 'gray'}}>0/1000</span></p>
                                :
                                <p id="span_contador" style={{float:'right'}}><span style={{color: 'gray'}}>{this.state.dataError.contenido.length}/1000</span></p>
                            }
                            <div className="invalid-feedback" style={{display:'block'}}>
                                {this.state.msj_contenido}
                            </div>
                            <br/>
                            <input className="form-control" type="text" name="id_usuario" id="id_usuario" value={this.state.dataError.id_usuario} readOnly hidden/>
                        </div>
                    </ModalBody>
                    <ModalFooter>
                        {this.props.tipoModal==='insertar'?
                            <button className="btn btn-success" onClick={()=>this.guardar()}>
                                Insertar
                            </button>
                            :
                            <button className="btn btn-success" onClick={()=>this.guardarActualizacion()}>
                                Actualizar
                            </button>
                        }
                            <button className="btn btn-danger" onClick={()=>this.cerrar()}>Cancelar</button>
                    </ModalFooter>
                </Modal>
            </React.Fragment>
        );
    }
}

export default ErroresModal;