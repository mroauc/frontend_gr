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
        const urlGlosario = url + this.props.match.params.id_glosario;
        console.log(urlGlosario);
        Axios.get(urlGlosario).then(response=>{
            this.setState({
                data : response.data
            });
            console.log(response.data);
        })
    }

    componentDidMount(){
        this.getPalabras();
    }


    render(){
        return(
        
        // <div>
        //         <h1>{this.props.match.params.id_glosario}</h1>
        //     </div> 
   
         
            <div className="glosario col-10">
                <div className="Encabezado"><p>Glosario ID: {this.props.match.params.id_glosario}</p></div>

                {/* <button type="button" class="btn boton" onClick={() => this.cambiarEstadoInsertar()}>Ingresar Palabra</button> */}

                <table class="table table-hover">
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
                                    {/* <td >
                                        <button type="button" class="btn btn-warning" data-toggle="modal" data-target="#modalEditar" onClick={() => this.obtenerGlosario(glosario)}>Editar</button> &nbsp;
                                        <button type="button" class="btn btn-danger" data-toggle="modal" data-target="#modalEditar" onClick={() => this.eliminarGlosario(glosario.id_glosario)}>Eliminar</button> &nbsp;
                                        <Link><button className="btn btn-success" onClick={console.log("hi")} >Ver Definiciones</button></Link>
                                        
                                    </td> */}

                                </tr>
                            )
                        })}
                    
                    </tbody>
                </table> 
                </div>
                  
        );
    }
}