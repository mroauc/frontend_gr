import React, {Component} from 'react';
import { Chip, Avatar } from '@material-ui/core';
import Axios from 'axios';

export default class ChipsPropiedades extends Component{
    state={
        requerimientos: [],
        arregloChips: [],
        requerimiento: ''
    }

    componentWillReceiveProps(next_props){
        this.setState({
            requerimientos: next_props.requerimientos,
            arreglosChips : next_props.valoresInput
        });
            
    }

    handleDelete = async(requerimiento) =>{
        const filtrado = this.state.arregloChips.filter(item => item !== requerimiento);
        
        await this.setState({
            arregloChips : filtrado
        });

        this.props.eliminarChip(requerimiento);
    }

    changeInputRequerimiento = (e) => {
        this.setState({
            requerimiento : e.target.value
          });
    }

    crearChip = async () => {
        if(this.state.requerimiento === '')
            return;

        if(!this.state.arregloChips.includes(this.state.requerimiento)){
            await this.setState({
                arregloChips: [ ...this.state.arregloChips, this.state.requerimiento],
              });
            this.props.insertarChip(this.state.requerimiento);
        }               
    }

    render(){
        return(
            <React.Fragment>
                <div className="divf">
                    {/* <div className="input-group">
                        <select className="form-control" style={{width: '70%'}} onChange={this.changeInputRequerimiento}>
                            <option value="">Elige un Requerimiento</option>
                            {this.state.requerimientos.map( requerimiento => {
                                if(requerimiento.id_requerimiento !== this.props.id_requerimiento){
                                return(
                                    <option key={requerimiento.id_requerimiento} value={requerimiento.id_requerimiento}>{requerimiento.nombre}</option>
                                )
                                }
                            }
                            )}
                        </select>
                        <button className="btn btn-primary" style={{width: '20%', float: 'right', marginLeft: '5px'}} onClick={() => this.crearChip()}>Elegir</button>
                    </div> */}
                    
                    <div className="divf" style={{marginTop: '5px', padding: '3px'}}>
                        {this.props.valoresInput.length === 0 ? <p className="texto">No hay relación con el requerimiento.</p> : ""}
                        {this.props.valoresInput.map(id_requerimiento => {
                            return(
                                <Chip key={id_requerimiento} label={id_requerimiento} onDelete={() => this.handleDelete(id_requerimiento)}/>   
                            )
                        })
                        }
                    </div>
                </div>     
            </React.Fragment>
        )
    }

}