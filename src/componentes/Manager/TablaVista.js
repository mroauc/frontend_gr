import Axios from 'axios';
import { extend } from 'jquery'
import React, { Component } from 'react'
import TemplateTextEditor from '../Template/TemplateTextEditor';
import Tabs from './Tabs/Tabs';
import './Tabs/Tabs.css';
import '../vistaCrud.css';

export default class TablaVista extends Component {

    state={
        dataRequerimiento : ''
    }

    obtener=async(e)=>{
        await this.setState({
            dataRequerimiento: e
        });
    }

    insertar=(requerimiento)=>{
        var act = requerimiento;
        act.descripcion = this.state.dataRequerimiento;
        const token = localStorage.getItem('token');
        Axios.post('http://localhost:8080/api/requerimiento/editar/',act, {headers: {"Authorization": `Bearer ${token}`}})
    }
    
    generarTabs = () => {
        return(
            <React.Fragment>
                {
                    this.props.tabs.map((reqID) => {
                        var filtrado = this.props.requerimientos.filter(requerimiento => requerimiento.nombre === reqID);
                        return(
                            <div label={reqID}>
                                <button className="btn boton" onClick={()=>this.insertar(filtrado[0])}>Guardar</button>
                                <TemplateTextEditor
                                    template = {filtrado[0].descripcion}
                                    obtenerTemplate = {this.obtener}
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
            <div className="col-9" style={{height:'100%', display:'inline-block', padding: '0 0 0 5px'}}>
                <div className="tabla-vista">
                    <Tabs eliminarReqDeTab={this.props.eliminarReqDeTab}>
                        <div label="Página Principal"> 
                            <h1>Cuerpo de la pagina</h1> 
                        </div>

                        {this.generarTabs()}
                    </Tabs>
                </div>
            </div>
        );
    }
}