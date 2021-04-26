import Axios from 'axios';
import React, {Component} from 'react';
import './PropuestaCambio.css';

class PropuestaCambio extends Component{

    state={
        requerimiento: '',
        propuestas: [],
        impactosDir: []
    }

    componentDidMount(){
        this.index();
    }

    index=async()=>{
        const token = localStorage.getItem('token');
        this.setState({impactosDir:[], propuestas:[]});
        var existentes = [];
        await Axios.get(localStorage.getItem('url')+`/api/impacto_directo/obtener/requerimiento/${this.props.requerimiento.id_requerimiento}`,{headers: {"Authorization": `Bearer ${token}`}})
        .then(response=>{
            this.setState({impactosDir: response.data});
            existentes=response.data;
            this.getPropuestas(existentes);
        })
    }

    getPropuestas=async(existentes)=>{
        const token = localStorage.getItem('token');
        for (let index = 0; index < existentes.length; index++) {
            await Axios.get(localStorage.getItem('url')+`/api/propuestacambio/${existentes[index].id_propuesta_cambio}`,{headers: {"Authorization": `Bearer ${token}`}})
            .then(response=>{
                this.setState({
                    propuestas : [...this.state.propuestas, response.data]
                });
            })
        }
    }

    aprobar=async(propuesta)=>{
        const token = localStorage.getItem('token');
        var edit = propuesta;
        edit.estado="APROBADA";
        await Axios.post(localStorage.getItem('url')+'/api/propuestacambio/editar/',edit,{headers: {"Authorization": `Bearer ${token}`}})
        .then(response=>{
            this.index();
            this.notificar(edit, 'aprobada');
        });
    }

    rechazar=async(propuesta)=>{
        const token = localStorage.getItem('token');
        var edit = propuesta;
        edit.estado = "RECHAZADA";
        await Axios.post(localStorage.getItem('url')+'/api/propuestacambio/editar',edit,{headers: {"Authorization": `Bearer ${token}`}})
        .then(response=>{
            this.index();
            this.notificar(edit, 'rechazada');
        });
    }

    notificar=(propuesta, decision)=>{
        const token = localStorage.getItem('token');
        Axios.get(localStorage.getItem('url')+`/api/subProyecto/${propuesta.id_subproyecto}`, {headers: {"Authorization": `Bearer ${token}`}})
        .then(response=>{
            Axios.get(localStorage.getItem('url')+`/api/proyecto/${response.data.id_proyecto}`, {headers: {"Authorization": `Bearer ${token}`}})
            .then(response=>{
                Axios.get(localStorage.getItem('url')+`/api/usuario/id/${response.data.id_usuario}`, {headers: {"Authorization": `Bearer ${token}`}})
                .then(response=>{
                    console.log(response.data);
                    Axios.post(localStorage.getItem('url')+'/api/email/enviar',{
                        email: response.data.email,
                        content: "Se ha tomado una resolución sobre la propuesta de cambio: <strong>"+propuesta.nombre+"</strong>.<br>Dicha propuesta ha sido <strong>"+decision+"</strong><br><br>"+new Date().toLocaleString(),
                        subject: "Resolucion propuesta de cambio "+propuesta.nombre
                    }, {headers: {"Authorization": `Bearer ${token}`}});
                });
            });
        });
    }

    finalizar=async(propuesta)=>{
        const token = localStorage.getItem('token');
        await Axios.delete(localStorage.getItem('url')+`/api/propuestacambio/eliminar/${propuesta.id_propuestaCambio}`,{headers: {"Authorization": `Bearer ${token}`}})
        .then(response=>{
            var impacto_eliminar = this.state.impactosDir.filter(item => item.id_propuesta_cambio === propuesta.id_propuestaCambio);
            this.eliminarSegundaInstancia(impacto_eliminar[0].id_impacto_directo);
        })
    }

    eliminarSegundaInstancia=async(id_impacto_directo)=>{
        console.log(id_impacto_directo);
        const token = localStorage.getItem('token');
        await Axios.delete(localStorage.getItem('url')+`/api/impacto_directo/eliminar/${id_impacto_directo}`,{headers: {"Authorization": `Bearer ${token}`}})
        .then(response=>{
            this.index();
        })
    }

    render(){
        return(
            <div style={{height: '98%', overflow: 'auto'}}>
                <label htmlFor="prioridad"><strong>Propuestas de cambios:</strong></label>

                <div className="muestraPropuestas">
                    <table className="table table-hover">
                        <thead>
                            <tr>
                                <th scope="col">Nombre</th>
                                <th scope="col">Autor</th>
                                <th scope="col">Fecha Peticion</th>
                                <th scope="col">Estado</th>
                                <th scope="col">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.state.propuestas.map(propuesta=>{
                                return(
                                    <tr key={propuesta.id_propuestaCambio}>
                                        <td>{propuesta.nombre}</td>
                                        <td>{propuesta.id_usuario}</td>
                                        <td>{propuesta.fecha_peticion}</td>
                                        <td>{propuesta.estado}</td>
                                        {localStorage.getItem("tipo") === "analista" ? 
                                            "" :
                                            <React.Fragment>
                                                <td>
                                                    <button className="btn btn-success" onClick={()=>this.aprobar(propuesta)}>√</button>&nbsp;
                                                    <button className="btn btn-danger" onClick={()=>this.rechazar(propuesta)}>X</button>&nbsp;
                                                    <button className="btn btn-primary" onClick={()=>this.finalizar(propuesta)}>Finalizar</button>
                                                </td>
                                            </React.Fragment>
                                        }
                                        
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    }
}

export default PropuestaCambio;