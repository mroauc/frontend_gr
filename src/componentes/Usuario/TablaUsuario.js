import React, { Component } from 'react'

class TablaUsuario extends Component{

    render(){
        return(
            <div>
                <table className="table table-hover">
                    <thead>
                        <tr>
                            <th scope="col">#</th>
                            <th scope="col">Nombre</th>
                            <th scope="col">Email</th>
                            <th scope="col">Tipo</th>
                            <th scope="col">Estado</th>
                            <th scope="col">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.props.usuarios.map((usuario,index)=>{
                            return(
                                <tr key={usuario.id_usuario}>
                                    <td>{index+1}</td>
                                    <td>{usuario.nombre}</td>
                                    <td>{usuario.email}</td>
                                    <td>{usuario.tipo}</td>
                                    <td>{usuario.estado}</td>
                                    <td>
                                        <button className="btn btn-warning" onClick={()=>this.props.editar(usuario)}>Editar</button> &nbsp;
                                        <button className="btn btn-danger" onClick={()=>this.props.modalEliminar(usuario)}>Eliminar</button>
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

export default TablaUsuario;