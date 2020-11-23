import React, {Component} from 'react';
import { Chip, Avatar } from '@material-ui/core';
import Axios from 'axios';

export default class ChipsPropiedades extends Component{
    state={
        requerimientos: [],
        arregloChips: [],
        requerimiento: ''
    }

    componentDidMount(){
        this.cargarArreglos();
    }

    cargarArreglos=async()=>{
        const token = localStorage.getItem('token');
        await Axios.get(`http://localhost:8080/api/relacionrequerimientos/obtener/${this.props.id_requerimiento}`,{headers: {"Authorization": `Bearer ${token}`}})
        .then(response=>{
            for (let index = 0; index < response.data.length; index++) {
                this.setState({
                    arregloChips: [...this.state.arregloChips, response.data[index].id_requerimiento_b.toString()]
                });
                this.props.insertarChip(response.data[index].id_requerimiento_b.toString());
            }
        })
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
                    <div className="input-group">
                        <select className="form-control" style={{width: '70%'}} onChange={this.changeInputRequerimiento}>
                            <option value="">Elige un Requerimiento</option>
                            {this.props.requerimientos.map( requerimiento => {
                                if(requerimiento.id_requerimiento !== this.props.id_requerimiento){
                                return(
                                    <option key={requerimiento.id_requerimiento} value={requerimiento.id_requerimiento}>{requerimiento.nombre}</option>
                                )
                                }
                            }
                            )}
                        </select>
                        <button className="btn btn-primary" style={{width: '20%', float: 'right', marginLeft: '5px'}} onClick={() => this.crearChip()}>Elegir</button>
                    </div>
                    
                    <div className="divf" style={{marginTop: '5px', padding: '3px'}}>
                        {this.state.arregloChips.map(id_requerimiento => {
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