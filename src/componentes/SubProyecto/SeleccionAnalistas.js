import React, { Component } from 'react'
import { Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import FiltroUsuario from '../Usuario/FiltroUsuario';

export default class SeleccionAnalistas extends Component{
    state={
        analistas: [],
        valoresInput: []
    }

    componentWillReceiveProps(props){
        this.setState({analistas: props.analistas});
        this.setState({valoresInput: props.valoresInput});
    }

    BuscarAnalista=(e)=>{
        FiltroUsuario(this.props.analistas, e.target.value, this.cambiarAnalistas)
    }

    cambiarAnalistas=(nuevosAnalistas)=>{
        this.setState({analistas: nuevosAnalistas});
    }

    changeHandler=async(e)=>{
        let copiaValoresInput = [...this.state.valoresInput];
        if(e.target.checked === true){
            copiaValoresInput.push(e.target.name);
            await this.setState({valoresInput : copiaValoresInput});
        }
        else{
            const valoresFinal =  copiaValoresInput.filter(item => item !== e.target.name);
            await this.setState({valoresInput : valoresFinal});
        }
    }

    cerrar=async()=>{
        await this.setState({valoresInput: []});
        this.props.modalAnalistasAsociados();
    }

    render(){
        return(
            <React.Fragment>

                <Modal isOpen = {this.props.abrir} toggle={() => {this.cerrar()}} centered>
                    <ModalHeader style={{display : 'block'}}>
                        <span>Seleccionar Analistas Asociados</span>
                        <span style={{cursor : 'pointer' , float : 'right'}} onClick={() => {this.cerrar()}}>X</span>
                    </ModalHeader>
                    <ModalBody>
                        <div><input className="form-control" placeholder="Buscar" onChange={this.BuscarAnalista}/></div>
                        <div className="form-group" className="grupoCheckbox">
                            {this.state.analistas.map(analista => {
                                return(
                                    <div key={analista.id}>
                                        <input  id={analista.id} name={analista.id.toString()} type="checkbox" className="inputCheckbox" onChange={this.changeHandler} checked={this.state.valoresInput.includes(analista.id.toString())}/>
                                        <label >{analista.nombre}</label><br/>
                                    </div>
                                )
                            })}
                        </div>
                    </ModalBody>
                    <ModalFooter>
                        <button className="btn btn-success" onClick= {() => {this.props.insertarAnalistas(this.state.valoresInput); this.cerrar()}}>Seleccionar</button>
                        <button className="btn btn-danger" onClick={() => {this.cerrar()}}>Cancelar</button>
                    </ModalFooter>
                </Modal>

            </React.Fragment>
        );
    }
}