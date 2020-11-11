import Axios from 'axios';
import React, { Component } from 'react'
import { Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import ChipsImpactoDirecto from './ChipsImpactoDirecto';

class PropuestaCambioModal extends Component{
    state={
        subProyectos: [],
        propuestaCambio: {
            id_propuestaCambio: 0,
            nombre: '',
            id_subproyecto: 0,
            fecha_peticion: 0,
            id_usuario: '',
            descripcion: '',
            justificacion: '',
            alternativas: '',
            consecuencias_rechazo: '',
            fecha_resolucion: '',
            comentarios: '',
            estado: 'Pendiente'
        },
        requerimientosImpactoDirecto : []
    }

    componentWillReceiveProps(next_props){
        this.setState({propuestaCambio: this.props.propuestaCambio});
    }

    componentDidMount(){
        this.index();
    }

    index=async()=>{
        const token = localStorage.getItem('token');
        const id_p = this.props.id_proyecto;
        await Axios.get(`http://localhost:8080/api/subProyecto/pertenecientes/${id_p}`,{headers: {"Authorization": `Bearer ${token}`}})
        .then(response=>{
            this.setState({
                subProyectos: response.data
            });
        })
    }

    guardar=async()=>{
        const token = localStorage.getItem('token');
        await Axios.post('http://localhost:8080/api/propuestacambio/guardar/',{
            nombre: this.state.propuestaCambio.nombre,
            id_subproyecto: this.state.propuestaCambio.id_subproyecto,
            fecha_peticion: this.state.propuestaCambio.fecha_peticion,
            id_usuario: this.state.propuestaCambio.id_usuario,
            descripcion: this.state.propuestaCambio.descripcion,
            justificacion: this.state.propuestaCambio.justificacion,
            alternativas: this.state.propuestaCambio.alternativas,
            consecuencias_rechazo: this.state.propuestaCambio.consecuencias_rechazo,
            fecha_resolucion: this.state.propuestaCambio.fecha_resolucion,
            comentarios: this.state.propuestaCambio.comentarios,
            estado: this.state.propuestaCambio.estado
        },{headers: {"Authorization": `Bearer ${token}`}})
        .then(response=>{
            this.props.modalInsertar();
            this.props.index();
            this.insertarImpactoDirecto(response.data.id_propuestaCambio);
        })
    }

    insertarImpactoDirecto=async(id_propuestaCambio)=>{
        const token = localStorage.getItem('token');

        for (let index = 0; index < this.state.requerimientosImpactoDirecto.length; index++) {
            await Axios.post('http://localhost:8080/api/impacto_directo/guardar/',{
                id_propuesta_cambio : id_propuestaCambio,
                id_requerimiento : this.state.requerimientosImpactoDirecto[index]
            },{headers:{"Authorization": `Bearer ${token}`}})
        }

        this.setState({
            requerimientosImpactoDirecto: []
        });
    }

    guardarActualizacion=()=>{
        const token = localStorage.getItem('token');
        Axios.post('http://localhost:8080/api/propuestacambio/editar/',this.state.propuestaCambio, {headers: {"Authorization": `Bearer ${token}`}})
        .then(response=>{
            this.props.modalInsertar();
            this.props.index();
            this.actualizarImpactoDirecto();
        })
    }

    actualizarImpactoDirecto=()=>{
        const token = localStorage.getItem('token');
        var existentes = [];
        var original = [];
        Axios.get(`http://localhost:8080/api/impacto_directo/obtener/${this.state.propuestaCambio.id_propuestaCambio}`, {headers: {"Authorization": `Bearer ${token}`}})
        .then(response=>{
            original = response.data;
            for (let index = 0; index < response.data.length; index++) {
                existentes = [...existentes, response.data[index].id_requerimiento.toString()];
            }

            //eliminar
            for (let index = 0; index < existentes.length; index++) {
                if(!this.state.requerimientosImpactoDirecto.includes(existentes[index])){
                    Axios.delete(`http://localhost:8080/api/impacto_directo/eliminar/${original[index].id_impacto_directo}`, {headers: {"Authorization": `Bearer ${token}`}})
                    .then(response=>{
                    });
                }
            }

            //insertar
            for (let index = 0; index < this.state.requerimientosImpactoDirecto.length; index++) {
                if(!existentes.includes(this.state.requerimientosImpactoDirecto[index])){
                    Axios.post('http://localhost:8080/api/impacto_directo/guardar/',{
                        id_propuesta_cambio : this.state.propuestaCambio.id_propuestaCambio,
                        id_requerimiento : this.state.requerimientosImpactoDirecto[index]
                    },{headers: {"Authorization": `Bearer ${token}`}})
                }
            }
        })
    }

    changeHandler=async(e)=>{
        await this.setState({
            propuestaCambio:{
                ...this.state.propuestaCambio, [e.target.name]: e.target.value
            }
        });
    }

    insertarChip=(requerimiento)=>{
        this.setState({
            requerimientosImpactoDirecto: [ ...this.state.requerimientosImpactoDirecto, requerimiento],
        });
    }

    eliminarChip=(requerimiento)=>{
        const filtrado = this.state.requerimientosImpactoDirecto.filter(item => item!==requerimiento);        
        this.setState({
            requerimientosImpactoDirecto : filtrado
        });
    }

    render(){
        return(
            <React.Fragment>
                <Modal isOpen={this.props.estadoModalInsertar} toggle={()=>this.props.modalInsertar()}>
                    <ModalHeader style={{display:'block'}}>
                        <span>{(this.props.tipoModal==='insertar') ? 'Ingresar Propuesta de Cambio' :'Editar Propuesta de Cambio'}</span>

                        <span style={{cursor:'pointer', float:'right'}} onClick={()=>{this.props.modalInsertar()}}>X</span>
                    </ModalHeader>
                    <ModalBody>
                        <div className="form-group">
                            <label htmlFor="id_propuestaCambio">ID</label>
                            <input className="form-control" type="text" name="id_propuestaCambio" id="id_propuestaCambio" value={this.state.propuestaCambio.id_propuestaCambio} readOnly/>
                            <br/>
                            <label htmlFor="nombre">Nombre</label>
                            <input className="form-control" type="text" name="nombre" id="nombre" onChange={this.changeHandler} value={this.state.propuestaCambio.nombre} />
                            <br/>
                            <label htmlFor="id_modulo">ID Modulo</label>
                            <select name="id_subproyecto" id="id_subproyecto" className="form-control" value={this.state.propuestaCambio.id_subproyecto} onChange={this.changeHandler}>
                                <option value="">Seleccione un SubProyecto</option>
                                {this.state.subProyectos.map(subp=>{
                                    return(
                                        <option value={subp.id_subProyecto}>{subp.nombre_subProyecto}</option>
                                    );
                                })}
                            </select>
                            <br/>
                            <label htmlFor="fecha_peticion">Fecha de Peticion</label>
                            <input className="form-control" type="date" name="fecha_peticion" id="fecha_peticion" onChange={this.changeHandler} value={this.state.propuestaCambio.fecha_peticion} />
                            <br/>
                            <label htmlFor="id_usuario">Autor</label>
                            <input className="form-control" type="number" name="id_usuario" id="id_usuario" value={this.state.propuestaCambio.id_usuario} readOnly/>
                            <br/>
                            <label htmlFor="descripcion">Descripcion</label>
                            <input className="form-control" type="text" name="descripcion" id="descripcion" onChange={this.changeHandler} value={this.state.propuestaCambio.descripcion} />
                            <br/>
                            <ChipsImpactoDirecto
                                id_propuestaCambio = {this.state.propuestaCambio.id_propuestaCambio}
                                subProyectos = {this.state.subProyectos}
                                insertarChip = {this.insertarChip}
                                eliminarChip = {this.eliminarChip}
                            />
                            <br/>
                            <label htmlFor="justificacion">Justificacion</label>
                            <input className="form-control" type="text" name="justificacion" id="justificacion" onChange={this.changeHandler} value={this.state.propuestaCambio.justificacion} />
                            <br/>
                            <label htmlFor="alternativas">Alternativas</label>
                            <input className="form-control" type="text" name="alternativas" id="alternativas" onChange={this.changeHandler} value={this.state.propuestaCambio.alternativas} />
                            <br/>
                            <label htmlFor="consecuencias_rechazo">Consecuencias Rechazo</label>
                            <input className="form-control" type="text" name="consecuencias_rechazo" id="consecuencias_rechazo" onChange={this.changeHandler} value={this.state.propuestaCambio.consecuencias_rechazo} />
                            <br/>
                            <label htmlFor="fecha_resolucion">Fecha de Resolucion</label>
                            <input className="form-control" type="date" name="fecha_resolucion" id="fecha_resolucion" onChange={this.changeHandler} value={this.state.propuestaCambio.fecha_resolucion} />
                            <br/>
                            <label htmlFor="comentarios">Comentarios</label>
                            <input className="form-control" type="text" name="comentarios" id="comentarios" onChange={this.changeHandler} value={this.state.propuestaCambio.comentarios} />
                            <br/>
                            <label htmlFor="estado">Estado</label>
                            <input className="form-control" type="text" name="estado" id="estado" value={this.state.propuestaCambio.estado} readOnly/>
                            <br/>
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
                        <button className="btn btn-danger" onClick={()=>{this.props.modalInsertar()}}>Cancelar</button>
                    </ModalFooter>
                </Modal>

            </React.Fragment>
        );
    }

}

export default PropuestaCambioModal;