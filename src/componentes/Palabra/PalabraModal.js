import axios from 'axios';
import React, { Component } from 'react'
import { Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';

const url= localStorage.getItem('url')+"/api/palabra/";

export default class PalabraModal extends Component {
    
    state ={
        palabra: {
            id_palabra: '',
            palabra: '',
            significado : '',
            id_proyecto: ''
        },
        errorInputPalabra: '',
        errorInputSignificado: ''
    }

    componentWillReceiveProps(next_props) {
        this.setState({ palabra: this.props.palabra});
    }

    initErrores = () => {
        this.setState({
            errorInputPalabra: '',
            errorInputSignificado: ''
        })
    }

    validar = () => {
        let salida = true;

        if(this.state.palabra.palabra === ""){
            this.setState({errorInputPalabra : "Debe ingresar un nombre de una nueva palabra"})
            salida = false;
        }
        if(this.state.palabra.significado === ""){
            this.setState({errorInputSignificado : "Debe ingresar un significado para la palabra"})
            salida = false;
        }

        return salida;
    }

    guardarPalabra = async (palabra) => {

        const token = localStorage.getItem('token');
        var urlGuardar = url + 'guardar';
        
        if(this.validar()){
            await axios.post(urlGuardar, palabra, {headers: {"Authorization": `Bearer  ${token}`}})
            .then(response => {
                (this.props.estadoEditar) ? this.props.cambiarEstadoEditar() : this.props.cambiarEstadoInsertar();
                this.props.getPalabras();
                console.log(response);
            })
            this.initErrores();
        }
    }

    changeHandler = async (e) => {
        var x = 0;
        if(e.target.name==='significado'){
            x=1;
        }
        await this.setState({
            palabra : {
              ...this.state.palabra, [e.target.name]: e.target.value
            }
        });
        if(x===1){
            var caract = this.state.palabra.significado.length;
            if(caract<500){
                document.getElementById("span_contador").innerHTML = '<span style="color: grey;">' + caract + '/500</span>';
            }else{
                document.getElementById("span_contador").innerHTML = '<span style="color: red;">' + caract + '/500</span>';
            }
        }
    }

    render(){
        return(
            <React.Fragment>
                <Modal isOpen = {this.props.estadoInsertar || this.props.estadoEditar} toggle={() => {(this.props.estadoInsertar) ? this.props.cambiarEstadoInsertar() : this.props.cambiarEstadoEditar(); this.initErrores()}}>
                    <ModalHeader style={{display : 'block'}}>
                        <span>{(this.props.estadoInsertar) ? 'Ingresar Palabra' :'Editar Palabra'}</span>
                        
                        <span style={{cursor : 'pointer' , float : 'right'}} onClick={() => {(this.props.estadoInsertar) ? this.props.cambiarEstadoInsertar() : this.props.cambiarEstadoEditar(); this.initErrores()}}>X</span>
                    </ModalHeader>
                    <ModalBody>
                        <div className="form-group">
                            <label htmlFor="palabra">Palabra</label>
                            <input className={(this.state.errorInputPalabra)? "form-control is-invalid" : "form-control"} type="text" name="palabra" id="palabra" onChange={this.changeHandler} value={this.state.palabra.palabra} onClick={() => {this.setState({errorInputPalabra : ''})}}/>
                            <div class="invalid-feedback" style={{display: 'block'}}>
                                {this.state.errorInputPalabra}
                            </div>
                            <br/>
                            <label htmlFor="significado">Significado</label>
                            <p><textarea className={(this.state.errorInputSignificado)? "form-control is-invalid" : "form-control"} type="text" name="significado" id="significado" maxLength="500" onChange={this.changeHandler} value={this.state.palabra.significado} onClick={() => {this.setState({errorInputSignificado : ''})}}/></p>

                            {(this.props.estadoInsertar)?
                                <p id="span_contador" style={{float:'right'}}><span style={{color: 'gray'}}>0/500</span></p>
                                :
                                <p id="span_contador" style={{float:'right'}}><span style={{color: 'gray'}}>{this.state.palabra.significado.length}/500</span></p>
                            }
                            <div class="invalid-feedback" style={{display: 'block'}}>
                                {this.state.errorInputSignificado}
                            </div>
                        </div>
                    </ModalBody>
                    <ModalFooter>
                        <button className="btn btn-success" onClick={() => this.guardarPalabra(this.state.palabra)}> {(this.props.estadoInsertar)? "Insertar" : "Actualizar"}</button>
                        <button className="btn btn-danger" onClick={() => {(this.props.estadoInsertar) ? this.props.cambiarEstadoInsertar() : this.props.cambiarEstadoEditar(); this.initErrores()}} >Cancelar</button>
                    </ModalFooter>
                </Modal>

            </React.Fragment>
        );
    }
}