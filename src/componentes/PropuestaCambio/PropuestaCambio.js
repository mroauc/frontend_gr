import Axios from 'axios';
import React, {Component} from 'react';
import { Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';

class PropuestaCambio extends Component{

    state={
        propuestas: [],
        modalInsertar: false,
        modalEliminar: false,
        modalVista: false,
        tipoModal: '',
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

    index=()=>{
        Axios.get('http://localhost:8080/api/propuestacambio/')
        .then(response=>{
            this.setState({
                propuestas: response.data
            });
        })
    }

    componentDidMount(){
        this.index();
    }

    modalInsertar=()=>{
        this.setState({
            modalInsertar: !this.state.modalInsertar,
            tipoModal: 'insertar'
        });
    }

    guardar=async()=>{
        await Axios.post('http://localhost:8080/api/propuestacambio/guardar/',{
            nombre: this.state.nombre,
            id_modulo: this.state.id_modulo,
            fecha_peticion: this.state.fecha_peticion,
            id_usuario: this.state.id_usuario,
            descripcion: this.state.descripcion,
            justificacion: this.state.justificacion,
            alternativas: this.state.alternativas,
            consecuencias_rechazo: this.state.consecuencias_rechazo,
            fecha_resolucion: this.state.fecha_resolucion,
            comentarios: this.state.comentarios,
            estado: this.state.estado
        })
        .then(response=>{
            this.modalInsertar();
            this.index();
        })
    }

    editar=(propuesta)=>{
        this.setState({
            id_propuestaCambio: propuesta.id_propuestaCambio,
            nombre: propuesta.nombre,
            id_modulo: propuesta.id_modulo,
            fecha_peticion: propuesta.fecha_peticion,
            id_usuario: propuesta.id_usuario,
            descripcion: propuesta.descripcion,
            justificacion: propuesta.justificacion,
            alternativas: propuesta.alternativas,
            consecuencias_rechazo: propuesta.consecuencias_rechazo,
            fecha_resolucion: propuesta.fecha_resolucion,
            comentarios: propuesta.comentarios,
            estado: propuesta.estado            
        });
        this.modalActualizar();
    }

    verPropuesta=(propuesta)=>{
        this.setState({
            id_propuestaCambio: propuesta.id_propuestaCambio,
            nombre: propuesta.nombre,
            id_modulo: propuesta.id_modulo,
            fecha_peticion: propuesta.fecha_peticion,
            id_usuario: propuesta.id_usuario,
            descripcion: propuesta.descripcion,
            justificacion: propuesta.justificacion,
            alternativas: propuesta.alternativas,
            consecuencias_rechazo: propuesta.consecuencias_rechazo,
            fecha_resolucion: propuesta.fecha_resolucion,
            comentarios: propuesta.comentarios,
            estado: propuesta.estado         
        });
        this.modalVer();
    }

    modalVer=()=>{
        this.setState({
            modalVista: !this.state.modalVista
        });
    }

    modalActualizar=()=>{
        this.setState({
            modalInsertar: !this.state.modalInsertar,
            tipoModal: 'actualizar'
        });
    }

    guardarActualizacion=()=>{
        Axios.post('http://localhost:8080/api/propuestacambio/editar/',{
            id_propuestaCambio: this.state.id_propuestaCambio,
            nombre: this.state.nombre,
            id_modulo: this.state.id_modulo,
            fecha_peticion: this.state.fecha_peticion,
            id_usuario: this.state.id_usuario,
            descripcion: this.state.descripcion,
            justificacion: this.state.justificacion,
            alternativas: this.state.alternativas,
            consecuencias_rechazo: this.state.consecuencias_rechazo,
            fecha_resolucion: this.state.fecha_resolucion,
            comentarios: this.state.comentarios,
            estado: this.state.estado            
        })
        .then(response=>{
            this.modalInsertar();
            this.index();
        })
    }

    eliminar=()=>{
        Axios.delete(`http://localhost:8080/api/propuestacambio/eliminar/${this.state.id_propuestaCambio}`)
        .then(response=>{
            this.setState({modalEliminar:false});
            this.index();
        })
    }

    render(){
        return(
            <div className="propuestaCambio">
                <h2>Propuestas de Cambio</h2>
                <br/>
                <button className="btn btn-success" onClick={()=>{this.setState({id_propuestaCambio:0,nombre:'',id_modulo:0,fecha_peticion:'',id_usuario:'',descripcion:'',justificacion:'',alternativas:'',consecuencias_rechazo:'',fecha_resolucion:'',comentarios:'',estado:'Pendiente'}); this.modalInsertar()}}>Insertar</button>
                <br/><br/>
                <table className="table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Nombre</th>
                            <th>Fecha Peticion</th>
                            <th>Modulo</th>
                            <th>Estado</th>
                            <th>Ver</th>
                            <th>Editar</th>
                            <th>Eliminar</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.state.propuestas.map(propuesta=>
                            <tr key={propuesta.id_propuestaCambio}>
                                <td>{propuesta.id_propuestaCambio}</td>
                                <td>{propuesta.nombre}</td>
                                <td>{propuesta.fecha_peticion}</td>
                                <td>{propuesta.id_modulo}</td>
                                <td>{propuesta.estado}</td>
                                <td>
                                    <button className="btn btn-success" onClick={()=>this.verPropuesta(propuesta)}>Ver</button>
                                </td>
                                <td>
                                    <button className="btn btn-warning" onClick={()=>this.editar(propuesta)}>Editar</button>
                                </td>
                                <td>
                                    <button className="btn btn-danger" onClick={()=>this.setState({modalEliminar:true, id_propuestaCambio: propuesta.id_propuestaCambio})}>Eliminar</button>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>

                <Modal isOpen={this.state.modalInsertar}>
                    <ModalHeader style={{display:'block'}}>
                        <span style={{float: 'right'}} onClick={()=>{this.modalInsertar()}}>X</span>
                    </ModalHeader>
                    <ModalBody>
                        <div className="form-group">
                            <label htmlFor="id_propuestaCambio">ID</label>
                            <input className="form-control" type="text" name="id_propuestaCambio" id="id_propuestaCambio" value={this.state.id_propuestaCambio} readOnly/>
                            <br/>
                            <label htmlFor="nombre">Nombre</label>
                            <input className="form-control" type="text" name="nombre" id="nombre" onChange={(e)=>this.setState({nombre:e.target.value})} value={this.state.nombre} />
                            <br/>
                            <label htmlFor="id_modulo">ID Modulo</label>
                            <input className="form-control" type="text" name="id_modulo" id="id_modulo" onChange={(e)=>this.setState({id_modulo:e.target.value})} value={this.state.id_modulo} />
                            <br/>
                            <label htmlFor="fecha_peticion">Fecha de Peticion</label>
                            <input className="form-control" type="date" name="fecha_peticion" id="fecha_peticion" onChange={(e)=>this.setState({fecha_peticion:e.target.value})} value={this.state.fecha_peticion} />
                            <br/>
                            <label htmlFor="id_usuario">Autor</label>
                            <input className="form-control" type="text" name="id_usuario" id="id_usuario" onChange={(e)=>this.setState({id_usuario:e.target.value})} value={this.state.id_usuario} />
                            <br/>
                            <label htmlFor="descripcion">Descripcion</label>
                            <input className="form-control" type="text" name="descripcion" id="descripcion" onChange={(e)=>this.setState({descripcion:e.target.value})} value={this.state.descripcion} />
                            <br/>
                            <label htmlFor="justificacion">Justificacion</label>
                            <input className="form-control" type="text" name="justificacion" id="justificacion" onChange={(e)=>this.setState({justificacion:e.target.value})} value={this.state.justificacion} />
                            <br/>
                            <label htmlFor="alternativas">Alternativas</label>
                            <input className="form-control" type="text" name="alternativas" id="alternativas" onChange={(e)=>this.setState({alternativas:e.target.value})} value={this.state.alternativas} />
                            <br/>
                            <label htmlFor="consecuencias_rechazo">Consecuencias Rechazo</label>
                            <input className="form-control" type="text" name="consecuencias_rechazo" id="consecuencias_rechazo" onChange={(e)=>this.setState({consecuencias_rechazo:e.target.value})} value={this.state.consecuencias_rechazo} />
                            <br/>
                            <label htmlFor="fecha_resolucion">Fecha de Resolucion</label>
                            <input className="form-control" type="date" name="fecha_resolucion" id="fecha_resolucion" onChange={(e)=>this.setState({fecha_resolucion:e.target.value})} value={this.state.fecha_resolucion} />
                            <br/>
                            <label htmlFor="comentarios">Comentarios</label>
                            <input className="form-control" type="text" name="comentarios" id="comentarios" onChange={(e)=>this.setState({comentarios:e.target.value})} value={this.state.comentarios} />
                            <br/>
                            <label htmlFor="estado">Estado</label>
                            <input className="form-control" type="text" name="estado" id="estado" value={this.state.estado} readOnly/>
                            <br/>
                        </div>
                    </ModalBody>
                    <ModalFooter>
                        {this.state.tipoModal==='insertar'?
                            <button className="btn btn-success" onClick={()=>this.guardar()}>
                                Insertar
                            </button>
                            :
                            <button className="btn btn-success" onClick={()=>this.guardarActualizacion()}>
                                Actualizar
                            </button>
                        }
                        <button className="btn btn-danger" onClick={()=>{this.modalInsertar()}}>Cancelar</button>
                    </ModalFooter>
                </Modal>

                <Modal isOpen={this.state.modalEliminar}>
                    <ModalBody>
                        ¿Seguro que desea eliminar la propuesta de cambio?
                    </ModalBody>
                    <ModalFooter>
                        <button className="btn btn-danger" onClick={()=>this.eliminar()}>Si</button>
                        <button className="btn btn-secundary" onClick={()=>this.setState({modalEliminar:false})}>No</button>
                    </ModalFooter>
                </Modal>
                
                <Modal isOpen={this.state.modalVista}>
                    <ModalHeader style={{display:'block'}}>
                        <span style={{float: 'right'}} onClick={()=>{this.modalVer()}}>X</span>
                    </ModalHeader>
                    <ModalBody>
                        <div className="form-group">
                            <label htmlFor="id_propuestaCambio">ID</label>
                            <input className="form-control" type="text" name="id_propuestaCambio" id="id_propuestaCambio" value={this.state.id_propuestaCambio} readOnly/>
                            <br/>
                            <label htmlFor="nombre">Nombre</label>
                            <input className="form-control" type="text" name="nombre" id="nombre" value={this.state.nombre} readOnly />
                            <br/>
                            <label htmlFor="id_modulo">ID Modulo</label>
                            <input className="form-control" type="text" name="id_modulo" id="id_modulo" value={this.state.id_modulo} readOnly />
                            <br/>
                            <label htmlFor="fecha_peticion">Fecha de Peticion</label>
                            <input className="form-control" type="date" name="fecha_peticion" id="fecha_peticion" value={this.state.fecha_peticion} readOnly />
                            <br/>
                            <label htmlFor="id_usuario">Autor</label>
                            <input className="form-control" type="text" name="id_usuario" id="id_usuario" value={this.state.id_usuario} readOnly />
                            <br/>
                            <label htmlFor="descripcion">Descripcion</label>
                            <input className="form-control" type="text" name="descripcion" id="descripcion" value={this.state.descripcion} readOnly />
                            <br/>
                            <label htmlFor="justificacion">Justificacion</label>
                            <input className="form-control" type="text" name="justificacion" id="justificacion" value={this.state.justificacion} readOnly />
                            <br/>
                            <label htmlFor="alternativas">Alternativas</label>
                            <input className="form-control" type="text" name="alternativas" id="alternativas" value={this.state.alternativas} readOnly />
                            <br/>
                            <label htmlFor="consecuencias_rechazo">Consecuencias Rechazo</label>
                            <input className="form-control" type="text" name="consecuencias_rechazo" id="consecuencias_rechazo" value={this.state.consecuencias_rechazo} readOnly />
                            <br/>
                            <label htmlFor="fecha_resolucion">Fecha de Resolucion</label>
                            <input className="form-control" type="date" name="fecha_resolucion" id="fecha_resolucion" value={this.state.fecha_resolucion} readOnly />
                            <br/>
                            <label htmlFor="comentarios">Comentarios</label>
                            <input className="form-control" type="text" name="comentarios" id="comentarios" value={this.state.comentarios} readOnly />
                            <br/>
                            <label htmlFor="estado">Estado</label>
                            <input className="form-control" type="text" name="estado" id="estado" value={this.state.estado} readOnly/>
                            <br/>
                        </div>
                    </ModalBody>
                </Modal>
            </div>
        );
    }
}

export default PropuestaCambio;