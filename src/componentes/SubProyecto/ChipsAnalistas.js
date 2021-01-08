import React, {Component} from 'react';
import { Chip, Avatar } from '@material-ui/core';
import Axios from 'axios';

export default class ChipsAnalistas extends Component{
    state={
        analistas: [],
        arregloChips: [],
        analista: ""
    }

    componentDidMount(){
        if(this.props.id_subproyecto !== 0){
            var existentes = [];
            for (let index = 0; index < this.props.analistas.length; index++) {
                existentes.push(this.props.analistas[index].id.toString());
            }

            const token = localStorage.getItem('token');
            Axios.get(`http://localhost:8080/api/encargadosubproyecto/obtener/${this.props.id_subproyecto}`,{headers: {"Authorization": `Bearer ${token}`}})
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

    handleDelete=(analista)=>{
        const filtrado = this.state.arregloChips.filter(item => item !== analista);
        this.setState({
            arregloChips : filtrado
        });
        this.props.eliminarChip(analista);
    }

    changeInputEmpresa=(e)=>{
        this.setState({
            analista : e.target.value
        });
    }

    crearChip=async()=>{
        if(this.state.analista === '')
            return;

        if(!this.state.arregloChips.includes(this.state.analista)){
            await this.setState({
                arregloChips: [ ...this.state.arregloChips, this.state.analista],
              });

            this.props.insertarChip(this.state.analista);
        }               
    }

    componentWillReceiveProps(props){
        this.setState({arregloChips: props.seleccionados});
    }

    render(){   
        return(
            <React.Fragment>
                <div className="divf">
                    <div className="divf" style={{marginTop: '5px', padding: '3px'}}>
                        {this.state.arregloChips.map(id_analista => {
                            return(
                                <Chip key={id_analista} label={id_analista} onDelete={() => this.handleDelete(id_analista)}/>   
                            )
                        })
                        }
                    </div>
                </div>     
            </React.Fragment>
        );
    }
}