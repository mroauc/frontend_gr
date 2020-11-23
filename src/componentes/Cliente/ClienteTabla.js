import Axios from 'axios';
import React, { Component } from 'react';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';

export default class ClienteTabla extends Component {
    
    state={
        usuarios: []
    }

    buscarUsuario=(id_usuario)=>{
        for (let index = 0; index < this.state.usuarios.length; index++) {
            if(this.state.usuarios[index].id===id_usuario){
                return this.state.usuarios[index].nombre;
            }
            if(index === this.state.usuarios.length-1){
                this.getUsuarios();
            }
        }
        return '';
    }

    getUsuarios = () =>{
        const token = localStorage.getItem('token');
        Axios.get('http://localhost:8080/api/usuario/',{headers: {"Authorization": `Bearer ${token}`}})
        .then(response=>{
            this.setState({
                usuarios: response.data
            });
        })
    }

    componentDidMount(){
       this.getUsuarios();
    }
    
    render(){
        return(
            <div>
                <table className="table table-hover">
                    <thead>
                        <tr>
                            <th scope="col">#</th>
                            <th scope="col">Celular</th>
                            <th scope="col">ID Empresa</th>
                            <th scope="col">User</th>
                            <th scope="col">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.props.clientes.map((cliente,index) => {
                            return(
                                <tr key={cliente.id_cliente}>
                                    <td scope="col">{index+1}</td>
                                    <td>{cliente.celular}</td>
                                    <td>{cliente.id_empresa}</td>
                                    <td>{this.buscarUsuario(cliente.id_user)}</td> 
                                    <td>
                                        <button type="button" className="btn btn-warning" data-toggle="modal" data-target="#modalEditar" onClick={() => this.props.obtenerCliente(cliente)}><EditIcon/></button> &nbsp;
                                        <button type="button" className="btn btn-danger" data-toggle="modal" data-target="#modalEditar" onClick={() => this.props.cambiarEstadoEliminar(cliente)}><DeleteIcon/></button>
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