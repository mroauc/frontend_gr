import React, {Component} from 'react';
import { Chip, Avatar } from '@material-ui/core';
import Axios from 'axios';

export default class ChipsClientes extends Component{
    state={
        clientes: [],
        arregloChips: [],
        cliente: ""
    }

    componentDidMount(){
        if(this.props.id_subproyecto !== 0){
            var existentes = [];
            for (let index = 0; index < this.props.clientes.length; index++) {
                existentes.push(this.props.clientes[index].id.toString());
            }

            const token = localStorage.getItem('token');
            Axios.get(localStorage.getItem("url")+`/api/encargadosubproyecto/obtener/${this.props.id_subproyecto}`,{headers: {"Authorization": `Bearer ${token}`}})
            .then(response=>{
                for (let index = 0; index < response.data.length; index++) {
                    if(existentes.includes(response.data[index].id_usuario.toString())){
                        this.setState({
                            arregloChips: [ ...this.state.arregloChips, response.data[index].id_usuario.toString()]
                        });
                        this.props.insertarChip(response.data[index].id_usuario.toString());
                    }
                }
            })
        }
    }

    handleDelete=(cliente)=>{
        const filtrado = this.state.arregloChips.filter(item => item !== cliente);
        this.setState({
            arregloChips : filtrado
        });
        this.props.eliminarChip(cliente);
    }

    changeInputEmpresa=(e)=>{
        this.setState({
            cliente : e.target.value
        });
    }

    crearChip=async()=>{
        if(this.state.cliente === '')
            return;

        if(!this.state.arregloChips.includes(this.state.cliente)){
            await this.setState({
                arregloChips: [ ...this.state.arregloChips, this.state.cliente],
              });

            this.props.insertarChip(this.state.cliente);
        }               
    }

    componentWillReceiveProps(props){
        this.setState({arregloChips: props.seleccionados});
    }

    render(){   
        return(
            <React.Fragment>
                <div className="divf2">
                    {this.state.arregloChips.length === 0 ? "No hay Clientes Asociados." :
                        <React.Fragment>
                            {this.state.arregloChips.map(id_cliente => {
                                return(
                                    <Chip key={id_cliente} label={id_cliente} onDelete={() => this.handleDelete(id_cliente)}/>   
                                )
                            })
                            }
                        </React.Fragment>
                    }
                </div>
            </React.Fragment>
                      
        );
    }
}