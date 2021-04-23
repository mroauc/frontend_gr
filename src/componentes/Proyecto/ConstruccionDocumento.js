import Axios from 'axios';
import React, { Component } from 'react'
import Menu from '../Menu/Menu';
import './ConstruccionDocumento.css';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import CKEditor from '@ckeditor/ckeditor5-react';
import swal from 'sweetalert';
import {Link} from 'react-router-dom';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import DeleteIcon from '@material-ui/icons/Delete';
import DragnDropOrden from './DragnDropOrdenModulos';

const initSeccion = {
    id_seccion: '',
    nombre_seccion: '',
    contenido_seccion: '',
    id_proyecto : ''
}

export default class ConstruccionDocumento extends Component {
    
    state = {
        secciones : [],
        seccion : {
            id_seccion: '',
            nombre_seccion: '',
            contenido_seccion: '',
            id_proyecto : ''
        },
        newSeccion : {
            id_seccion: '',
            nombre_seccion: '',
            contenido_seccion: '',
            id_proyecto : this.props.match.params.id_proyecto
        },
        proyecto: {},
        errorInputInsertar : ''
    }

    componentDidMount(){
        this.getSecciones();
        this.getProyecto();
        this.cargarColor();
    }

    cargarColor=()=>{
        var divPrincipal = document.getElementById("principal");
        divPrincipal.style.backgroundColor = localStorage.getItem('color_bckgr');
    }

    getProyecto = async () => {
        const token = localStorage.getItem('token');
        await Axios.get(localStorage.getItem('url') + `/api/proyecto/${this.props.match.params.id_proyecto}`,{headers: {"Authorization": `Bearer  ${token}`}})
        .then(async response=>{
            await this.setState({
                proyecto: response.data
            })
           
        })
        console.log(this.state.proyecto);
    }

    getSecciones = async () => {
        const token = localStorage.getItem('token');
        await Axios.get(localStorage.getItem('url') + `/api/seccion/id_proyecto/${this.props.match.params.id_proyecto}`,{headers: {"Authorization": `Bearer  ${token}`}})
        .then(response=>{
            this.setState({
                secciones: response.data
            })
            console.log("getSecciones")
            console.log(response.data)
        })
    }

    guardarSeccion = async() =>{
        const token = localStorage.getItem('token');
        
        if(this.validar()){
            let seccionIngresada;
            await Axios.post(localStorage.getItem('url') + "/api/seccion/guardar",this.state.newSeccion,{headers: {"Authorization": `Bearer  ${token}`}})
            .then(response => {
                seccionIngresada = response.data;
            })
            await this.setState({
                newSeccion : {
                    id_seccion: '',
                    nombre_seccion: '',
                    contenido_seccion: '',
                    id_proyecto : this.props.match.params.id_proyecto
            }});
            await this.getSecciones();
            await this.setState({seccion : seccionIngresada});
        }
    }

    actualizarSeccion = async() =>{
        const token = localStorage.getItem('token');
        await Axios.post(localStorage.getItem('url') + "/api/seccion/guardar",this.state.seccion,{headers: {"Authorization": `Bearer  ${token}`}});
        this.alertaActualizar();
        await this.getSecciones();
    }

    eliminarSeccion = async() => {
        const token = localStorage.getItem('token');
        await Axios.delete(localStorage.getItem('url') + `/api/seccion/eliminar/${this.state.seccion.id_seccion}`,{headers: {"Authorization": `Bearer  ${token}`}})
        .then(response => {
            console.log(response.data);
        })
        this.setState({
            seccion : {
                id_seccion: '',
                nombre_seccion: '',
                contenido_seccion: '',
                id_proyecto : this.props.match.params.id_proyecto
            }
        })
        this.getSecciones();
    }

    getSeccion = async (e) => {
        if(e.target.value !== ""){

            const seccionEncontrada = this.state.secciones.find(item => item.id_seccion === parseInt(e.target.value));
            if(seccionEncontrada.contenido_seccion === null) seccionEncontrada.contenido_seccion = '';
            
            this.setState({seccion : seccionEncontrada});
        }
        else{
            this.setState({seccion : initSeccion})
        }
        
    }

    validar = () => {
        let validacion = true;
        if(this.state.newSeccion.nombre_seccion === ""){
            this.setState({errorInputInsertar : 'Ingrese un nombre para la sección'})
            validacion = false;
        }

        return validacion;
    }

    obtenerContenido = async (e) => {
        let copiaSeccion = this.state.seccion;
        copiaSeccion.contenido_seccion = e;
        await this.setState({seccion : copiaSeccion});
    }

    alertaActualizar = () => {
        swal({
            title: "Seccion Actualizada Correctamente",
            icon: "success",
            buttons: "Aceptar"
        })
    }

    changeHandler = async (e) => {
        await this.setState({
            newSeccion : {
              ...this.state.newSeccion, [e.target.name]: e.target.value
            }
          });
    }
    
    render(){
        return(
            <React.Fragment>
                <Menu/>
                <div id="principal" className="contenedorPrincipal">
                <div className="contenedor-construccion_d" style={{backgroundColor:"white"}}>
                    <label className="titulo-construccion_d">
                        <strong>Construcción de documento para proyecto:</strong> {this.state.proyecto.nombre} 
                    </label>
                    
                    <div className="inferior-contruccion_d">
                        <label htmlFor="secciones" style={{fontSize:'20px'}}><strong><u>Secciones</u></strong></label><br/>
                        <label htmlFor="secciones"><strong>Crear Seccion</strong></label>
                        <div>
                            <input className={(this.state.errorInputInsertar)? "form-control is-invalid inputCrear" : "form-control inputCrear"} type="text" name="nombre_seccion" id="nombre_seccion" placeholder="Nombre de Sección" value={this.state.newSeccion.nombre_seccion} onChange={this.changeHandler} onClick={() => {this.setState({errorInputInsertar: ''})}}/>
                            
                            <button className="btn btn-warning botonCrear" onClick={this.guardarSeccion}>Crear Nueva Sección</button>
                        </div>
                        <div class="invalid-feedback" style={{display: 'block'}}>
                            {this.state.errorInputInsertar}
                        </div>
                        <br/>
                        <label htmlFor="EditarSeccion"><strong>Editar Sección</strong></label>

                        <div style={{marginBottom:'.5rem'}}>
                            <button type="button" className="btn boton" style={{display: this.state.seccion.id_seccion===""? 'none' : 'inline', marginRight:'.5rem'}} onClick={this.actualizarSeccion}>Guardar</button>
                            <button className="btn btn-danger" style={{display: this.state.seccion.id_seccion===""? 'none' : 'inline'}} onClick={this.eliminarSeccion}><DeleteIcon/></button>
                        </div>
                        
                        <select className="form-control" type="text" name="id_seccion" id="id_seccion" onChange={this.getSeccion} value={this.state.seccion.id_seccion}>
                            <option value="">Selecciona una Sección</option>
                            {this.state.secciones.map(seccion => {
                                return(
                                <option value={seccion.id_seccion}>{seccion.id_seccion + " - " + seccion.nombre_seccion}</option>
                                )
                            })}
                        </select>
                        
                        <div style={{display: this.state.seccion.id_seccion === '' ? 'none' : 'block' , marginTop:'10px'}}>
                            <CKEditor
                                editor={ClassicEditor}
                                data={this.state.seccion.contenido_seccion}
                                onChange={ (event, editor)=>{
                                    const data= editor.getData();
                                    this.obtenerContenido(data);
                                }}
                            />
                        </div>
                        <br/>
                        <label htmlFor="modulos" style={{fontSize:'20px'}}><strong><u>Módulos</u></strong></label><br/>        
                        <label><strong>Orden de Módulos</strong><p>Arrastre los bloques de los modulos para indicar el orden en el que se mostrarán en el documento.</p></label>
                        <DragnDropOrden
                            idProyecto = {this.props.match.params.id_proyecto}
                        />


                    </div>
                </div>
                <br/>
                <Link to={"/subProyecto/"+this.props.match.params.id_proyecto} style={{position:'absolute', left:'2%', top:'88px'}}><button type="button" className="btn boton"><ArrowBackIcon/></button></Link>
                </div>
            </React.Fragment>
        );
    }
}