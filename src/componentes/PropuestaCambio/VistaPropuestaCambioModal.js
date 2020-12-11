import React, { Component } from 'react'
import { Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';

class VistaPropuestaCambioModal extends Component{
    state={
        propuestaCambio: {
            id_propuestaCambio: 0,
            nombre: '',
            id_modulo: 0,
            fecha_peticion: 0,
            id_usuario: '',
            descripcion: '',
            justificacion: '',
            alternativas: '',
            consecuencias_rechazo: '',
            fecha_resolucion: '',
            comentarios: '',
            estado: 'Pendiente'
        }
    }

    componentWillReceiveProps(next_props){
        this.setState({propuestaCambio: this.props.propuestaCambio});
    }

    render(){
        return(
            <React.Fragment>
                <Modal isOpen={this.props.modalVista} toggle={()=>{this.props.estadoModalVista()}}>
                    <ModalHeader style={{display:'block'}}>
                    <span>Vista Propuesta de Cambio</span>
                        <span style={{cursor:'pointer', float:'right'}} onClick={()=>{this.props.estadoModalVista()}}>X</span>
                    </ModalHeader>
                    <ModalBody>
                        <div className="form-group">
                            <label htmlFor="id_propuestaCambio">ID</label>
                            <input className="form-control" type="text" name="id_propuestaCambio" id="id_propuestaCambio" value={this.state.propuestaCambio.id_propuestaCambio} readOnly/>
                            <br/>
                            <label htmlFor="nombre">Nombre</label>
                            <input className="form-control" type="text" name="nombre" id="nombre" value={this.state.propuestaCambio.nombre} readOnly />
                            <br/>
                            <label htmlFor="id_modulo">ID Modulo</label>
                            <input className="form-control" type="text" name="id_modulo" id="id_modulo" value={this.state.propuestaCambio.id_subproyecto} readOnly />
                            <br/>
                            <label htmlFor="fecha_peticion">Fecha de Peticion</label>
                            <input className="form-control" type="date" name="fecha_peticion" id="fecha_peticion" value={this.state.propuestaCambio.fecha_peticion} readOnly />
                            <br/>
                            <label htmlFor="id_usuario">Autor</label>
                            <input className="form-control" type="text" name="id_usuario" id="id_usuario" value={this.state.propuestaCambio.id_usuario} readOnly />
                            <br/>
                            <label htmlFor="descripcion">Descripcion</label>
                            <input className="form-control" type="text" name="descripcion" id="descripcion" value={this.state.propuestaCambio.descripcion} readOnly />
                            <br/>
                            <label htmlFor="justificacion">Justificacion</label>
                            <input className="form-control" type="text" name="justificacion" id="justificacion" value={this.state.propuestaCambio.justificacion} readOnly />
                            <br/>
                            <label htmlFor="alternativas">Alternativas</label>
                            <input className="form-control" type="text" name="alternativas" id="alternativas" value={this.state.propuestaCambio.alternativas} readOnly />
                            <br/>
                            <label htmlFor="consecuencias_rechazo">Consecuencias Rechazo</label>
                            <input className="form-control" type="text" name="consecuencias_rechazo" id="consecuencias_rechazo" value={this.state.propuestaCambio.consecuencias_rechazo} readOnly />
                            <br/>
                            <label htmlFor="fecha_resolucion">Fecha de Resolucion</label>
                            <input className="form-control" type="date" name="fecha_resolucion" id="fecha_resolucion" value={this.state.propuestaCambio.fecha_resolucion} readOnly />
                            <br/>
                            <label htmlFor="comentarios">Comentarios</label>
                            <input className="form-control" type="text" name="comentarios" id="comentarios" value={this.state.propuestaCambio.comentarios} readOnly />
                            <br/>
                            <label htmlFor="estado">Estado</label>
                            <input className="form-control" type="text" name="estado" id="estado" value={this.state.propuestaCambio.estado} readOnly/>
                            <br/>
                        </div>
                    </ModalBody>
                    <ModalFooter>
                        <button className="btn btn-danger" onClick={()=>{this.props.estadoModalVista()}}>Cancelar</button>
                        
                    </ModalFooter>
                </Modal>
            </React.Fragment>
        );
    }
}

export default VistaPropuestaCambioModal;