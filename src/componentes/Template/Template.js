import Axios from 'axios';
import React, {Component} from 'react';
import { Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';

class Template extends Component{

    state={
        templates: [],
        modalInsertar: false,
        modalEliminar: false,
        tipoModal: '',
        id_template: 0,
        prefijo: '',
        nombre: '',
        tipo: '',
        template: '',
        fecha: ''
    }

    index=()=>{
        Axios.get('http://localhost:8080/api/template/')
        .then(response=>{
            this.setState({
                templates: response.data
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
        await Axios.post('http://localhost:8080/api/template/guardar/',{
            prefijo: this.state.prefijo,
            nombre: this.state.nombre,
            tipo: this.state.tipo,
            template: this.state.template,
            fecha: this.state.fecha
        })
        .then(response=>{
            this.modalInsertar();
            this.index();
        })
    }

    editar=(template)=>{
        this.setState({
            id_template: template.id_template,
            prefijo: template.prefijo,
            nombre: template.nombre,
            tipo: template.tipo,
            template: template.template,
            fecha: template.fecha
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
        Axios.post('http://localhost:8080/api/template/editar/',{
            id_template: this.state.id_template,
            prefijo: this.state.prefijo,
            nombre: this.state.nombre,
            tipo: this.state.tipo,
            template: this.state.template,
            fecha: this.state.fecha
        })
        .then(response=>{
            this.modalInsertar();
            this.index();
        })
    }

    eliminar=()=>{
        Axios.delete(`http://localhost:8080/api/template/eliminar/${this.state.id_template}`)
        .then(response=>{
            this.setState({modalEliminar:false});
            this.index();
        })
    }

    render(){
        return(
            <div className="Template">
                <h2>Template</h2>
                <br/>
                <button className="btn btn-success" onClick={()=>{this.setState({id_template:0, prefijo:'', nombre:'',tipo:'',template:'',fecha:''}); this.modalInsertar()}}>Insertar</button>
                <br/><br/>
                <table className="table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Prefijo</th>
                            <th>Nombre</th>
                            <th>Tipo</th>
                            <th>Template</th>
                            <th>Editar</th>
                            <th>Eliminar</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.state.templates.map(template=>
                            <tr key={template.id_template}>
                                <td>{template.id_template}</td>
                                <td>{template.prefijo}</td>
                                <td>{template.nombre}</td>
                                <td>{template.tipo}</td>
                                <td>{template.template}</td>
                                <td>
                                    <button className="btn btn-warning" onClick={()=>this.editar(template)}>Editar</button>
                                </td>
                                <td>
                                    <button className="btn btn-danger" onClick={()=>this.setState({modalEliminar:true, id_template:template.id_template})}>Eliminar</button>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>

                <Modal isOpen={this.state.modalInsertar}>
                    <ModalHeader style={{display: 'block'}}>
                        <span style={{float: 'right'}} onClick={()=>{this.modalInsertar()}}>X</span>
                    </ModalHeader>
                    <ModalBody>
                        <div className="form-group">
                            <label htmlFor="id_template">ID</label>
                            <input className="form-control" type="text" name="id_template" id="id_template" value={this.state.id_template} readOnly/>
                            <br/>
                            <label htmlFor="prefijo">Prefijo</label>
                            <input className="form-control" type="text" name="prefijo" id="prefijo" onChange={(e)=>this.setState({prefijo:e.target.value})} value={this.state.prefijo} />
                            <br/>
                            <label htmlFor="nombre">Nombre</label>
                            <input className="form-control" type="text" name="nombre" id="nombre" onChange={(e)=>this.setState({nombre:e.target.value})} value={this.state.nombre} />
                            <br/>
                            <label htmlFor="tipo">Tipo</label>
                            <input className="form-control" type="text" name="tipo" id="tipo" onChange={(e)=>this.setState({tipo:e.target.value})} value={this.state.tipo} />
                            <br/>
                            <label htmlFor="template">Template</label>
                            <input className="form-control" type="text" name="template" id="template" onChange={(e)=>this.setState({template:e.target.value})} value={this.state.template} />
                            <br/>
                            <label htmlFor="fecha">Fecha</label>
                            <input className="form-control" type="date" name="fecha" id="fecha" onChange={(e)=>this.setState({fecha:e.target.value})} value={this.state.fecha} />
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
                        <button className="btn btn-danger" onClick={()=>this.modalInsertar()}>Cancelar</button>
                    </ModalFooter>
                </Modal>

                <Modal isOpen={this.state.modalEliminar}>
                    <ModalBody>
                        ¿Seguro que desea eliminar el template?
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

export default Template;