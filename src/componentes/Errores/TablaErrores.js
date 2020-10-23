import Axios from 'axios';
import React, { Component } from 'react'

export class TablaErrores extends Component{

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
        Axios.get('http://localhost:8080/api/usuario/',{headers: {"Authorization": `Bearer ${token}`}})
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
                            <th scope="col">#</th>
                            <th scope="col">Error</th>
                            <th scope="col">Usuario</th>
                            <th scope="col">Fecha Creacion</th>
                            <th scope="col">Editar</th>
                            <th scope="col">Eliminar</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.props.errores.map((singleError,index)=>{
                            return(
                                <tr key={singleError.id_error}>
                                    <td>{index+1}</td>
                                    <td>{singleError.contenido}</td>
                                    <td>{this.buscarUsuario(singleError.id_usuario)}</td>
                                    <td>{singleError.fecha}</td>
                                    <td>
                                        <button className="btn btn-warning" onClick={()=>this.props.editar(singleError)}>Editar</button>
                                    </td>
                                    <td>
                                        <button className="btn btn-danger" onClick={()=>this.props.modalEliminar(singleError)}>Eliminar</button>
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

export default TablaErrores;