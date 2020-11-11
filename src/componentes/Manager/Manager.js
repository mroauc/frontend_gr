import { extend } from 'jquery'
import React, { Component } from 'react'
import TablaRequerimiento from './TablaRequerimientos';
import './Manager.css';
import TablaVista from './TablaVista';
import Axios from 'axios';
import Menu from '../Menu/Menu';

export default class Manager extends Component {

    state = {
        requerimientos: [],
        reqsTab: [],
        clickTab:""
    }

    componentDidMount () {
        this.getRequerimientos();
    }

    getRequerimientos =  async() => {
        const token = localStorage.getItem("token");
        await Axios.get("http://localhost:8080/api/requerimiento/", {headers: {"Authorization": `Bearer  ${token}`}})
        .then(async response => {
            await this.setState({
                requerimientos: response.data
            });
        })
    }

    agregarReqATab = async (req) => {
        if(!this.state.reqsTab.includes(req)){
            await this.setState({
                reqsTab : [ ...this.state.reqsTab, req],
                clickTab: req
            })
        }
        else{
            await this.setState({clickTab: req});
        }   
    }

    consultaTabActivo = async () => {
        return this.state.clickTab;
    }

    eliminarReqDeTab = async (req) => {
        const filtrado = this.state.reqsTab.filter(item => item !== req);
        await this.setState({
            reqsTab : filtrado,
            clickTab : ""
        })
    }

    render(){
        return(
            <React.Fragment>
                <Menu/>
                <div className="col-12 manager">
                    <TablaRequerimiento
                        requerimientos = {this.state.requerimientos}
                        getRequerimientos = {this.getRequerimientos}
                        agregarReqATab = {this.agregarReqATab}
                    />
                    <TablaVista
                        tabs = {this.state.reqsTab}
                        eliminarReqDeTab = {this.eliminarReqDeTab}
                        requerimientos = {this.state.requerimientos}
                        clickTab = {this.consultaTabActivo}
                    />
                </div>
            </React.Fragment>
        );
    }
}