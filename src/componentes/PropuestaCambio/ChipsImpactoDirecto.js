import React, {Component} from 'react';
import { Chip, Avatar } from '@material-ui/core';
import Axios from 'axios';

class ChipsImpactoDirecto extends Component{

    state={
        requerimientos : [],
        arregloChips : [],
        requerimiento : '',
    }

    componentDidMount(){
        this.index();
        this.obtenerExistentes();
    }

    index=async()=>{
        const token = localStorage.getItem('token');
        const subp = this.props.subProyectos;
        for (let index = 0; index < subp.length; index++) {
            await Axios.get(`http://localhost:8080/api/requerimiento/obtener/${subp[index].id_subProyecto}`,{headers: {"Authorization": `Bearer ${token}`}})
            .then(response=>{
                for (let index = 0; index < response.data.length; index++) {
                    this.setState({
                        requerimientos: [...this.state.requerimientos, response.data[index]]
                    });
                }
            })
        }
    }

    obtenerExistentes=()=>{
        const token = localStorage.getItem('token');
        Axios.get(`http://localhost:8080/api/impacto_directo/obtener/${this.props.id_propuestaCambio}`,{headers: {"Authorization": `Bearer ${token}`}})
        .then(response=>{
            for (let index = 0; index < response.data.length; index++) {                
                this.setState({
                    arregloChips : [...this.state.arregloChips, response.data[index].id_requerimiento.toString()]
                });
                this.props.insertarChip(response.data[index].id_requerimiento.toString());
            }
        })
    }

    changeInput = (e) => {
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

    handleDelete = (requerimiento) => {
        const filtrado = this.state.arregloChips.filter(item => item !== requerimiento);
        
        this.setState({
            arregloChips : filtrado
        });

        this.props.eliminarChip(requerimiento);
    }

    render(){
        return(
            <React.Fragment>
                <label style={{marginRight: '10px' }}>Impacto Directo</label>
                <div className="divf">
                    <div className="input-group">
                        <select className="form-control" style={{width: '70%'}} onChange={this.changeInput}>
                            <option value="">Elige un Requerimiento</option>
                            {this.state.requerimientos.map( requerimiento => {
                                return(
                                    <option key={requerimiento.id_requerimiento} value={requerimiento.id_requerimiento}>{requerimiento.nombre}</option>
                                )
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
        );
    }
}

export default ChipsImpactoDirecto;