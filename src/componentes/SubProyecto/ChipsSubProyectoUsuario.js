import React, {Component} from 'react';
import { Chip, Avatar } from '@material-ui/core';
import '../Chips.css';

export default class ChipsSubProyectoUsuario extends Component{

    state={
        usuarios: [],
        arregloChips: [],
        usuario: ''
    }

    componentDidMount(){
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