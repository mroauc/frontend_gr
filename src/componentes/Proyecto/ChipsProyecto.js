import React, {Component} from 'react';
import { Chip, Avatar } from '@material-ui/core';
import './ChipsProyecto.css';
import Axios from 'axios';

export default class ChipsProyecto extends Component{

    state={
        empresas: [],
        arregloChips: [],
        empresa: ''
    }

    componentDidMount(){
        if(this.props.id_proyecto !== 0){
            const token = localStorage.getItem('token');
            Axios.get(`http://localhost:8080/api/proyecto_empresa/obtener/${this.props.id_proyecto}`,{headers: {"Authorization": `Bearer ${token}`}})
            .then(response=>{
                for (let index = 0; index < response.data.length; index++) {
                    this.setState({
                        arregloChips: [ ...this.state.arregloChips, response.data[index].id_empresa.toString()]
                    });
                    this.props.insertarChip(response.data[index].id_empresa.toString());
                }
            })
        }
    }

    handleDelete = (empresa) => {
        const filtrado = this.state.arregloChips.filter(item => item !== empresa);
        
        this.setState({
            arregloChips : filtrado
        });

        this.props.eliminarChip(empresa);
    }

    changeInputEmpresa = (e) => {
        this.setState({
            empresa : e.target.value
          });
    }

    crearChip = async () => {
        if(this.state.empresa === '')
            return;

        if(!this.state.arregloChips.includes(this.state.empresa)){
            await this.setState({
                arregloChips: [ ...this.state.arregloChips, this.state.empresa],
              });

            this.props.insertarChip(this.state.empresa);
        }               
    }

    render(){   
        return(
            <React.Fragment>
                <label style={{marginRight: '10px' }}>Empresas Asociadas</label>
                <div className="divf">
                    <div className="input-group">
                        <select className="form-control" onChange={this.changeInputEmpresa}>
                            <option value="">Elige una Empresa</option>
                            {this.props.empresas.map( empresa => {
                                return(
                                    <option key={empresa.id_empresa} value={empresa.id_empresa}>{empresa.id_empresa + " - " + empresa.razon_social}</option>
                                )
                            }
                            )}
                        </select>
                        <button className="btn btn-primary" style={{width: '20%', float: 'right', marginLeft: '5px'}} onClick={() => this.crearChip()}>Elegir</button>
                    </div>
                    
                    <div className="divf" style={{marginTop: '5px', padding: '3px'}}>
                        {this.state.arregloChips.map(id_empresa => {
                            return(
                                <Chip key={id_empresa} label={id_empresa} onDelete={() => this.handleDelete(id_empresa)}/>   
                            )
                        })
                        }
                    </div>
                </div>     
            </React.Fragment>
                      
        );
    }
}