import Axios from 'axios';
import React, {Component} from 'react';
import ChipsPropiedades from './ChipsPropiedades';
import'./Propiedades.css'


class Propiedades extends Component{

    state={
        requerimiento: '',
        requerimientos: [],
        requerimientosSeleccionados: []
    }

    componentDidMount(){
        this.getRequerimiento();
    }

    getRequerimiento=async()=>{
        const token = localStorage.getItem('token');
        await Axios.get('http://localhost:8080/api/requerimiento/',{headers: {"Authorization": `Bearer ${token}`}})
        .then(response=>{
            this.setState({
                requerimientos: response.data,
                requerimiento: this.props.requerimiento,
            });
        })
    }

    changeHandler=async(e)=>{
        await this.setState({
            requerimiento:{
                ...this.state.requerimiento, [e.target.name]: e.target.value
            }
        });
    }

    insertarChip=(requerimiento)=>{
        this.setState({
            requerimientosSeleccionados: [...this.state.requerimientosSeleccionados, requerimiento],
        });
    }

    eliminarChip=async(requerimiento)=>{
        const filtrado = this.state.requerimientosSeleccionados.filter(item => item != requerimiento);
        await this.setState({
            requerimientosSeleccionados: filtrado
        });
    }

    guardarCambios=()=>{
        const token = localStorage.getItem('token');
        Axios.post('http://localhost:8080/api/requerimiento/editar/',this.state.requerimiento, {headers: {"Authorization": `Bearer ${token}`}})
        .then(response=>{})
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
    }

    render(){
        return(
            <div style={{height: '98%', overflow: 'auto'}}>

                <div className="areaCrear2">
                    <div className="col-9" style={{paddingLeft: '0'}}>
                        <label htmlFor="prioridad"><strong>Se relaciona con:</strong></label>
                           <ChipsPropiedades
                                id_requerimiento = {this.props.requerimiento.id_requerimiento}
                                requerimientos = {this.state.requerimientos}
                                insertarChip = {this.insertarChip}
                                eliminarChip = {this.eliminarChip}
                           />
                    </div>
                    <div className="col-3 cont-boton">
                        <button className="btn btn-success btn-block" onClick={this.guardarChips}>Asignar Relacion</button>
                    </div>
                </div>

                <div className="areaCrear3">
                    <div className="col-9" style={{paddingLeft: '0'}}>
                        <label htmlFor="prioridad"><strong>Prioridad:</strong></label>
                            <select className="form-control" name="prioridad" id="prioridad" value={this.state.requerimiento.prioridad} onChange={this.changeHandler}>
                                <option value="Baja">Baja</option>
                                <option value="Media">Media</option>
                                <option value="Alta">Alta</option>
                            </select>
                    </div>
                    <div className="col-3 cont-boton">
                        <button className="btn btn-success btn-block" onClick={this.guardarCambios}>Cambiar Prioridad</button>
                    </div>
                </div>

                <div className="areaCrear3">
                    <div className="col-9" style={{paddingLeft: '0'}}>
                        <label htmlFor="estado"><strong>Estado:</strong></label><br/>
                            <select className="form-control" name="estado" id="estado" value={this.state.requerimiento.estado} onChange={this.changeHandler}>
                                <option value="Creado">Creado</option>
                                <option value="En Redaccion">En Redaccion</option>
                                <option value="Aprobado">Aprobado</option>
                            </select>
                    </div>
                    <div className="col-3 cont-boton">
                        <button className="btn btn-success btn-block" onClick={this.guardarCambios}>Cambiar Estado</button>
                    </div>
                </div>

            </div>
        )
    }
}

export default Propiedades;