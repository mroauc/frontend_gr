import Axios from 'axios';
import React, { Component } from 'react';
import { Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import password from '../../imgs/password.png';
import swal from 'sweetalert'

export default class cambiarContraseña extends Component {
    
    state = {
        datos : {
            id_usuario: '',
            actual: '',
            nueva: '',
            nueva2: ''
        },
        actualError: "",
        nuevaError: "",
        nueva2Error: "",
        ok : true
    }

    componentDidMount = () => {
        this.setState({
            datos: {id_usuario: localStorage.getItem("id")}
        })
    }

    initDatos = () => {
        this.setState({
            datos : {
                id_usuario: '',
                actual: '',
                nueva: '',
                nueva2: ''
            }
        })
    }

    initErrors = () => {
        this.setState({
            id_usuario: localStorage.getItem("id"),
            actualError: "",
            nuevaError: "",
            nueva2Error: ""
        })
    }

    validar = () => {
        let salida = true;

        if(!this.state.datos.actual){ //si esta vacio
            this.setState({
                actualError : "Campo vacio."
            })
            salida = false;
        }
        if(!this.state.datos.nueva){
            this.setState({
                nuevaError : "Campo vacio."
            })
            salida = false;
        }
        if(!this.state.datos.nueva2){
            this.setState({
                nueva2Error : "Campo vacio."
            })
            salida = false;
        }
        else{
            if(this.state.datos.nueva !== this.state.datos.nueva2){
                this.setState({
                    nueva2Error : "La contraseña no coincide."
                })
                salida = false;
            }
        }
        return salida;
    }

    changeHandler = async (e) => {
        await this.setState({
            datos : {
              ...this.state.datos, [e.target.name]: e.target.value
            }
        });
    }

    realizarCambio = async () => {
        const token = localStorage.getItem('token');

        if(this.validar()){
            await Axios.post(localStorage.getItem('url') + "/api/usuario/pass", this.state.datos,{headers: {"Authorization": `Bearer  ${token}`}})
            .then(response => {
                this.setState({
                    ok : response.data
                })
            })
            if(this.state.ok) {
                this.initErrors();
                this.props.cambiarEstadoContraseña();
                this.alertaGuardar();
            }
            else{
                this.initErrors();
                this.setState({
                    actualError: "Contraseña Incorrecta. Intentelo nuevamente" 
                })
            }

        }
    }

    alertaGuardar = () => {
        swal({
            title: "Cambio de contraseña exitosa!",
            icon: "success",
            buttons: "Aceptar"
        })
    }
    
    render(){
        return(
            <Modal isOpen={this.props.estadoCambioContraseña} toggle={() => {this.initErrors();this.initDatos();this.props.cambiarEstadoContraseña()}}>
                <ModalHeader style={{display : 'block'}}>
                    <span>Cambiar Contraseña</span>
                    <span style={{cursor : 'pointer' , float : 'right'}} onClick={() => {this.initErrors();this.initDatos();this.props.cambiarEstadoContraseña()}}>X</span>
                </ModalHeader>
                
                <ModalBody>
                    <div style={{display:'flex', justifyContent: 'center', marginBottom: '30px'}}><img src={password} width="50%"/></div>
                    <div className="form-group">

                        <label htmlFor="actual">Ingresa tu Contraseña</label>
                        <input className={ (this.state.actualError)? "form-control is-invalid" : "form-control"}  type="password" name="actual" id="actual" onChange={this.changeHandler} onClick={() => {this.setState({actualError: ""})}}/>
                        <div class="invalid-feedback">
                            {this.state.actualError}
                        </div>
                        <br/>

                        <label htmlFor="nueva">Ingresa nueva Contraseña</label>
                        <input className={ (this.state.nuevaError)? "form-control is-invalid" : "form-control"}  type="password" name="nueva" id="nueva" onChange={this.changeHandler} onClick={() => {this.setState({nuevaError: ""})}}/>
                        <div class="invalid-feedback">
                            {this.state.nuevaError}
                        </div>
                        <br/>

                        <label htmlFor="nueva2">Confirma nueva Contraseña</label>
                        <input className={ (this.state.nueva2Error)? "form-control is-invalid" : "form-control"}  type="password" name="nueva2" id="nueva2" onChange={this.changeHandler} onClick={ () => {this.setState({nueva2Error: ""})}}/>
                        <div class="invalid-feedback">
                            {this.state.nueva2Error}
                        </div>
                        <br/>
                        
                    </div>                        
                </ModalBody>
                
                <ModalFooter>
                    <button className="btn btn-success" onClick={this.realizarCambio}>Guardar Cambios</button>
                    <button className="btn btn-danger" onClick={() => {this.initErrors();this.initDatos();this.props.cambiarEstadoContraseña()}}>Cancelar</button>
                </ModalFooter>
                
            </Modal>
        );
    }
}