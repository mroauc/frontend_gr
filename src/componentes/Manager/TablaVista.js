import Axios from 'axios';
import { extend } from 'jquery'
import React, { Component } from 'react'
import Tabs from './Tabs/Tabs';
import './Tabs/Tabs.css'

export default class TablaVista extends Component {

    getRequerimientos =  async() => {
        const token = localStorage.getItem("token");
        await Axios.get("http://localhost:8080/api/requerimiento/", {headers: {"Authorization": `Bearer  ${token}`}})
        .then(async response => {
            await this.setState({
                requerimientos: response.data
            });
        })
    }

    

    generarTabs = () => {
        return(
            <React.Fragment>
                {
                    this.props.tabs.map((reqID) => {
                        
                        return(
                            <div label={reqID}>
                                <h1>{reqID}</h1>
                                
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