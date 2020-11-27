import Axios from 'axios';
import { extend } from 'jquery'
import React, { Component } from 'react'
import TemplateTextEditor from '../Template/TemplateTextEditor';
import ParteInferior from './InferiorTablaVista/ParteInferior';
import Tabs from './Tabs/Tabs';
import './Tabs/Tabs.css';
import '../vistaCrud.css';
import './Manager.css';
import PaginaPrincipal from './PaginaPrincipal';
import swal from 'sweetalert';
import SaveOutlinedIcon from '@material-ui/icons/SaveOutlined';

export default class TablaVista extends Component {

    state={
        dataRequerimiento : ''
    }

    obtener=async(e)=>{
        await this.setState({
            dataRequerimiento: e
        });
    }

    mostrarAlerta = () => {
        swal({
            title: "Guardado Correctamente",
            icon: "success",
            buttons: "Aceptar"
        })
    }



    insertar=(requerimiento)=>{
        var act = requerimiento;
        act.descripcion = this.state.dataRequerimiento;
        const token = localStorage.getItem('token');
        Axios.post('http://localhost:8080/api/requerimiento/editar/',act, {headers: {"Authorization": `Bearer ${token}`}})
        .then(
            this.mostrarAlerta()
        )
    }
    
    generarTabs = () => {
        return(
            <React.Fragment>
                {
                    this.props.tabs.map((reqID) => {
                        var filtrado = this.props.requerimientos.filter(requerimiento => requerimiento.nombre === reqID);
                        return(
                            <div label={reqID}>
                                <button className="btn boton" style={{marginBottom:'10px'}} onClick={()=>this.insertar(filtrado[0])}><SaveOutlinedIcon/></button>
                                <div className="editReq">
                                    <TemplateTextEditor
                                        template = {filtrado[0].descripcion}
                                        obtenerTemplate = {this.obtener}
                                    />       
                                </div>
                                <div className="barraDivisora"></div>
                                <ParteInferior
                                    requerimiento = {filtrado[0]}
                                />                               
                            </div>
                        )
                    })
                }
            </React.Fragment>
        );
    }

    render(){
        return(
            <div className="col-9" style={{height:'100%', display:'inline-block', padding: '0 0 0 5px', overflow:'hidden'}}>
                <div className="tabla-vista">
                    <Tabs eliminarReqDeTab={this.props.eliminarReqDeTab} consultaTabActivo={this.props.clickTab}>
                        <div label="Página Principal"> 
                            <PaginaPrincipal
                                requerimientos = {this.props.requerimientos}
                            /> 
                        </div>

                        {this.generarTabs()}
                    </Tabs>
                </div>
            </div>
        );
    }
}