import Axios from 'axios';
import React, {Component} from 'react';
import Menu from '../Menu/Menu';
import TablaVistaPreviaErrores from './TablaVistaPreviaErrores';

class VistaPreviaErrores extends Component{

    state={
        proyectos: []
    }

    componentDidMount(){
        this.getProyectos();
        this.cargarColor();
    }

    cargarColor=()=>{
        var divPrincipal = document.getElementById("principal");
        divPrincipal.style.backgroundColor = localStorage.getItem('color_bckgr');
    }

    getProyectos = async ()=>{
        const token = localStorage.getItem('token');
        const tipo_usuario = localStorage.getItem("tipo");
        const id_usuario = localStorage.getItem("id");
        await Axios.get(localStorage.getItem('url') + `/api/proyecto/id_usuario/${id_usuario}/${tipo_usuario}`, {headers: {"Authorization": `Bearer ${token}`}})
        .then(response=>{
            this.setState({
                proyectos: response.data
            });
        })
    }

    render(){
        return(
            <React.Fragment>
                <Menu/>
                <div id="principal" className="contenedorPrincipal">
                <div className="errores col-10">
                    <div className="Encabezado"><p>Errores</p></div>
                    <div style={{marginLeft:'5%'}}>
                        <label> <strong>Seleccione el proyecto donde desea indicar un error</strong></label>
                    </div>

                    <TablaVistaPreviaErrores
                        proyectos={this.state.proyectos}
                    />
                </div>
                </div>
            </React.Fragment>
        );
    }
}

export default VistaPreviaErrores;