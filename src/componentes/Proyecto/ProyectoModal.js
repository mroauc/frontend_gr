import Axios from 'axios';
import React, { Component } from 'react'
import { Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import ChipsProyecto from './ChipsProyecto';
import SeleccionEmpresas from './SeleccionEmpresas';

class ProyectoModal extends Component{
    state={
        proyecto: {
            id_proyecto: 0,
            nombre: '',
            fecha_inicio: new Date().toLocaleDateString('fr-CA'),
            fecha_fin: '',
            id_usuario: '',
            fecha_creacion: ''
        },
        jefes_proyectos : [],
        empresasSeleccionadas: [],
        empresas: [],
        errorInputNombre : '',
        errorInputFechaInicio : '',
        errorInputFechaFin : '',
        errorEmpresasAsociadas : '',
        errorJefeProyecto : '',
        modalSeleccionarEmpresas: false
    }

    componentWillReceiveProps(next_props){
        this.setState({proyecto: this.props.proyecto});
    }

    componentDidMount(){
        const token = localStorage.getItem('token');
        Axios.get('http://localhost:8080/api/empresa/',{headers: {"Authorization": `Bearer ${token}`}})
        .then(response=>{
            this.setState({
                empresas: response.data,
            });
        })
        this.getJefesProyectos();
    }

    guardar=async()=>{
        const token = localStorage.getItem('token');
        var id_act_proyecto;
        if(this.validar()){
            await Axios.post('http://localhost:8080/api/proyecto/guardar/',{
                nombre: this.state.proyecto.nombre,
                fecha_inicio: this.state.proyecto.fecha_inicio,
                fecha_fin: this.state.proyecto.fecha_fin,
                id_usuario: this.state.proyecto.id_usuario,
                fecha_creacion: new Date().toLocaleString()
            },{headers: {"Authorization": `Bearer ${token}`}})
            .then(response=>{
                this.proyectoEmpresa(response.data.id_proyecto);
                this.props.modalInsertar();
                this.props.index();
            })
        }
    }

    proyectoEmpresa=async(id_proyecto)=>{
        const token = localStorage.getItem('token');

        for (let index = 0; index < this.state.empresasSeleccionadas.length; index++) {
            await Axios.post('http://localhost:8080/api/proyecto_empresa/guardar/',{
                id_empresa: this.state.empresasSeleccionadas[index],
                id_proyecto: id_proyecto
            },{headers:{"Authorization": `Bearer ${token}`}})            
        }
        this.setState({
            empresasSeleccionadas: []
        });
    }

    insertarChip=(empresa)=>{
        this.setState({
            empresasSeleccionadas: [ ...this.state.empresasSeleccionadas, empresa],
        });
    }

    eliminarChip=(empresa)=>{
        const filtrado = this.state.empresasSeleccionadas.filter(item => item!==empresa);        
        this.setState({
            empresasSeleccionadas : filtrado
        });
    }
    
    guardarActualizacion=()=>{
        const token = localStorage.getItem('token');
        if(this.validar()){
            Axios.post('http://localhost:8080/api/proyecto/editar/',this.state.proyecto, {headers: {"Authorization": `Bearer ${token}`}})
            .then(response=>{
                this.props.modalInsertar();
                this.props.index();
                this.actualizarProyectoEmpresa(response.data.id_proyecto);
            })
        }
    }

    actualizarProyectoEmpresa=(id_proyecto)=>{
        const token = localStorage.getItem('token');
        var existentes = [];
        var original = [];
        Axios.get(`http://localhost:8080/api/proyecto_empresa/obtener/${id_proyecto}`, {headers: {"Authorization": `Bearer ${token}`}})
        .then(response=>{
            original = response.data;
            for (let index = 0; index < response.data.length; index++) {
                existentes= [...existentes, response.data[index].id_empresa.toString()];
            }

            //eliminar
            for (let index = 0; index < existentes.length; index++) {
                if(!this.state.empresasSeleccionadas.includes(existentes[index])){
                    Axios.delete(`http://localhost:8080/api/proyecto_empresa/eliminar/${original[index].id_proyecto_empresa}`,{headers: {"Authorization": `Bearer ${token}`}})
                    .then(response=>{
                    });
                } 
            }

            //insertar
            for (let index = 0; index < this.state.empresasSeleccionadas.length; index++) {
                if(!existentes.includes(this.state.empresasSeleccionadas[index])){
                    Axios.post('http://localhost:8080/api/proyecto_empresa/guardar/',{
                        id_empresa: this.state.empresasSeleccionadas[index],
                        id_proyecto: id_proyecto,
                    },{headers: {"Authorization": `Bearer ${token}`}});
                }             
            }
            this.setState({empresasSeleccionadas:[]});
        })
    }

    initErrores = () => {
        this.setState({
            errorInputNombre : '',
            errorEmpresasAsociadas: '',
            errorInputFechaInicio: '',
            errorInputFechaFin : '',
            errorJefeProyecto: ''
        })
    }

    changeHandler=async(e)=>{
        await this.setState({
            proyecto:{
                ...this.state.proyecto, [e.target.name]: e.target.value
            }
        });
    }

    validar = () => {
        let validacion = true;
        if(this.state.proyecto.nombre === ""){
            this.setState({errorInputNombre : 'Ingrese un nombre para el proyecto.'});
            validacion = false;
        }
        if(this.state.proyecto.fecha_inicio === ""){
            this.setState({errorInputFechaInicio : "Seleccione una fecha de inicio para el proyecto."});
            validacion = false;
        }
        if(this.state.proyecto.fecha_fin === ""){
            this.setState({errorInputFechaFin : "Seleccione una fecha de termino para el proyecto."});
            validacion = false;
        }
        if(this.state.empresasSeleccionadas.length === 0){
            this.setState({errorEmpresasAsociadas : "Debe seleccionar al menos una empresa asociada."});
            validacion = false;
        }
        if(this.state.proyecto.id_usuario === ""){
            this.setState({errorJefeProyecto : "Debe seleccionar al menos un jefe de proyecto"});
            validacion = false;
        }

        return validacion;
    }

    getJefesProyectos=async()=>{
        const token = localStorage.getItem('token');
        await Axios.get('http://localhost:8080/api/usuario/',{headers: {"Authorization": `Bearer ${token}`}})
        .then(response=>{
            this.setState({
                jefes_proyectos: response.data.filter(usuario => usuario.tipo === "jefe" && usuario.estado === "Activo")
            });
        });
    }

    modalEmpresasAsociadas=async()=>{
        await this.setState({modalSeleccionarEmpresas: !this.state.modalSeleccionarEmpresas});
    }

    insertarRelaciones=async(nuevas_empresas)=>{
        await this.setState({empresasSeleccionadas: nuevas_empresas});
    }

    render(){
        return(
            <React.Fragment>
                <Modal isOpen={this.props.estadoModalInsertar} toggle={()=>{this.initErrores();this.props.modalInsertar();this.setState({empresasSeleccionadas:[]})}}>
                    <ModalHeader style={{display:'block'}}>
                        <span>{(this.props.tipoModal==='insertar') ? 'Ingresar Proyecto' :'Editar Proyecto'}</span>

                        <span style={{cursor:'pointer', float:'right'}} onClick={()=>{this.initErrores();this.props.modalInsertar();this.setState({empresasSeleccionadas:[]})}}>X</span>
                    </ModalHeader>
                    <ModalBody>
                        <div className="form-group">
                            <label htmlFor="nombre">Nombre de Proyecto</label>
                            <input className={(this.state.errorInputNombre)? "form-control is-invalid" : "form-control"} type="text" name="nombre" id="nombre" placeholder="Ingrese el nombre que desea asignar al proyecto" onChange={this.changeHandler} value={this.state.proyecto.nombre} onClick={() => {this.setState({errorInputNombre : ''})}} />
                            <div class="invalid-feedback" style={{display: 'block'}}>
                                {this.state.errorInputNombre}
                            </div>
                            <br/>
                            <label htmlFor="id_usuario">Jefe de Proyecto</label>
                            <select name="id_usuario" id="id_usuario" className={(this.state.errorJefeProyecto)? "form-control is-invalid" : "form-control"} value={this.state.proyecto.id_usuario}  onChange={this.changeHandler} onClick={() => {this.setState({errorJefeProyecto : ''})}}>
                                <option value="" selected>Seleccione un Jefe de Proyecto</option>
                                {this.state.jefes_proyectos.map(jefe => {
                                    return(
                                        <option key={jefe.id}value={jefe.id}>{jefe.id  +" - "+ jefe.nombre}</option>
                                    )
                                })}
                            </select>
                            <div class="invalid-feedback" style={{display: 'block'}}>
                                {this.state.errorJefeProyecto}
                            </div>
                            <br/>
                            <label htmlFor="id_usuario">Empresas Asociadas</label>

                            <div className="areaCrear2">
                                <div className="col-8" style={{display:'flow-root', paddingLeft: '0'}}>
                                    <ChipsProyecto
                                        id_proyecto = {this.state.proyecto.id_proyecto}
                                        insertarChip = {this.insertarChip}
                                        eliminarChip = {this.eliminarChip}
                                        empresas = {this.state.empresas}
                                        seleccionadas = {this.state.empresasSeleccionadas}
                                    />
                                </div>
                                <div className="col-4 cont-boton-prop">
                                    <button className="btn btn-success btn-block" onClick={()=>{this.modalEmpresasAsociadas(); this.setState({errorEmpresasAsociadas : ''});} }>Seleccionar</button>
                                </div>
                                <SeleccionEmpresas
                                    empresas = {this.state.empresas}
                                    valoresInput = {this.state.empresasSeleccionadas}
                                    insertarRelaciones = {this.insertarRelaciones}
                                    abrir = {this.state.modalSeleccionarEmpresas}
                                    modalEmpresasAsociadas = {this.modalEmpresasAsociadas}
                                />
                                <div class="invalid-feedback" style={{display: 'block'}}>
                                    {this.state.errorEmpresasAsociadas}
                                </div>
                            </div>

                            <label htmlFor="fecha_inicio">Fecha de Inicio</label>
                            <input className={(this.state.errorInputFechaInicio)? "form-control is-invalid" : "form-control"} type="date" name="fecha_inicio" id="fecha_inicio" onChange={this.changeHandler} value={this.state.proyecto.fecha_inicio} onClick={() => {this.setState({errorInputFechaInicio : ''})}}/>
                            <div class="invalid-feedback" style={{display: 'block'}}>
                                {this.state.errorInputFechaInicio}
                            </div>
                            <br/>
                            <label htmlFor="fecha_fin">Fecha de Finalizacion</label>
                            <input className={(this.state.errorInputFechaFin)? "form-control is-invalid" : "form-control"} type="date" name="fecha_fin" id="fecha_fin" onChange={this.changeHandler} value={this.state.proyecto.fecha_fin} onClick={() => {this.setState({errorInputFechaFin : ''})}} />
                            <div class="invalid-feedback" style={{display: 'block'}}>
                                {this.state.errorInputFechaFin}
                            </div>
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
                            <button className="btn btn-danger" onClick={()=>{this.props.modalInsertar();this.initErrores();this.setState({empresasSeleccionadas:[]})}}>Cancelar</button>
                    </ModalFooter>
                </Modal>
            </React.Fragment>
        );
    }
}

export default ProyectoModal;