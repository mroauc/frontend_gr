import Axios from 'axios';
import React, {Component} from 'react';
import './VersionesAnteriores.css';
import VisibilityIcon from '@material-ui/icons/Visibility';
import VistaVersionAnterior from './VistaVersionAnterior';

class VersionesAnteriores extends Component{
    state={
        versionesAnteriores: [],
        usuarios: [],
        modalVer: false,
        version: {
            id_version_anterior: '',
            estado: '',
            fecha: '',
            id_requerimiento: '',
            id_usuario: '',
            descripcion: '',
            nombre_descriptivo: '',
            prioridad: ''
        }
    }

    componentDidMount(){
        this.obtenerUsuarios();
        this.obtenerVersionesAnteriores();
    }

    obtenerUsuarios=async()=>{
        const token = localStorage.getItem('token');
        await Axios.get('http://localhost:8080/api/usuario/tipo/analista', {headers: {"Authorization": `Bearer ${token}`}})
        .then(response=>{
            this.setState({usuarios: response.data});
        });
    }

    obtenerVersionesAnteriores=async()=>{
        const token = localStorage.getItem('token');
        await Axios.get(`http://localhost:8080/api/versionanterior/requerimiento/${this.props.requerimiento.id_requerimiento}`, {headers: {"Authorization": `Bearer ${token}`}})
        .then(response=>{
            this.setState({versionesAnteriores: response.data});
        });
    }

    ver=async(versionAnterior)=>{
        await this.setState({version: versionAnterior});
        this.cambiarEstadoModal();
    }

    cambiarEstadoModal=()=>{
        this.setState({modalVer: !this.state.modalVer});
    }

    render(){
        return(
            <div style={{height: '98%', overflow: 'auto'}}>
                <label htmlFor="prioridad"><strong>Versiones Anteriores:</strong></label>
                <div className="muestraVersiones">
                    <table className="table table-hover">
                        <thead>
                            <tr>
                                <th scope="col">#</th>
                                <th scope="col">Fecha</th>
                                <th scope="col">Ver</th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.state.versionesAnteriores.map((versionAnterior, index)=>{
                                return(
                                    <tr key={versionAnterior.id_version_anterior}>
                                        <td>{index+1}</td>
                                        <td>{versionAnterior.fecha}</td>
                                        <td>
                                            <button className="btn btn-success" onClick={()=>this.ver(versionAnterior)}><VisibilityIcon/></button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
                <VistaVersionAnterior
                    version = {this.state.version}
                    usuarios = {this.state.usuarios}
                    modalVista = {this.state.modalVer}
                    cambiarEstadoModal = {this.cambiarEstadoModal}
                />
            </div>
        );
    }
}

export default VersionesAnteriores;