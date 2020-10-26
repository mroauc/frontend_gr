import React, {Component} from 'react';
import { Chip, Avatar } from '@material-ui/core';
import './ChipsProyecto.css';

export default class ChipsProyecto extends Component{
    
    

    state={
        empresas: [],
        arregloChips: [],
        empresa: ''
    }

    componentDidMount(){
    }

    handleDelete = (empresa) => {
        const filtrado = this.state.arregloChips.filter(item => item !== empresa);
        
        this.setState({
            arregloChips : filtrado
        });
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
                arregloChips: [ ...this.state.arregloChips, this.state.empresa], /// PUSH AL ARREGLO CHIPS LA OPCION SELECCIONADA
              });
        }
        
    }

    render(){
        
        return(
            <React.Fragment>
                <label style={{marginRight: '10px' }}>Empresas Asociadas</label>
                <div className="divf">
                    <div className="input-group">
                        <select className="form-control" style={{width: '70%'}} onChange={this.changeInputEmpresa}>
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