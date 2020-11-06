import Axios from 'axios';
import { extend } from 'jquery'
import React, { Component } from 'react'
import TemplateTextEditor from '../Template/TemplateTextEditor';
import Tabs from './Tabs/Tabs';
import './Tabs/Tabs.css'

export default class TablaVista extends Component {

    obtener=()=>{
        
    }
    
    generarTabs = () => {
        return(
            <React.Fragment>
                {
                    this.props.tabs.map((reqID) => {
                        var filtrado = this.props.requerimientos.filter(requerimiento => requerimiento.nombre === reqID);
                        console.log(filtrado[0]);
                        return(
                            <div label={reqID}>
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