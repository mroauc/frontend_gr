import Axios from 'axios';
import React, {Component} from 'react';
import ChipsPropiedades from './ChipsPropiedades';
import'./Propiedades.css'
import swal from 'sweetalert';
import SeleccionReq from './SeleccionReq/SeleccionReq';

class Propiedades extends Component{

    state={
        requerimiento: '',
        requerimientos: [],
        requerimientosSeleccionados: [],
        estadoModal: false,
        oldRequerimiento: ''
    }

    componentDidMount(){
        this.getRequerimientos();
        this.getRequerimiento();
        this.cargarArreglos();
    }

    getRequerimientos=async()=>{
        const token = localStorage.getItem('token');
        var subproys = [];
        var reqs = [];
        await Axios.get(`http://localhost:8080/api/subProyecto/${this.props.requerimiento.id_subProyecto}`, {headers: {"Authorization": `Bearer ${token}`}})
        .then(async response=>{
            await Axios.get(`http://localhost:8080/api/subProyecto/pertenecientes/${response.data.id_proyecto}`, {headers: {"Authorization": `Bearer ${token}`}})
            .then(async response=>{
                subproys = response.data;
                for (let index = 0; index < subproys.length; index++) {                    
                    await Axios.get(`http://localhost:8080/api/requerimiento/obtener/${subproys[index].id_subProyecto}`,{headers: {"Authorization": `Bearer ${token}`}})
                    .then(async response=>{
                        for (let index = 0; index < response.data.length; index++) {
                            reqs.push(response.data[index]);
                            await this.setState({requerimientos: reqs});
                        }
                    });
                }
            });
        });
    }

    getRequerimiento=async()=>{
        const token = localStorage.getItem('token');
        await Axios.get(`http://localhost:8080/api/requerimiento/${this.props.requerimiento.id_requerimiento}`, {headers: {"Authorization": `Bearer ${token}`}})
        .then(response=>{
            var req = response.data;
            this.setState({
                requerimiento: req,
                oldRequerimiento: req
            });
        });
    }

    mostrarAlerta = () => {
        swal({
            title: "Guardado Correctamente",
            icon: "success",
            buttons: "Aceptar"
        })
    }

    cambiarEstadoAbrir = () => {
        this.setState({estadoModal : !this.state.estadoModal})
    }

    changeHandler=async(e)=>{
        await this.setState({
            requerimiento:{
                ...this.state.requerimiento, [e.target.name]: e.target.value
            }
        });
    }

    cargarArreglos=async()=>{
        const token = localStorage.getItem('token');
        await Axios.get(`http://localhost:8080/api/relacionrequerimientos/obtener/${this.props.requerimiento.id_requerimiento}`,{headers: {"Authorization": `Bearer ${token}`}})
        .then(response=>{
            for (let index = 0; index < response.data.length; index++) {
                this.setState({
                    requerimientosSeleccionados: [...this.state.requerimientosSeleccionados, response.data[index].id_requerimiento_b.toString()]
                });
            }
        });
    }

    insertarRelaciones= async (nuevos_requerimientos)=>{
        await this.setState({
            requerimientosSeleccionados: nuevos_requerimientos
        })
        this.guardarChips();
        
    }


    eliminarRelacion=async(requerimiento)=>{
        const filtrado = this.state.requerimientosSeleccionados.filter(item => item != requerimiento);
        await this.setState({
            requerimientosSeleccionados: filtrado
        });
        this.guardarChips();
        
    }

    guardarCambios=async(atributo)=>{
        const token = localStorage.getItem('token');
        await Axios.post('http://localhost:8080/api/requerimiento/editar/',this.state.requerimiento, {headers: {"Authorization": `Bearer ${token}`}})
        .then(response=>{
            this.guardarCambioVersion(this.state.oldRequerimiento, response.data, atributo);
            this.mostrarAlerta();
        })
    }

    guardarCambioVersion=(antiguoRequerimiento, nuevoRequerimiento, atributo)=>{
        if(antiguoRequerimiento !== nuevoRequerimiento){
            const token = localStorage.getItem('token');
            Axios.post('http://localhost:8080/api/versionanterior/guardar/',{
                id_requerimiento: antiguoRequerimiento.id_requerimiento,
                nombre_descriptivo: antiguoRequerimiento.nombre_descriptivo,
                descripcion: antiguoRequerimiento.descripcion,
                prioridad: antiguoRequerimiento.prioridad,
                estado: antiguoRequerimiento.estado,
                id_usuario: antiguoRequerimiento.id_usuario,
                fecha: new Date().toLocaleString(),
                cambios_realizados: "Cambio de " + atributo
            }, {headers: {"Authorization": `Bearer ${token}`}});
        }
    }

    guardarChips=()=>{
        const token = localStorage.getItem('token');
        var existentes = [];
        var original = [];
        Axios.get(`http://localhost:8080/api/relacionrequerimientos/obtener/${this.state.requerimiento.id_requerimiento}`,{headers: {"Authorization": `Bearer ${token}`}})
        .then(response=>{
            original = response.data;
            for (let index = 0; index < response.data.length; index++) {
                existentes = [...existentes, response.data[index].id_requerimiento_b.toString()];
            }

            //eliminar
            for (let index = 0; index < existentes.length; index++) {
                if(!this.state.requerimientosSeleccionados.includes(existentes[index])){
                    Axios.delete(`http://localhost:8080/api/relacionrequerimientos/eliminar/${original[index].id_relacionRequerimientos}`,{headers: {"Authorization": `Bearer ${token}`}})
                    .then(response=>{
                    });
                }
            }

            //insertar
            for (let index = 0; index < this.state.requerimientosSeleccionados.length; index++) {
                if(!existentes.includes(this.state.requerimientosSeleccionados[index])){
                    Axios.post('http://localhost:8080/api/relacionrequerimientos/guardar/',{
                        id_requerimiento_a : this.state.requerimiento.id_requerimiento,
                        id_requerimiento_b : this.state.requerimientosSeleccionados[index]
                    }, {headers: {"Authorization": `Bearer ${token}`}});
                }
            }
        })
        this.mostrarAlerta();
    }

    accesoUsuario = () => {
        if(localStorage.getItem("tipo") === "admin" || localStorage.getItem("tipo") === "lider" || localStorage.getItem("tipo") === "jefe")
            return true;
        return false;
    }

    accesoUsuarioEstadoReq = (tipo) => {
        if(localStorage.getItem("tipo") === "analista"){
            if(this.state.requerimiento.estado === "Propuesto" || this.state.requerimiento.estado === "Redactado" || this.state.requerimiento.estado === "Aprobado"){
                if(tipo === "readonly") return "readonly"
                if(tipo === "disabled") return "true"
            }
        }
        return "";
    }

    render(){
        return(
            <div style={{height: '78%', overflow: 'auto', paddingTop:'10px'}}>

                <label htmlFor="prioridad"><strong>Se relaciona con:</strong></label>
                <div style={{width: '100%', marginBottom:'15px'}}>
                    <div className="areaCrear2">

                        <div className="col-9" style={{display:'flow-root', paddingLeft: '0'}}>
                            <ChipsPropiedades
                                id_requerimiento = {this.props.requerimiento.id_requerimiento}
                                requerimientos = {this.state.requerimientos}
                                insertarChip = {this.insertarRelaciones}
                                eliminarChip = {this.eliminarRelacion}
                                valoresInput = {this.state.requerimientosSeleccionados}
                            />
                        </div>
                    
                        <div className="col-3 cont-boton-prop">
                            <button className="btn btn-success btn-block" onClick={()=>this.cambiarEstadoAbrir()}>Asignar Relacion</button>
                        </div>

                        <SeleccionReq
                            id_requerimiento = {this.props.requerimiento.id_requerimiento}
                            requerimientos = {this.state.requerimientos}
                            abrir = {this.state.estadoModal}
                            cambiarEstadoAbrir = {this.cambiarEstadoAbrir}
                            insertarRelaciones = {this.insertarRelaciones}
                            valoresInput = {this.state.requerimientosSeleccionados}
                        />

                    </div>
                </div>

                {
                     this.accesoUsuario() ? 
                         <React.Fragment>
                            <label htmlFor="prioridad"><strong>Prioridad:</strong></label>
                            <div style={{width:'100%', marginBottom:'15px'}}>
                                <div className="areaCrear3">
                                    <div className="col-9" style={{paddingLeft: '0'}}>
                                        <select className="form-control" name="prioridad" id="prioridad" value={this.state.requerimiento.prioridad} onChange={this.changeHandler} disabled={localStorage.getItem("tipo") === "analista" ? true : false} readOnly={localStorage.getItem("tipo") === "analista" ? true : false}>
                                            <option value="Baja">Baja</option>
                                            <option value="Media">Media</option>
                                            <option value="Alta">Alta</option>
                                        </select>
                                    </div>
                                    <div className="col-3 cont-boton">
                                        <button className="btn btn-success btn-block" onClick={() => this.guardarCambios("prioridad")}>Cambiar Prioridad</button>
                                    </div>
                                </div>
                            </div>
                        </React.Fragment>
                        : ""
                }

                <label htmlFor="estado"><strong>Estado:</strong></label><br/>
                <div className="areaCrear3" style={{marginBottom:'15px'}}>
                    <div className="col-9" style={{paddingLeft: '0'}}>
                            <select className="form-control" name="estado" id="estado" value={this.state.requerimiento.estado} onChange={this.changeHandler} readOnly={this.accesoUsuarioEstadoReq("readonly")} disabled={this.accesoUsuarioEstadoReq("disabled")}>
                                {this.accesoUsuario() ? 
                                    <React.Fragment>
                                        <option value="Propuesto">Propuesto</option>
                                        <option value="Redactado">Redactado</option>
                                        <option value="Aprobado">Aprobado</option>
                                    </React.Fragment>
                                    : ""
                                }
                                <option value="Por Hacer">Por Hacer</option>
                                <option value="En Proceso">En Proceso</option>
                                <option value="Hecho">Hecho</option>
                            </select>
                    </div>
                    <div className="col-3 cont-boton">
                        <button className="btn btn-success btn-block" onClick={()=>{this.guardarCambios("estado")}}>Cambiar Estado</button>
                    </div>
                </div>
                <label htmlFor="descripcion"><strong>Descripcion:</strong></label><br/>
                <div className="areaCrear3">
                    <div className="col-9" style={{paddingLeft: '0'}}>
                            <input id="nombre_descriptivo" name="nombre_descriptivo" className="form-control" value={this.state.requerimiento.nombre_descriptivo} onChange={this.changeHandler}></input>
                    </div>
                    <div className="col-3 cont-boton">
                        <button className="btn btn-success btn-block" onClick={()=>{this.guardarCambios("descripción")}}>Cambiar Descripción</button>
                    </div>
                </div>
            </div>
        )
    }
}

export default Propiedades;