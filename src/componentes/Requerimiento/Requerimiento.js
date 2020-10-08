import Axios from 'axios';
import React, {Component} from 'react';
import { Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';

class Requerimiento extends Component{

    state={
        requerimientos: [],
        modalInsertar: false,
        modalEliminar: false,
        tipoModal: '',
        id_requerimiento: 0,
        descripcion: '',
        id_usuario: 0,
        id_subProyecto: 0,
        created_at: '',
        prioridad: '',
        estado: '',
        categoria: '',
        id_template: 0
    }

    index=()=>{
        Axios.get('http://localhost:8080/api/requerimiento/')
        .then(response=>{
            this.setState({
                requerimientos: response.data
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
        await Axios.post('http://localhost:8080/api/requerimiento/guardar/',{
            descripcion: this.state.descripcion,
            id_usuario: this.state.id_usuario,
            id_subProyecto: this.state.id_subProyecto,
            created_at: this.state.created_at,
            prioridad: this.state.prioridad,
            estado: this.state.estado,
            categoria: this.state.categoria,
            id_template: this.state.id_template
        })
        .then(response=>{
            this.modalInsertar();
            this.index();
        })
    }

    editar=(requerimiento)=>{
        this.setState({
            id_requerimiento: requerimiento.id_requerimiento,
            descripcion: requerimiento.descripcion,
            id_usuario: requerimiento.id_usuario,
            id_subProyecto: requerimiento.id_subProyecto,
            created_at: requerimiento.created_at,
            prioridad: requerimiento.prioridad,
            estado: requerimiento.estado,
            categoria: requerimiento.categoria,
            id_template: requerimiento.id_template
        });
        this.modalActualizar();
    }

    modalActualizar=()=>{
        this.setState({
            modalInsertar: !this.state.modalInsertar,
            tipoModal: 'actualizar'
        });
    }

    guardarActualizacion=()=>{
        Axios.post('http://localhost:8080/api/requerimiento/editar/',{
            id_requerimiento: this.state.id_requerimiento,
            descripcion: this.state.descripcion,
            id_usuario: this.state.id_usuario,
            id_subProyecto: this.state.id_subProyecto,
            created_at: this.state.created_at,
            prioridad: this.state.prioridad,
            estado: this.state.estado,
            categoria: this.state.categoria,
            id_template: this.state.id_template
        })
        .then(response=>{
            this.modalInsertar();
            this.index();
        })
    }

    eliminar=()=>{
        Axios.delete(`http://localhost:8080/api/requerimiento/eliminar/${this.state.id_requerimiento}`)
        .then(response=>{
            this.setState({modalEliminar:false});
            this.index();
        })
    }

    render(){
        return(
            <div className="Requerimiento">
                <h2>Requerimiento</h2>
                <br/>
                <button className="btn btn-success" onClick={()=>{this.setState({id_requerimiento:0,descripcion:'',id_usuario:0,id_subProyecto:0,created_at:'',prioridad:'',estado:'',categoria:'',id_template:''}); this.modalInsertar()}}>Insertar</button>
                <br/><br/>
                <table className="table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Descripcion</th>
                            <th>ID Usuario</th>
                            <th>ID Sub-Proyecto</th>
                            <th>Fecha de Creacion</th>
                            <th>Prioridad</th>
                            <th>Estado</th>
                            <th>Categoria</th>
                            <th>ID Template</th>
                            <th>Editar</th>
                            <th>Eliminar</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.state.requerimientos.map(requerimiento=>
                            <tr key={requerimiento.id_requerimiento}>
                                <td>{requerimiento.id_requerimiento}</td>
                                <td>{requerimiento.descripcion}</td>
                                <td>{requerimiento.id_usuario}</td>
                                <td>{requerimiento.id_subProyecto}</td>
                                <td>{requerimiento.created_at}</td>
                                <td>{requerimiento.prioridad}</td>
                                <td>{requerimiento.estado}</td>
                                <td>{requerimiento.categoria}</td>
                                <td>{requerimiento.id_template}</td>
                                <td>
                                    <button className="btn btn-warning" onClick={()=>this.editar(requerimiento)}>Editar</button>
                                </td>
                                <td>
                                    <button className="btn btn-danger" onClick={()=>this.setState({modalEliminar:true, id_requerimiento: requerimiento.id_requerimiento})}>Eliminar</button>
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
                            <label htmlFor="id_requerimiento">ID</label>
                            <input className="form-control" type="text" name="id_requerimiento" id="id_requerimiento" value={this.state.id_requerimiento} readOnly/>
                            <br/>
                            <label htmlFor="descripcion">Descripcion</label>
                            <input className="form-control" type="text" name="descripcion" id="descripcion" onChange={(e)=>this.setState({descripcion:e.target.value})} value={this.state.descripcion} />
                            <br/>
                            <label htmlFor="id_usuario">ID Usuario</label>
                            <input className="form-control" type="text" name="id_usuario" id="id_usuario" onChange={(e)=>this.setState({id_usuario:e.target.value})} value={this.state.id_usuario} />
                            <br/>
                            <label htmlFor="id_subProyecto">ID Sub-Proyecto</label>
                            <input className="form-control" type="text" name="id_subProyecto" id="id_subProyecto" onChange={(e)=>this.setState({id_subProyecto:e.target.value})} value={this.state.id_subProyecto} />
                            <br/>
                            <label htmlFor="created_at">Fecha de Creacion</label>
                            <input className="form-control" type="date" name="created_at" id="created_at" onChange={(e)=>this.setState({created_at:e.target.value})} value={this.state.created_at} />
                            <br/>
                            <label htmlFor="prioridad">Prioridad</label>
                            <select className="form-control" name="prioridad" id="prioridad" value={this.state.prioridad} onChange={(e)=>this.setState({prioridad:e.target.value})}>
                                <option value="Baja">Baja</option>
                                <option value="Media">Media</option>
                                <option value="Alta">Alta</option>
                            </select>
                            <br/>
                            <label htmlFor="estado">Estado</label><br/>
                            <select className="form-control" name="estado" id="estado" value={this.state.estado} onChange={(e)=>this.setState({estado:e.target.value})}>
                                <option value="Creado">Creado</option>
                                <option value="En Redaccion">En Redaccion</option>
                                <option value="Aprobado">Aprobado</option>
                            </select>
                            <br/>
                            <label htmlFor="categoria">Categoría</label>
                            <input className="form-control" type="text" name="categoria" id="categoria" onChange={(e)=>this.setState({categoria:e.target.value})} value={this.state.categoria} />
                            <br/>
                            <label htmlFor="id_template">ID Template</label>
                            <input className="form-control" type="text" name="id_template" id="id_template" onChange={(e)=>this.setState({id_template:e.target.value})} value={this.state.id_template} />
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
                        ¿Seguro que desea eliminar el requerimiento?
                    </ModalBody>
                    <ModalFooter>
                        <button className="btn btn-danger" onClick={()=>this.eliminar()}>Si</button>
                        <button className="btn btn-secundary" onClick={()=>this.setState({modalEliminar:false})}>No</button>
                    </ModalFooter>
                </Modal>
            </div>
        );
    }
}

export default Requerimiento;