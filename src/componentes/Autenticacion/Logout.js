import {Component} from "react";

export default class Logout extends Component{

    componentWillMount(){
        localStorage.removeItem('token');
        localStorage.removeItem('rol');
        localStorage.removeItem('email');
        localStorage.removeItem('id');
        localStorage.removeItem('nombre');
        this.props.history.push("/");
    }

    render(){
        return null;
    }
}