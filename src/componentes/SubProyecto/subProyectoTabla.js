import Axios from 'axios';
import React, { Component } from 'react'
import { Link } from 'react-router-dom';
import SubProyecto from './SubProyecto';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';

export default class subProyectoTabla extends Component {
    
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
                            <th scope="col">Nombre</th>
                            <th scope="col">Fecha de Inicio</th>
                            <th scope="col">Fecha de Termino</th>
                            <th scope="col">ID Proyecto</th>
                            <th scope="col">Tipo Proyecto</th>
                            <th scope="col">Usuario</th>
                            <th scope="col">Acciones</th>

                            </tr>
                        </thead>
                        <tbody>
                            {this.props.subProyectos.map((subProyecto, index) => {
                                return(
                                    <tr key={subProyecto.id_subProyecto}>
                                        <td scope="col">{index+1}</td>
                                        <td>{subProyecto.nombre_subProyecto}</td>
                                        <td>{subProyecto.fecha_inicio}</td>
                                        <td>{subProyecto.fecha_fin}</td>
                                        <td>{subProyecto.id_proyecto}</td>
                                        <td>{subProyecto.tipo_subProyecto}</td>
                                        <td>{this.buscarUsuario(subProyecto.id_usuario)}</td>
                                        <td>
                                            <Link to= {`/requerimiento/${subProyecto.id_subProyecto}`}><button type="button" className="btn botonpurple">Requerimientos</button> </Link>
                                            <button type="button" className="btn btn-warning" data-toggle="modal" data-target="#modalEditar" onClick={() => this.props.obtenerSubProyecto(subProyecto)}><EditIcon/></button> &nbsp;
                                            <button type="button" className="btn btn-danger" data-toggle="modal" data-target="#modalEditar" onClick={() => this.props.cambiarEstadoEliminar(subProyecto)}><DeleteIcon/></button>
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