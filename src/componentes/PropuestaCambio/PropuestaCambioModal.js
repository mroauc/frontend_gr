import Axios from 'axios';
import React, { Component } from 'react'
import { Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import ChipsImpactoDirecto from './ChipsImpactoDirecto';
import ModalReqPropuesta from './ModalReqPropuesta';

class PropuestaCambioModal extends Component{
    state={
        subProyectos: [],
        propuestaCambio: {
            id_propuestaCambio: 0,
            nombre: '',
            id_subproyecto: "",
            id_proyecto: this.props.id_proyecto,
            fecha_peticion: new Date().toLocaleDateString('fr-CA'),
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
        requerimiento : "",
        msj_nombre: "",
        msj_idsubproyecto: "",
        msj_fechapeticion: "",
        msj_descripcion: "",
        msj_requerimiento: "",
        requerimientoImpactoDirecto : '',
        modalReq: false
    }

    componentWillReceiveProps(next_props){
        const token = localStorage.getItem('token');
        this.setState({propuestaCambio: this.props.propuestaCambio});
        
        if(this.props.tipoModal === "actualizar"){
            Axios.get(localStorage.getItem('url') + `/api/impacto_directo/obtener/${next_props.propuestaCambio.id_propuestaCambio}`,{headers: {"Authorization": `Bearer ${token}`}})
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
        this.getRequerimientos();
    }

    componentDidMount(){
        this.index();
    }

    index=async()=>{
        const token = localStorage.getItem('token');
        const id_p = this.props.id_proyecto;
        await Axios.get(localStorage.getItem('url') + `/api/subProyecto/pertenecientes/${id_p}`,{headers: {"Authorization": `Bearer ${token}`}})
        .then(response=>{
            this.setState({
                subProyectos: response.data
            });
        })
        this.getRequerimientos();
    }

    validar=()=>{
        let salida=true;

        if(!this.state.propuestaCambio.nombre){
            this.setState({
                msj_nombre: "Campo Vacio"
            });
            salida=false;
        }
        // if(!this.state.propuestaCambio.id_subproyecto){
        //     this.setState({
        //         msj_idsubproyecto: "Campo Vacio"
        //     });
        //     salida=false;
        // }
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
        // if(!this.state.requerimientoImpactoDirecto){
        //     this.setState({
        //         msj_requerimiento: "Campo Vacio"
        //     })
        //     salida = false;
        // }
        return salida;
    }

    guardar=async()=>{
        if(this.validar()){
            const token = localStorage.getItem('token');
            await Axios.post(localStorage.getItem('url') + '/api/propuestacambio/guardar/',{
                nombre: this.state.propuestaCambio.nombre,
                id_subproyecto: this.state.propuestaCambio.id_subproyecto,
                id_proyecto: this.props.id_proyecto,
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
                this.insertarImpactoDirecto(response.data.id_propuestaCambio);
                if(response.data.id_subproyecto !== 0)
                    this.notificar(response.data.id_subproyecto, response.data.descripcion, response.data.fecha_peticion);
            })
        }
    }

    insertarImpactoDirecto=async(id_propuestaCambio)=>{
        const token = localStorage.getItem('token');
            await Axios.post(localStorage.getItem('url') + '/api/impacto_directo/guardar/',{
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
        Axios.get(localStorage.getItem('url') + `/api/subProyecto/${id_subproyecto}`, {headers: {"Authorization": `Bearer ${token}`}})
        .then(response=>{
            nombre_subproy = response.data.nombre_subProyecto;
            Axios.get(localStorage.getItem('url') + `/api/proyecto/${response.data.id_proyecto}`, {headers: {"Authorization": `Bearer ${token}`}})
            .then(response=>{
                nombre_proy= response.data.nombre;
                Axios.get(localStorage.getItem('url') + `/api/usuario/id/${response.data.id_usuario}`, {headers: {"Authorization": `Bearer ${token}`}})
                .then(response=>{
                    Axios.post(localStorage.getItem('url') + '/api/email/enviar',{
                        email: response.data.email,
                        content: "Se ha registrado una nueva propuesta de cambio para el subproyecto: <strong>"+nombre_subproy+"</strong> perteneciente al proyecto: <strong>"+nombre_proy+'</strong><br><br>El contenido de la propuesta de cambio es el siguiente: "<i>'+descr+'"</i><br><br>'+fecha,
                        subject: "Nueva Propuesta de Cambio"
                    }, {headers: {"Authorization": `Bearer ${token}`}})
                })
            })
        })
    }

    modalReq=async()=>{
        await this.setState({modalReq: !this.state.modalReq});
    }

    seleccionarReq=(requerimiento)=>{
        if(requerimiento !== ""){
            this.setState({requerimientoImpactoDirecto: requerimiento});
            var requerimientoSel = this.state.requerimientos.find(req => req.id_requerimiento.toString() === requerimiento);
            var copia_propuesta = {...this.state.propuestaCambio};
            copia_propuesta.id_subproyecto = requerimientoSel.id_subProyecto;
            this.setState({propuestaCambio: copia_propuesta});
            this.setState({requerimiento : requerimientoSel});

        }
        else{
            this.setState({requerimientoImpactoDirecto: requerimiento});
            var copia_propuesta = {...this.state.propuestaCambio};
            copia_propuesta.id_subproyecto = "";
            this.setState({propuestaCambio: copia_propuesta});
            this.setState({requerimiento : ""});
            console.log(requerimiento);
        }
        this.setState({msj_requerimiento: ""});
        this.setState({msj_idsubproyecto: ""});
        this.modalReq();
    }

    guardarActualizacion=async()=>{
        if(this.validar()){
            const token = localStorage.getItem('token');
            await Axios.post(localStorage.getItem('url') + '/api/propuestacambio/editar/',this.state.propuestaCambio, {headers: {"Authorization": `Bearer ${token}`}})
            .then(response=>{
                this.actualizarImpactoDirecto(response.data.id_propuestaCambio, this.state.requerimientoImpactoDirecto);
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

    actualizarImpactoDirecto=async(id_propuestaCambio, requerimientoID)=>{
        const token = localStorage.getItem('token');
        let impactoOld = '';
        await Axios.get(localStorage.getItem('url') + `/api/impacto_directo/obtener/${id_propuestaCambio}`,{headers:{"Authorization": `Bearer ${token}`}})
        .then(response => {
            impactoOld = response.data[0]
        });

        await Axios.post(localStorage.getItem('url') + '/api/impacto_directo/guardar/',{
            id_impacto_directo : impactoOld.id_impacto_directo,
            id_propuesta_cambio : id_propuestaCambio,
            id_requerimiento : requerimientoID
        },{headers:{"Authorization": `Bearer ${token}`}});
    
        this.setState({
            requerimientoImpactoDirecto: ''
        });
    }

    getRequerimientos = async () => {
        var requerimientosAsociados = [];
        const token = localStorage.getItem('token');
        for (var i = 0; i < this.state.subProyectos.length; i++) {
            await Axios.get(localStorage.getItem('url') + `/api/requerimiento/obtener/${this.state.subProyectos[i].id_subProyecto}`,{headers: {"Authorization": `Bearer ${token}`}})
            .then(async response => {
                if(response.data.length !== 0)
                    requerimientosAsociados = await requerimientosAsociados.concat(response.data);
                
                if(i === this.state.subProyectos.length-1)
                    await this.setState({requerimientos : requerimientosAsociados});
            })    
        }
        var requerimientoSel = requerimientosAsociados.find(req => req.id_requerimiento=== this.state.requerimientoImpactoDirecto);
        if(requerimientoSel !== undefined){
            this.setState({requerimiento: requerimientoSel});   
        }
        
        
    }

    changeHandler=async(e)=>{
        var x = 0;
        if(e.target.name==='descripcion'){
            x=1;
        }
        if(e.target.name==='justificacion'){
            x=2;
        }
        if(e.target.name==='alternativas'){
            x=3;
        }
        if(e.target.name==='consecuencias_rechazo'){
            x=4;
        }
        if(e.target.name==='comentarios'){
            x=5;
        }

        await this.setState({
            propuestaCambio:{
                ...this.state.propuestaCambio, [e.target.name]: e.target.value
            }
        });

        if(x===1){
            var caract = this.state.propuestaCambio.descripcion.length;
            if(caract<255){
                document.getElementById("span_contador_descr").innerHTML = '<span style="color: grey;">' + caract + '/255</span>';
            }else{
                document.getElementById("span_contador_descr").innerHTML = '<span style="color: red;">' + caract + '/255</span>';
            }
        }
        if(x===2){
            var caract = this.state.propuestaCambio.justificacion.length;
            if(caract<255){
                document.getElementById("span_contador_just").innerHTML = '<span style="color: grey;">' + caract + '/255</span>';
            }else{
                document.getElementById("span_contador_just").innerHTML = '<span style="color: red;">' + caract + '/255</span>';
            }
        }
        if(x===3){
            var caract = this.state.propuestaCambio.alternativas.length;
            if(caract<255){
                document.getElementById("span_contador_alt").innerHTML = '<span style="color: grey;">' + caract + '/255</span>';
            }else{
                document.getElementById("span_contador_alt").innerHTML = '<span style="color: red;">' + caract + '/255</span>';
            }
        }
        if(x===4){
            var caract = this.state.propuestaCambio.consecuencias_rechazo.length;
            if(caract<255){
                document.getElementById("span_contador_consec").innerHTML = '<span style="color: grey;">' + caract + '/255</span>';
            }else{
                document.getElementById("span_contador_consec").innerHTML = '<span style="color: red;">' + caract + '/255</span>';
            }
        }
        if(x===5){
            var caract = this.state.propuestaCambio.comentarios.length;
            if(caract<255){
                document.getElementById("span_contador_comentario").innerHTML = '<span style="color: grey;">' + caract + '/255</span>';
            }else{
                document.getElementById("span_contador_comentario").innerHTML = '<span style="color: red;">' + caract + '/255</span>';
            }
        }
    }

    cerrar=()=>{
        this.setState({
            msj_nombre: "",
            msj_fechapeticion: "",
            msj_descripcion: "",
            msj_idsubproyecto: "",
            requerimiento: ""
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
                            <label htmlFor="nombre">Nombre</label>
                            <input className={ (this.state.msj_nombre)? "form-control is-invalid" : "form-control"} type="text" name="nombre" id="nombre" onChange={this.changeHandler} value={this.state.propuestaCambio.nombre} onClick={()=>{this.setState({msj_nombre: ""})}} />
                            <div className="invalid-feedback">
                                {this.state.msj_nombre}
                            </div>
                            <br/>
                            <label htmlFor="requerimiento">Impacto Directo</label>
                            <div style={{display:'flex'}}>
                                <input className={ (this.state.msj_requerimiento)? "form-control is-invalid col-8" : "form-control col-8"} style={{marginRight:'5px'}} type="text" name="requerimientoImpactoDirecto" id="requerimientoImpactoDirecto" onChange={(e) => {this.setState({requerimientoImpactoDirecto: e.target.value})}} onClick={()=>{this.setState({msj_requerimiento: ""})}} value={this.state.requerimiento === "" ? "Seleccione un requerimiento" : this.state.requerimiento.nombre+" - "+this.state.requerimiento.nombre_descriptivo} readOnly={true} disabled={true}/>
                                <button className="col-4 btn btn-primary" onClick={()=> this.modalReq()}>Seleccionar</button>
                            </div>
                            <div className="invalid-feedback">
                                {this.state.msj_requerimiento}
                            </div>
                            <br/>
                            <label htmlFor="id_modulo">Módulo</label>
                            <select name="id_subproyecto" id="id_subproyecto" className={ (this.state.msj_idsubproyecto)? "form-control is-invalid" : "form-control"} value={this.state.propuestaCambio.id_subproyecto} onChange={(e) => {this.changeHandler(e); this.getRequerimientos()}} onClick={()=>{this.setState({msj_idsubproyecto: ""})}} readOnly={true} disabled={true}>
                                <option value="">Seleccione un Módulo</option>
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
                            <label htmlFor="descripcion">Descripcion</label>
                            <p><textarea className={ (this.state.msj_descripcion)? "form-control is-invalid" : "form-control"} type="text" name="descripcion" id="descripcion" rows="3" maxLength="255" onChange={this.changeHandler} value={this.state.propuestaCambio.descripcion} onClick={()=>{this.setState({msj_descripcion: ""})}} /></p>
                            <div className="invalid-feedback">
                                {this.state.msj_descripcion}
                            </div>
                            {(this.props.tipoModal==='actualizar')?
                                    <p id="span_contador_descr" style={{float:'right'}}><span style={{color: 'gray'}}>{this.state.propuestaCambio.descripcion.length}/255</span></p>
                                :
                                    <p id="span_contador_descr" style={{float:'right'}}><span style={{color: 'gray'}}>0/255</span></p>

                            }
                            <br/>
                            
                            <br/>
                            <label htmlFor="justificacion">Justificacion</label>
                            <p><textarea className="form-control" type="text" name="justificacion" id="justificacion" rows="3" maxLength="255" onChange={this.changeHandler} value={this.state.propuestaCambio.justificacion} /></p>
                            {(this.props.tipoModal==='actualizar')?
                                    <p id="span_contador_just" style={{float:'right'}}><span style={{color: 'gray'}}>{this.state.propuestaCambio.justificacion.length}/255</span></p>
                                :
                                    <p id="span_contador_just" style={{float:'right'}}><span style={{color: 'gray'}}>0/255</span></p>

                            }
                            <br/>
                            <label htmlFor="alternativas">Alternativas</label>
                            <p><textarea className="form-control" type="text" name="alternativas" id="alternativas" rows="3" maxLength="255" onChange={this.changeHandler} value={this.state.propuestaCambio.alternativas} /></p>
                            {(this.props.tipoModal==='actualizar')?
                                    <p id="span_contador_alt" style={{float:'right'}}><span style={{color: 'gray'}}>{this.state.propuestaCambio.alternativas.length}/255</span></p>
                                :
                                    <p id="span_contador_alt" style={{float:'right'}}><span style={{color: 'gray'}}>0/255</span></p>

                            }
                            <br/>
                            <label htmlFor="consecuencias_rechazo">Consecuencias Rechazo</label>
                            <p><textarea className="form-control" type="text" name="consecuencias_rechazo" id="consecuencias_rechazo" rows="3" maxLength="255" onChange={this.changeHandler} value={this.state.propuestaCambio.consecuencias_rechazo} /></p>
                            {(this.props.tipoModal==='actualizar')?
                                    <p id="span_contador_consec" style={{float:'right'}}><span style={{color: 'gray'}}>{this.state.propuestaCambio.consecuencias_rechazo.length}/255</span></p>
                                :
                                    <p id="span_contador_consec" style={{float:'right'}}><span style={{color: 'gray'}}>0/255</span></p>

                            }
                            <br/>
                            <label htmlFor="fecha_resolucion">Fecha de Resolucion</label>
                            <input className="form-control" type="date" name="fecha_resolucion" id="fecha_resolucion" onChange={this.changeHandler} value={this.state.propuestaCambio.fecha_resolucion} />
                            <br/>
                            <label htmlFor="comentarios">Comentarios</label>
                            <p><textarea className="form-control" type="text" name="comentarios" id="comentarios" rows="3" maxLength="255" onChange={this.changeHandler} value={this.state.propuestaCambio.comentarios} /></p>
                            {(this.props.tipoModal==='actualizar')?
                                    <p id="span_contador_comentario" style={{float:'right'}}><span style={{color: 'gray'}}>{this.state.propuestaCambio.comentarios.length}/255</span></p>
                                :
                                    <p id="span_contador_comentario" style={{float:'right'}}><span style={{color: 'gray'}}>0/255</span></p>

                            }
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
                <ModalReqPropuesta
                        requerimientos = {this.state.requerimientos}
                        abrir = {this.state.modalReq}
                        cambiarEstado = {this.modalReq}
                        seleccionarReq = {this.seleccionarReq}
                        seleccionado = {this.state.requerimientoImpactoDirecto}
                    />

            </React.Fragment>
        );
    }

}

export default PropuestaCambioModal;