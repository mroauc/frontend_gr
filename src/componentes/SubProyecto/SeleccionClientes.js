import React, { Component } from 'react'
import { Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import FiltroUsuario from '../Usuario/FiltroUsuario';

export default class SeleccionClientes extends Component{
    state={
        clientes: [],
        valoresInput: []
    }

    componentWillReceiveProps(props){
        this.setState({clientes: props.clientes});
        this.setState({valoresInput: props.valoresInput});
    }

    BuscarCliente=(e)=>{
        FiltroUsuario(this.props.clientes, e.target.value, this.cambiarClientes);
    }

    cambiarClientes=(nuevosClientes)=>{
        this.setState({clientes: nuevosClientes});
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
        this.props.modalClientesAsociados();
    }

    render(){
        return(
            <React.Fragment>

                <Modal isOpen = {this.props.abrir} toggle={() => {this.cerrar()}} centered>
                    <ModalHeader style={{display : 'block'}}>
                        <span>Seleccionar Clientes Asociados</span>
                        <span style={{cursor : 'pointer' , float : 'right'}} onClick={() => {this.cerrar()}}>X</span>
                    </ModalHeader>
                    <ModalBody>
                        <div><input className="form-control" placeholder="Buscar" onChange={this.BuscarCliente}/></div>
                        <div className="form-group" className="grupoCheckbox">
                            {this.state.clientes.map(cliente => {
                                return(
                                    <div key={cliente.id}>
                                        <input  id={cliente.id} name={cliente.id.toString()} type="checkbox" className="inputCheckbox" onChange={this.changeHandler} checked={this.state.valoresInput.includes(cliente.id.toString())}/>
                                        <label >{cliente.nombre}</label><br/>
                                    </div>
                                )
                            })}
                        </div>
                    </ModalBody>
                    <ModalFooter>
                        <button className="btn btn-success" onClick= {() => {this.props.insertarClientes(this.state.valoresInput); this.cerrar()}}>Seleccionar</button>
                        <button className="btn btn-danger" onClick={() => {this.cerrar()}}>Cancelar</button>
                    </ModalFooter>
                </Modal>

            </React.Fragment>
        );
    }
}