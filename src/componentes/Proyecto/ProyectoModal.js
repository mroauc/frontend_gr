import Axios from 'axios';
import React, { Component } from 'react'
import { Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import ChipsProyecto from './ChipsProyecto';
import SeleccionJefe from './SeleccionJefe/SeleccionJefe';

let nombre_usuario = "";

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
        estadoModal : false
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
                console.log(response); 
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

    cambiarEstadoAbrir = () => {
        this.setState({estadoModal : !this.state.estadoModal})
    }

    cambiarJefe = (id_nuevo_jefe) => {
        let copiaProyecto = {...this.state.proyecto};
        copiaProyecto.id_usuario = id_nuevo_jefe;
        this.setState({proyecto : copiaProyecto});
    }

    buscarNombreUsuario = () => {
        if(this.state.proyecto.id_usuario === 0) {
            nombre_usuario = "Seleccione un Jefe de Proyecto";
        }
        else{
            let usuarioEncontrado = this.state.jefes_proyectos.find(usuario => usuario.id === this.state.proyecto.id_usuario);
            if(usuarioEncontrado !== undefined)
                nombre_usuario = usuarioEncontrado.nombre;
        }
    } 

    render(){
        this.buscarNombreUsuario();
        return(
            <React.Fragment>
                <Modal isOpen={this.props.estadoModalInsertar} toggle={()=>{this.initErrores();this.props.modalInsertar()}}>
                    <ModalHeader style={{display:'block'}}>
                        <span>{(this.props.tipoModal==='insertar') ? 'Ingresar Proyecto' :'Editar Proyecto'}</span>

                        <span style={{cursor:'pointer', float:'right'}} onClick={()=>{this.initErrores();this.props.modalInsertar()}}>X</span>
                    </ModalHeader>
                    <ModalBody>
                        <div className="form-group">
                            <label htmlFor="nombre">Nombre de Proyecto</label>
                            <input className={(this.state.errorInputNombre)? "form-control is-invalid" : "form-control"} type="text" name="nombre" id="nombre" placeholder="Ingrese el nombre que desea asignar al proyecto" onChange={this.changeHandler} value={this.state.proyecto.nombre} onClick={() => {this.setState({errorInputNombre : ''})}} />
                            <div class="invalid-feedback" style={{display: 'block'}}>
                                {this.state.errorInputNombre}
                            </div>
                            <br/>
                            <label htmlFor="id_proyecto">Jefe de Proyecto</label>
                            <div style={{display:'flex', alignItems:'center'}}>
                                <input className="form-control" type="text" style={{width:'75%', display:'inline', marginRight:'5px', backgroundColor:'#fff'}} name="id_usuario" id="id_usuario" value={nombre_usuario} disabled/>
                                <button className="btn btn-primary" style={{width:'25%', display:'inline'}} onClick={this.cambiarEstadoAbrir}>Elegir Jefe</button>
                            </div>
                            <SeleccionJefe
                                usuariosJefe = {this.state.jefes_proyectos}
                                abrir = {this.state.estadoModal}
                                cambiarEstadoAbrir = {this.cambiarEstadoAbrir}
                                valorInput = {this.state.proyecto.id_usuario}
                                cambiarJefe = {this.cambiarJefe}
                            />
                            <div class="invalid-feedback" style={{display: 'block'}}>
                                {this.state.errorJefeProyecto}
                            </div>
                            <br/>
                            <div id="ChipsEmpresasAsociadas" onClick={() => {this.setState({errorEmpresasAsociadas : ''})}}>
                                <ChipsProyecto
                                    id_proyecto = {this.state.proyecto.id_proyecto}
                                    empresas = {this.state.empresas}
                                    insertarChip = {this.insertarChip}
                                    eliminarChip = {this.eliminarChip}
                                    seleccionadas = {this.state.empresasSeleccionadas}
                                />
                            </div>
                            <div class="invalid-feedback" style={{display: 'block'}}>
                                {this.state.errorEmpresasAsociadas}
                            </div>
                            <br/>
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
                            <button className="btn btn-danger" onClick={()=>{this.props.modalInsertar();this.initErrores()}}>Cancelar</button>
                    </ModalFooter>
                </Modal>
            </React.Fragment>
        );
    }
}

export default ProyectoModal;