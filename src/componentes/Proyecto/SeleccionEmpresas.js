import React, { Component } from 'react'
import { Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import FiltroEmpresa from '../Empresa/FiltroEmpresa';

export default class SeleccionEmpresas extends Component{
    state={
        empresas: [],
        valoresInput: []
    }

    componentWillReceiveProps(props){
        this.setState({empresas: props.empresas});
        this.setState({valoresInput: props.valoresInput});
    }

    BuscarEmpresa=(e)=>{
        FiltroEmpresa(this.props.empresas, e.target.value, this.cambiarEmpresas);
    }

    cambiarEmpresas=(nuevasEmpresas)=>{
        this.setState({empresas: nuevasEmpresas});
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
        this.props.modalEmpresasAsociadas();
    }

    render(){
        return(
            <React.Fragment>

                <Modal isOpen = {this.props.abrir} toggle={() => {this.cerrar()}} centered>
                    <ModalHeader style={{display : 'block'}}>
                        <span>Seleccionar Empresas Asociadas</span>
                        <span style={{cursor : 'pointer' , float : 'right'}} onClick={() => {this.cerrar()}}>X</span>
                    </ModalHeader>
                    <ModalBody>
                        <div><input className="form-control" placeholder="Buscar" onChange={this.BuscarEmpresa}/></div>
                        <div className="form-group" className="grupoCheckbox">
                            {this.state.empresas.map(empresa => {
                                return(
                                    <div key={empresa.id_empresa}>
                                        <input  id={empresa.id_empresa} name={empresa.id_empresa.toString()} type="checkbox" className="inputCheckbox" onChange={this.changeHandler} checked={this.state.valoresInput.includes(empresa.id_empresa.toString())}/>
                                        <label >{empresa.razon_social}</label><br/>
                                    </div>
                                )
                            })}
                        </div>
                    </ModalBody>
                    <ModalFooter>
                        <button className="btn btn-success" onClick= {() => {this.props.insertarRelaciones(this.state.valoresInput); this.cerrar()}}>Seleccionar</button>
                        <button className="btn btn-danger" onClick={() => {this.cerrar()}}>Cancelar</button>
                    </ModalFooter>
                </Modal>

            </React.Fragment>
        );
    }
}