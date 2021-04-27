import Axios from 'axios';
import React, {Component} from 'react';
import { Modal, ModalBody, ModalFooter, ModalHeader} from 'reactstrap';
import swal from 'sweetalert';
import './cambiarColor.css';

class cambiarColor extends Component{
    state={
        user: '',
        colorSeleccionado: ''
    }

    componentDidMount = () => {
        this.cargarDatos();
    }

    cargarDatos=async()=>{
        const token=localStorage.getItem('token');
        await Axios.get(localStorage.getItem('url') + `/api/usuario/${localStorage.getItem('email')}`,{headers: {"Authorization": `Bearer ${token}`}})
        .then(response=>{
            this.setState({user: response.data});
        })
    }

    seleccionar=async(numero)=>{
        for (let index=0;index<4;index++){
            if(index===numero){
                if(index===0){
                    await this.setState({colorSeleccionado: '#FFFFFF'});
                }
                if(numero===1){
                    await this.setState({colorSeleccionado: '#B5B5B5'});
                }
                if(numero===2){
                    await this.setState({colorSeleccionado: '#8899A6'});
                }
                if(numero===3){
                    await this.setState({colorSeleccionado: '#fefafa'});
                }
                var elegido = document.getElementById("cir"+numero);
                elegido.style.border= "3px solid #555";
            }else{
                var elegido = document.getElementById("cir"+index);
                elegido.style.border="";
            }
        }
    }

    realizarCambio=async()=>{
        if(this.state.colorSeleccionado !== ''){
            const token = localStorage.getItem('token');
            var usr = this.state.user;
            usr.color_backgr = this.state.colorSeleccionado;
            await Axios.post(localStorage.getItem('url') + '/api/usuario/editar/',usr, {headers: {"Authorization": `Bearer ${token}`}});
            localStorage.setItem('color_bckgr',this.state.colorSeleccionado);
            this.setState({colorSeleccionado: ''});
        }
        this.props.cambiarEstadoModalColor();
    }

    render(){
        return(
            <Modal isOpen={this.props.estadoCambiarColor} toggle={()=>this.props.cambiarEstadoModalColor()}>
                <ModalHeader style={{display: 'block'}}>
                    <span>Seleccionar Color de Fondo</span>
                    <span style={{cursor:'pointer', float:'right'}} onClick={()=>this.props.cambiarEstadoModalColor()}>X</span>
                </ModalHeader>

                <ModalBody>
                    <label>Seleccione un color:</label><br/><br/>
                    <div className="container">
                        <div className="row">
                            <div className="col-2"></div>
                            <div className="col-2">
                                <div id="cir0" className="cir0" onClick={()=>this.seleccionar(0)}/>
                            </div>
                            <div className="col-2">
                                <div id="cir1" className="cir1" onClick={()=>this.seleccionar(1)}/>
                            </div>
                            <div className="col-2">
                                <div id="cir2" className="cir2" onClick={()=>this.seleccionar(2)}/>
                            </div>
                            <div className="col-2">
                                <div id="cir3" className="cir3" onClick={()=>this.seleccionar(3)}/>
                            </div>
                        </div>
                    </div>
                </ModalBody>

                <ModalFooter>
                    <button className="btn btn-success" onClick={()=>this.realizarCambio()}>Guardar Cambios</button>
                    <button className="btn btn-danger" onClick={()=>this.props.cambiarEstadoModalColor()}>Cancelar</button>
                </ModalFooter>
            </Modal>
        )
    }
}

export default cambiarColor;