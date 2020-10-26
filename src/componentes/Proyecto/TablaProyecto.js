import Axios from 'axios';
import React, { Component } from 'react'

class TablaProyecto extends Component{

    state={
        usuarios: [],
        subProyectos: []
    }

    componentDidMount(){
        const token = localStorage.getItem('token');
        Axios.get('http://localhost:8080/api/usuario/',{headers: {"Authorization": `Bearer ${token}`}})
        .then(response=>{
            this.setState({
                usuarios: response.data
            });
            Axios.get('http://localhost:8080/api/subProyecto/',{headers:{"Authorization": `Bearer ${token}`}})
            .then(response=>{
                this.setState({
                    subProyectos: response.data
                });
            })
        })
    }

    buscarUsuario=(id_usuario)=>{
        for (let index = 0; index < this.state.usuarios.length; index++) {
            if(this.state.usuarios[index].id===id_usuario){
                return this.state.usuarios[index].nombre;
            }else{
                return '';
            }
        }
    }

    cantidadSubProyectos=(id_proyecto)=>{
        var count=0;
        for (let index = 0; index < this.state.subProyectos.length; index++) {
            if(this.state.subProyectos[index].id_proyecto===id_proyecto){
                count++;
            }
        }
        return count;
    }

    render(){
        return(
            <div>
                <table className="table table-hover">
                    <thead>
                        <tr style={{textAlign:'center'}}>
                            <th scope="col">#</th>
                            <th scope="col">Nombre</th>
                            <th scope="col">Jefe de Proyecto</th>
                            <th scope="col">Fecha de Creacion</th>
                            <th scope="col">Subproyectos Ingresados</th>
                            <th scope="col">Editar</th>
                            <th scope="col">Eliminar</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.props.proyectos.map((proyecto,index)=>{
                            return(
                                <tr key={proyecto.id_proyecto} style={{textAlign:'center'}}>
                                    <td>{index+1}</td>
                                    <td>{proyecto.nombre}</td>
                                    <td>{this.buscarUsuario(proyecto.id_usuario)}</td>
                                    <td>{proyecto.fecha_creacion}</td>
                                    <td>{this.cantidadSubProyectos(proyecto.id_proyecto)}</td>
                                    <td>
                                        <button className="btn btn-warning" onClick={()=>this.props.editar(proyecto)}>Editar</button>
                                    </td>
                                    <td>
                                        <button className="btn btn-danger" onClick={()=>this.props.modalEliminar(proyecto)}>Eliminar</button>
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>
        );
    }
}

export default TablaProyecto;