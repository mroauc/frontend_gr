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
            id_subproyecto: "",
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
        requerimientos : [],
        msj_nombre: "",
        msj_idsubproyecto: "",
        msj_fechapeticion: "",
        msj_descripcion: "",
        requerimientoImpactoDirecto : ''
    }

    componentWillReceiveProps(next_props){
        const token = localStorage.getItem('token');
        this.setState({propuestaCambio: this.props.propuestaCambio});
        console.log(next_props.propuestaCambio)
        this.getRequerimientos(next_props.propuestaCambio.id_subproyecto);
        if(this.props.tipoModal === "actualizar"){
            Axios.get(`http://localhost:8080/api/impacto_directo/obtener/${next_props.propuestaCambio.id_propuestaCambio}`,{headers: {"Authorization": `Bearer ${token}`}})
            .then(response=>{
                if(response.data[0] !== undefined){
                    this.setState({
                        requerimientoImpactoDirecto : response.data[0].id_requerimiento
                    });
                }
            }) }   
        this.obtenerRecarga();
    }

    obtenerRecarga=async()=>{
        await this.setState({propuestaCambio: this.props.propuestaCambio});
        if(this.props.tipoModal==='actualizar'){
            this.setState({requerimientoImpactoDirecto: this.props.requerimientoImpactoDirecto});
        }else{
            this.setState({requerimientoImpactoDirecto: ''});
        }
        this.getRequerimientos(this.props.propuestaCambio.id_subproyecto);
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

    validar=()=>{
        let salida=true;

        if(!this.state.propuestaCambio.nombre){
            this.setState({
                msj_nombre: "Campo Vacio"
            });
            salida=false;
        }
        if(!this.state.propuestaCambio.id_subproyecto){
            this.setState({
                msj_idsubproyecto: "Campo Vacio"
            });
            salida=false;
        }
        if(!this.state.propuestaCambio.fecha_peticion){
            this.setState({
                msj_fechapeticion: "Campo Vacio"
            });
            salida=false;
        }
        if(!this.state.propuestaCambio.descripcion){
            this.setState({
                msj_descripcion: "Campo Vacio"
            });
            salida=false;
        }
        return salida;
    }

    guardar=async()=>{
        if(this.validar()){
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
                this.setState({
                    msj_nombre: "",
                    msj_fechapeticion: "",
                    msj_descripcion: "",
                    msj_idsubproyecto: ""
                });
                this.props.modalInsertar();
                this.props.index();
                console.log("propuesta de cambio")
                console.log(response.data.id_propuestaCambio);
                this.insertarImpactoDirecto(response.data.id_propuestaCambio);
                this.notificar(response.data.id_subproyecto, response.data.descripcion, response.data.fecha_peticion);
            })
        }
    }

    insertarImpactoDirecto=async(id_propuestaCambio)=>{
        const token = localStorage.getItem('token');
            await Axios.post('http://localhost:8080/api/impacto_directo/guardar/',{
                id_propuesta_cambio : id_propuestaCambio,
                id_requerimiento : this.state.requerimientoImpactoDirecto
            },{headers:{"Authorization": `Bearer ${token}`}})
        

        this.setState({
            requerimientoImpactoDirecto: ''
        });
    }

    notificar=(id_subproyecto, descr, fecha)=>{
        const token = localStorage.getItem('token');
        var nombre_proy = '';
        var nombre_subproy = '';
        Axios.get(`http://localhost:8080/api/subProyecto/${id_subproyecto}`, {headers: {"Authorization": `Bearer ${token}`}})
        .then(response=>{
            nombre_subproy = response.data.nombre_subProyecto;
            Axios.get(`http://localhost:8080/api/proyecto/${response.data.id_proyecto}`, {headers: {"Authorization": `Bearer ${token}`}})
            .then(response=>{
                nombre_proy= response.data.nombre;
                Axios.get(`http://localhost:8080/api/usuario/id/${response.data.id_usuario}`, {headers: {"Authorization": `Bearer ${token}`}})
                .then(response=>{
                    Axios.post('http://localhost:8080/api/email/enviar',{
                        email: response.data.email,
                        content: "Se ha registrado una nueva propuesta de cambio para el subproyecto: <strong>"+nombre_subproy+"</strong> perteneciente al proyecto: <strong>"+nombre_proy+'</strong><br><br>El contenido de la propuesta de cambio es el siguiente: "<i>'+descr+'"</i><br><br>'+fecha,
                        subject: "Nueva Propuesta de Cambio"
                    }, {headers: {"Authorization": `Bearer ${token}`}})
                })
            })
        })
    }

    guardarActualizacion=async()=>{
        if(this.validar()){

            const token = localStorage.getItem('token');
            await Axios.post('http://localhost:8080/api/propuestacambio/editar/',this.state.propuestaCambio, {headers: {"Authorization": `Bearer ${token}`}})
            .then(response=>{
                this.actualizarImpactoDirecto(this.state.propuestaCambio.id_propuestaCambio);
                this.props.modalInsertar();
                this.props.index();
                this.setState({
                    msj_nombre: "",
                    msj_fechapeticion: "",
                    msj_descripcion: "",
                    msj_idsubproyecto: ""
                });
            })
        }
    }

    actualizarImpactoDirecto=async(id_propuestaCambio)=>{
        const token = localStorage.getItem('token');
        let impactoOld = '';
        await Axios.get(`http://localhost:8080/api/impacto_directo/obtener/${this.state.propuestaCambio.id_propuestaCambio}`,{headers:{"Authorization": `Bearer ${token}`}})
        .then(response => {
            impactoOld = response.data[0]
        })

        await Axios.post('http://localhost:8080/api/impacto_directo/guardar/',{
            id_impacto_directo : impactoOld.id_impacto_directo,
            id_propuesta_cambio : id_propuestaCambio,
            id_requerimiento : this.state.requerimientoImpactoDirecto
        },{headers:{"Authorization": `Bearer ${token}`}})
    
        this.setState({
            requerimientoImpactoDirecto: ''
        });
    }

    getRequerimientos = async (id_subProyecto) => {
        
        if(id_subProyecto !== ""){
            const token = localStorage.getItem('token');
            await Axios.get(`http://localhost:8080/api/requerimiento/obtener/${id_subProyecto}`,{headers: {"Authorization": `Bearer ${token}`}})
            .then(response => {
                this.setState({requerimientos : response.data})
            })
        }
        else{
            await this.setState({requerimientos : []})
        }
    }

    changeHandler=async(e)=>{
        await this.setState({
            propuestaCambio:{
                ...this.state.propuestaCambio, [e.target.name]: e.target.value
            }
        });
    }

    cerrar=()=>{
        this.setState({
            msj_nombre: "",
            msj_fechapeticion: "",
            msj_descripcion: "",
            msj_idsubproyecto: ""
        });
        this.props.modalInsertar();
    }

    render(){
        return(
            <React.Fragment>
                <Modal isOpen={this.props.estadoModalInsertar} toggle={()=>this.cerrar()}>
                    <ModalHeader style={{display:'block'}}>
                        <span>{(this.props.tipoModal==='insertar') ? 'Ingresar Propuesta de Cambio' :'Editar Propuesta de Cambio'}</span>

                        <span style={{cursor:'pointer', float:'right'}} onClick={()=>{this.cerrar()}}>X</span>
                    </ModalHeader>
                    <ModalBody>
                        <div className="form-group">
                            <label htmlFor="id_propuestaCambio">ID</label>
                            <input className="form-control" type="text" name="id_propuestaCambio" id="id_propuestaCambio" value={this.state.propuestaCambio.id_propuestaCambio} readOnly/>
                            <br/>
                            <label htmlFor="nombre">Nombre</label>
                            <input className={ (this.state.msj_nombre)? "form-control is-invalid" : "form-control"} type="text" name="nombre" id="nombre" onChange={this.changeHandler} value={this.state.propuestaCambio.nombre} onClick={()=>{this.setState({msj_nombre: ""})}} />
                            <div className="invalid-feedback">
                                {this.state.msj_nombre}
                            </div>
                            <br/>
                            <label htmlFor="id_modulo">ID Modulo</label>
                            <select name="id_subproyecto" id="id_subproyecto" className={ (this.state.msj_idsubproyecto)? "form-control is-invalid" : "form-control"} value={this.state.propuestaCambio.id_subproyecto} onChange={(e) => {this.changeHandler(e); this.getRequerimientos(e.target.value)}} onClick={()=>{this.setState({msj_idsubproyecto: ""})}}>
                                <option value="">Seleccione un SubProyecto</option>
                                {this.state.subProyectos.map(subp=>{
                                    return(
                                        <option value={subp.id_subProyecto}>{subp.nombre_subProyecto}</option>
                                    );
                                })}
                            </select>
                            <div className="invalid-feedback">
                                {this.state.msj_idsubproyecto}
                            </div>
                            <br/>
                            <label htmlFor="fecha_peticion">Fecha de Peticion</label>
                            <input className={ (this.state.msj_fechapeticion)? "form-control is-invalid" : "form-control"} type="date" name="fecha_peticion" id="fecha_peticion" onChange={this.changeHandler} value={this.state.propuestaCambio.fecha_peticion} onClick={()=>{this.setState({msj_fechapeticion: ""})}} />
                            <div className="invalid-feedback">
                                {this.state.msj_fechapeticion}
                            </div>
                            <br/>
                            <label htmlFor="id_usuario">Autor</label>
                            <input className="form-control" type="number" name="id_usuario" id="id_usuario" value={this.state.propuestaCambio.id_usuario} readOnly/>
                            <br/>
                            <label htmlFor="descripcion">Descripcion</label>
                            <input className={ (this.state.msj_descripcion)? "form-control is-invalid" : "form-control"} type="text" name="descripcion" id="descripcion" onChange={this.changeHandler} value={this.state.propuestaCambio.descripcion} onClick={()=>{this.setState({msj_descripcion: ""})}} />
                            <div className="invalid-feedback">
                                {this.state.msj_descripcion}
                            </div>
                            <br/>
                            <label htmlFor="descripcion">Impacto Directo</label>
                            <select className="form-control" type="text" name="requerimientoImpactoDirecto" id="requerimientoImpactoDirecto" onChange={(e) => {this.setState({requerimientoImpactoDirecto: e.target.value})}} value={this.state.requerimientoImpactoDirecto}>
                                <option value="">Seleccione un requerimiento</option>
                                {
                                    this.state.requerimientos.map(req => {
                                        return(
                                            <option key={req.id_requerimiento} value={req.id_requerimiento}>{req.nombre}</option>
                                        )
                                    })
                                }
                            </select>
                            
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
                        <button className="btn btn-danger" onClick={()=>{this.cerrar()}}>Cancelar</button>
                    </ModalFooter>
                </Modal>

            </React.Fragment>
        );
    }

}

export default PropuestaCambioModal;