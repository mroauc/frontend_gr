import { extend } from 'jquery'
import React, { Component } from 'react'
import TablaRequerimiento from './TablaRequerimientos';
import './Manager.css';
import TablaVista from './TablaVista';
import Axios from 'axios';
import Menu from '../Menu/Menu';

export default class Manager extends Component {

    state = {
        requerimientos: []
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

    render(){
        return(
            <React.Fragment>
                <Menu/>
                <div className="col-12 manager">
                    <TablaRequerimiento
                        requerimientos = {this.state.requerimientos}
                        getRequerimientos = {this.getRequerimientos}
                    />
                    <TablaVista/>
                </div>
            </React.Fragment>
        );
    }
}