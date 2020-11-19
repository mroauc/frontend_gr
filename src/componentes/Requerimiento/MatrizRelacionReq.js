import Axios from 'axios';
import React, {Component} from 'react'
import { Link } from 'react-router-dom';
import Menu from '../Menu/Menu';
import '../vistaCrud.css';

class MatrizRelacionReq extends Component{

    state={
        requerimientos: [],
        relaciones_requerimientos: []
    }

    componentDidMount(){
        this.obtenerRequerimientos();
    }

    obtenerRequerimientos=async()=>{
        const token = localStorage.getItem('token');
        const id_subProyecto = this.props.match.params.id_subproyecto;
        var requeri = [];
        await Axios.get(`http://localhost:8080/api/requerimiento/obtener/${id_subProyecto}`,{headers: {"Authorization": `Bearer  ${token}`}})
        .then(response=>{
            for (let index = 0; index < response.data.length; index++) {
                requeri.push(response.data[index]);
            }
        })

        await this.setState({
            requerimientos : requeri
        });
        this.obtenerRelaciones();
    }

    obtenerRelaciones=async()=>{
        var relacion = [];
        const token = localStorage.getItem('token');
        for (let index = 0; index < this.state.requerimientos.length; index++) {
            await Axios.get(`http://localhost:8080/api/relacionrequerimientos/obtener/${this.state.requerimientos[index].id_requerimiento}`, {headers: {"Authorization": `Bearer  ${token}`}})
            .then(response=>{
                relacion.push(response.data);
            })
        }
        await this.setState({
            relaciones_requerimientos : relacion
        });
    }

    evaluarRelacion=(requerimiento_a, requerimiento_b)=>{
        if(this.state.relaciones_requerimientos.length>0){
            var consulta = this.state.relaciones_requerimientos[requerimiento_a].filter(indiv => indiv.id_requerimiento_b === this.state.requerimientos[requerimiento_b].id_requerimiento);
            if(consulta.length>0){
                return "X";
            }else{
                return "";
            }
        }else{
            return "";
        }
    }

    render(){
        return(
            <React.Fragment>
                <Menu />
                <div><br/>
                    <div className="cabeceraRR">
                        <h4>Listado de Relaciones entre Requerimientos</h4>
                    </div>

                    <table className="table table-hover">
                        <thead>
                            <tr>
                                <th>Requerimientos</th>
                                {this.state.requerimientos.map(req=>{
                                    return(
                                        <th>{req.nombre}</th>
                                    );
                                })}
                            </tr>
                        </thead>
                        <tbody>
                            {this.state.requerimientos.map((req, index)=>{
                                return(
                                    <tr>
                                        <th>{req.nombre}</th>
                                        {this.state.requerimientos.map((indiv, index2)=>{
                                            return(
                                                <td>{this.evaluarRelacion(index,index2)}</td>
                                            );
                                        })}
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>

                    <div style={{marginLeft: '30px'}}>
                        <Link to={"/requerimiento/"+this.props.match.params.id_subproyecto}><button type="button" className="btn boton">⬅ Volver</button></Link>
                    </div>

                </div>
            </React.Fragment>
        );
    }
}

export default MatrizRelacionReq;