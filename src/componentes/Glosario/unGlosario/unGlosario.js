import React, {Component} from 'react'
import { withRouter, RouteComponentProps, matchPath } from "react-router-dom";
import './unGlosario.css'
import '../../vistaCrud.css'
import Axios from 'axios';

const url = "http://localhost:8080/api/palabra/consulta/"

export default class unGlosario extends Component {

    state = {
        data : []
    }

    getPalabras = () => {
        const token = localStorage.getItem('token');

        const urlGlosario = url + this.props.match.params.id_glosario;
        console.log(urlGlosario);
        Axios.get(urlGlosario,{headers: {"Authorization": `Bearer  ${token}`}}).then(response=>{
            this.setState({
                data : response.data
            });
            console.log(response.data);
        })
    }

    componentDidMount(){
        console.log("hola amigo");
        this.getPalabras();
    }


    render(){
        return(
            <div className="glosario col-10">
                <div className="Encabezado"><p>Glosario ID: {this.props.match.params.id_glosario}</p></div>

                <table className="table table-hover">
                    <thead>
                        <tr>
                        <th scope="col">ID</th>
                        <th>Palabra</th>
                        <th>Significado</th>
                        <th>ID glosario </th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.state.data.map(palabra => {
                            return(
                                <tr>
                                    <td scope="col">{palabra.id_palabra}</td>
                                    <td>{palabra.palabra}</td>
                                    <td>{palabra.significado}</td>
                                    <td>{palabra.id_glosario}</td>

                                </tr>
                            )
                        })}
                    
                    </tbody>
                </table> 
                </div>
                  
        );
    }
}