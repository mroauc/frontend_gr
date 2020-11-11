import React, {Component} from 'react';
import { Chip, Avatar } from '@material-ui/core';
import '../Chips.css';
import Axios from 'axios';

export default class ChipsSubProyectoUsuario extends Component{

    state={
        usuarios: [],
        arregloChips: [],
        usuario: ''
    }

    componentDidMount(){
        if(this.props.id_subProyecto !== 0){
            var existentes = [];    //usuarios del tipo correspondiente disponibles
            var yaInsertados = [];  //usuarios ya ingresados del tipo

            for (let index = 0; index < this.props.usuarios.length; index++) {
                existentes= [...existentes, this.props.usuarios[index].id];
            }

            const token = localStorage.getItem('token');
            Axios.get(`http://localhost:8080/api/encargadosubproyecto/obtener/${this.props.id_subProyecto}`,{headers: {"Authorization": `Bearer ${token}`}})
            .then(response=>{
                for (let index = 0; index < response.data.length; index++) {
                    if(existentes.includes(response.data[index].id_usuario)){
                        yaInsertados = [...yaInsertados, response.data[index].id_usuario];
                    }
                }
                for (let index = 0; index < yaInsertados.length; index++) {
                    this.setState({
                        arregloChips: [ ...this.state.arregloChips, yaInsertados[index].toString()], /// PUSH AL ARREGLO CHIPS LA OPCION SELECCIONADA
                        });
        
                    this.props.ingresarChip(yaInsertados[index].toString());
                }
            })
        }
    }

    handleDelete = async (usuario) => {
        const filtrado = this.state.arregloChips.filter(item => item !== usuario);
        await this.setState({
            arregloChips : filtrado
        });
        this.props.eliminarChip(usuario);
    }

    changeInputCliente = (e) => {
        this.setState({
            usuario : e.target.value
          });
    }

    crearChip = async () => {
        if(this.state.usuario === '')
            return;

        if(!this.state.arregloChips.includes(this.state.usuario)){
            await this.setState({
                arregloChips: [ ...this.state.arregloChips, this.state.usuario], /// PUSH AL ARREGLO CHIPS LA OPCION SELECCIONADA
            });

            this.props.ingresarChip(this.state.usuario);
        }
        
    }

    render(){   
        return(
            <React.Fragment>
                <label style={{marginRight: '10px' }}> { this.props.tipo + " Asociados"} </label>
                <div className="divf">
                    <div className="input-group">
                        <select className="form-control" style={{width: '70%'}} onChange={this.changeInputCliente}>
                            <option value="">{"Seleccionar " + this.props.tipo } </option>
                            {this.props.usuarios.map( usuario => {
                                return(
                                    <option key={usuario.id} value={usuario.id}>{usuario.id + " - " + usuario.nombre}</option>
                                )
                            }
                            )}
                        </select>
                        <button className="btn btn-primary" style={{width: '20%', float: 'right', marginLeft: '5px'}} onClick={() => this.crearChip()}>Elegir</button>
                    </div>
                    
                    <div className="divf" style={{marginTop: '5px', padding: '3px'}}>
                    {(this.state.arregloChips.length === 0) ? <p className="texto">No hay {this.props.tipo} seleccionados</p> : 
                        this.state.arregloChips.map(id_usuario => {
                            return(
                                <Chip key={id_usuario} label={id_usuario} onDelete={() => this.handleDelete(id_usuario)}/>   
                            )
                        })
                    }
                    </div>
                </div>     
            </React.Fragment>
                      
        );
    }
}