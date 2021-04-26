import {Component} from "react";

export default class Logout extends Component{

    componentWillMount(){
        localStorage.removeItem('token');
        localStorage.removeItem('rol');
        localStorage.removeItem('email');
        localStorage.removeItem('id');
        localStorage.removeItem('nombre');
        localStorage.removeItem('tipo');
        localStorage.removeItem('celda');
        localStorage.removeItem('color_bckgr');
        this.props.history.push("/");
    }

    render(){
        return null;
    }
}