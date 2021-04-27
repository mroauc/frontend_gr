import React, { Component } from 'react'
import { Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';


class ModalVerPalabra extends Component {
    
    state ={
        palabra: {
            id_palabra: '',
            palabra: '',
            significado : '',
            id_proyecto: ''
        },
    }

    componentWillReceiveProps(next_props) {
        this.setState({ palabra: this.props.palabra});
    }

    render(){
        return(
            <React.Fragment>
                <Modal isOpen = {this.props.estadoVer} toggle={() => this.props.modalEstadoVer()}>
                    <ModalHeader style={{display : 'block'}}>
                        <span>Ver Palabra</span>
                        <span style={{cursor : 'pointer' , float : 'right'}} onClick={() => this.props.modalEstadoVer()}>X</span>
                    </ModalHeader>
                    <ModalBody>
                        <div className="form-group">
                            <label htmlFor="palabra">Palabra</label>
                            <input className="form-control" type="text" name="palabra" id="palabra" value={this.state.palabra.palabra} readOnly/>
                            <br/>
                            <label htmlFor="significado">Significado</label>
                            <p><textarea className="form-control" type="text" name="significado" id="significado" maxLength="500" value={this.state.palabra.significado} readOnly/></p>
                            <br/>
                        </div>
                    </ModalBody>
                    <ModalFooter>
                        <button className="btn btn-danger" onClick={() => {this.props.modalEstadoVer()}} >Cerrar</button>
                    </ModalFooter>
                </Modal>
            </React.Fragment>
        );
    }
}

export default ModalVerPalabra;