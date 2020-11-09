import Axios from 'axios';
import { extend } from 'jquery'
import React, { Component } from 'react'
import TemplateTextEditor from '../Template/TemplateTextEditor';
import ParteInferior from './InferiorTablaVista/ParteInferior';
import Tabs from './Tabs/Tabs';
import './Tabs/Tabs.css';
import './Manager.css';




export default class TablaVista extends Component {

    obtener=()=>{
        
    }
    
    generarTabs = () => {
        return(
            <React.Fragment>
                {
                    this.props.tabs.map((reqID) => {
                        var filtrado = this.props.requerimientos.filter(requerimiento => requerimiento.nombre === reqID);
                        return(
                            <div label={reqID}>
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
                            <h1>Cuerpo de la pagina</h1> 
                        </div>

                        {this.generarTabs()}
                    </Tabs>
                </div>
            </div>
        );
    }
}