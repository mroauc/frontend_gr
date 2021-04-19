import Axios from 'axios';
import React, { Component } from 'react';

const url=localStorage.getItem('url')+"/api/comentario/";

export default class ComentarioTabla extends Component {
    
    state={
        usuarios: []
    }

    buscarUsuario=(id_usuario)=>{
        for (let index = 0; index < this.state.usuarios.length; index++) {
            if(this.state.usuarios[index].id===id_usuario){
                return this.state.usuarios[index].nombre;
            }
        }
        return '';
    }

    componentDidMount(){
        const token = localStorage.getItem('token');
        Axios.get(localStorage.getItem("url")+'/api/usuario/',{headers: {"Authorization": `Bearer ${token}`}})
        .then(response=>{
            this.setState({
                usuarios: response.data
            });
        })
    }
    
    render(){
        return(
            <div>
                <table className="table table-hover">
                        <thead>
                            <tr>
                            <th scope="col">ID</th>
                            <th scope="col">Comentario</th>
                            <th scope="col">ID Requerimiento</th>
                            <th scope="col">ID Usuario</th>
                            <th scope="col">Fecha</th>
                            <th scope="col">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.props.comentarios.map((comentario,index) => {
                                return(
                                    <tr key={comentario.id_comentario}>
                                        <td scope="col">{index+1}</td>
                                        <td>{comentario.texto}</td>
                                        <td>{comentario.id_requerimiento}</td>
                                        <td>{this.buscarUsuario(comentario.id_usuario)}</td>
                                        <td>{comentario.fecha_ingreso}</td>
                                        <td>
                                            <button type="button" className="btn btn-warning" data-toggle="modal" data-target="#modalEditar" onClick={() => this.props.obtenerComentario(comentario)}>Editar</button> &nbsp;
                                            <button type="button" className="btn btn-danger" data-toggle="modal" data-target="#modalEditar" onClick={() => this.props.cambiarEstadoEliminar(comentario)}>Eliminar</button>
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
