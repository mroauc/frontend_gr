
import Axios from 'axios';
import React, { Component } from 'react'
import Menu from '../Menu/Menu';
import './ConstruccionDocumento.css';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import CKEditor from '@ckeditor/ckeditor5-react';
import swal from 'sweetalert';

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
    }

    getProyecto = async () => {
        const token = localStorage.getItem('token');
        await Axios.get(`http://localhost:8080/api/proyecto/${this.props.match.params.id_proyecto}`,{headers: {"Authorization": `Bearer  ${token}`}})
        .then(async response=>{
            await this.setState({
                proyecto: response.data
            })
           
        })
        console.log(this.state.proyecto);
    }

    getSecciones = async () => {
        const token = localStorage.getItem('token');
        await Axios.get(`http://localhost:8080/api/seccion/id_proyecto/${this.props.match.params.id_proyecto}`,{headers: {"Authorization": `Bearer  ${token}`}})
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
            await Axios.post("http://localhost:8080/api/seccion/guardar",this.state.newSeccion,{headers: {"Authorization": `Bearer  ${token}`}})
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
        await Axios.post("http://localhost:8080/api/seccion/guardar",this.state.seccion,{headers: {"Authorization": `Bearer  ${token}`}});
        this.alertaActualizar();
        await this.getSecciones();
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
                <div className="contenedor-construccion_d">
                    <label className="titulo-construccion_d">
                        <strong>Construcción de documento para proyecto:</strong> {this.state.proyecto.nombre} 
                    </label>
                    
                    <div className="inferior-contruccion_d">
                        <label htmlFor="secciones"><strong>Secciones</strong></label>
                        <div>
                            <input className={(this.state.errorInputInsertar)? "form-control is-invalid inputCrear" : "form-control inputCrear"} type="text" name="nombre_seccion" id="nombre_seccion" placeholder="Nombre de Sección" value={this.state.newSeccion.nombre_seccion} onChange={this.changeHandler} onClick={() => {this.setState({errorInputInsertar: ''})}}/>
                            
                            <button className="btn btn-warning botonCrear" onClick={this.guardarSeccion}>Crear Nueva Sección</button>
                        </div>
                        <div class="invalid-feedback" style={{display: 'block'}}>
                            {this.state.errorInputInsertar}
                        </div>
                        <br/>
                        <label htmlFor="EditarSeccion"><strong>Editar Sección</strong></label>
                        <button type="button" className="btn boton" style={{display: this.state.seccion.contenido_seccion===""? 'none' : 'block', marginBottom:'.5rem'}} onClick={this.actualizarSeccion}>Guardar</button>
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

                    </div>
                </div>
            </React.Fragment>
        );
    }
}