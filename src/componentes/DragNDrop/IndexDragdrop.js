import React, {Component} from 'react';
import Menu from '../Menu/Menu';
import Dragdrop from './Dragdrop';
import {Link} from 'react-router-dom';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import { Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import './DragDrop.css';
import Axios from 'axios';

class IndexDragdrop extends Component{

    state={
        abrirModal : false,
        colorSeleccionado: '',
        user: ''
    }

    componentDidMount(){
        this.cargarColor();
    }

    cargarColor=async()=>{
        const token = localStorage.getItem('token');
        await Axios.get(`http://localhost:8080/api/usuario/${localStorage.getItem('email')}`,{headers: {"Authorization": `Bearer ${token}`}})
        .then(response=>{
            this.setState({user: response.data});
            if(response.data.color_vistaDrag !== null){
                var divPrincipal = document.getElementById("principal");
                divPrincipal.style.backgroundColor = response.data.color_vistaDrag;
            }
        });
    }

    cambiarModal=()=>{
        this.setState({abrirModal: !this.state.abrirModal});
    }

    asignarColor=()=>{
        if(this.state.colorSeleccionado !== ''){
            const token = localStorage.getItem('token');
            var divPrincipal = document.getElementById("principal");
            divPrincipal.style.backgroundColor = this.state.colorSeleccionado;
            var usr = this.state.user;
            usr.color_vistaDrag = this.state.colorSeleccionado;
            Axios.post('http://localhost:8080/api/usuario/editar/',usr, {headers: {"Authorization": `Bearer ${token}`}});
            this.setState({colorSeleccionado: ''});
        }
        this.cambiarModal();
    }

    seleccionar=async(numero)=>{
        for (let index = 0; index < 9; index++) {
            if(index===numero){
                if(numero===0){
                    await this.setState({colorSeleccionado: '#FFFFFF'});
                }
                if(numero===1){
                    await this.setState({colorSeleccionado: '#128c7e'});
                }
                if(numero===2){
                    await this.setState({colorSeleccionado: '#f0ad4e'});
                }
                if(numero===3){
                    await this.setState({colorSeleccionado: '#DCE4F9'});
                }
                if(numero===4){
                    await this.setState({colorSeleccionado: '#7668a3'});
                }
                if(numero===5){
                    await this.setState({colorSeleccionado: '#CD853F'});
                }
                if(numero===6){
                    await this.setState({colorSeleccionado: '#2a9df4'});
                }
                if(numero===7){
                    await this.setState({colorSeleccionado: '#8899A6'});
                }
                if(numero===8){
                    await this.setState({colorSeleccionado: '#E2D7D7'});
                }
                var elegido = document.getElementById("circulo"+numero);
                elegido.style.border= "3px solid #555";
            }else{
                var elegido = document.getElementById("circulo"+index);
                elegido.style.border="";
            }
        }
    }

    render(){
        return(
            <React.Fragment>
                <Menu/>
                <div className="contenedor-dnd" id="principal">
                    <div className="titulo-dnd">
                        <label>Vista Interactiva de Requerimientos</label>
                    </div>
                    <Dragdrop
                        id_subproyecto = {this.props.match.params.id_subproyecto}
                    />
                </div>
                <div style={{marginLeft: '0.6%'}}>
                    <Link to={"/requerimiento/"+this.props.match.params.id_subproyecto}><button type="button" className="btn boton"><ArrowBackIcon/> Volver</button> </Link>
                    <button type="button" className="btn boton" onClick={()=>this.cambiarModal()}>Personalizar Fondo</button>
                </div>

                <Modal isOpen={this.state.abrirModal} toggle={()=>this.cambiarModal()}>
                    <ModalHeader style={{display:'block'}}>
                        <span>Personalizar Color de Fondo</span>
                        <span style={{cursor:'pointer', float:'right'}} onClick={()=>this.cambiarModal()}>X</span>
                    </ModalHeader>
                    <ModalBody>
                        <label>Seleccione un color:</label><br/><br/>
                        <div className="container">
                            <div className="row">
                                <div className="col-4">
                                    <div id="circulo0" className="circulo0" onClick={()=>this.seleccionar(0)}/>
                                    <div id="circulo1" className="circulo1" onClick={()=>this.seleccionar(1)}/>
                                    <div id="circulo2" className="circulo2" onClick={()=>this.seleccionar(2)}/>
                                </div>
                                <div className="col-4">
                                    <div id="circulo3" className="circulo3" onClick={()=>this.seleccionar(3)}/>
                                    <div id="circulo4" className="circulo4" onClick={()=>this.seleccionar(4)}/>
                                    <div id="circulo5" className="circulo5" onClick={()=>this.seleccionar(5)}/>
                                </div>
                                <div className="col-4">
                                    <div id="circulo6" className="circulo6" onClick={()=>this.seleccionar(6)}/>
                                    <div id="circulo7" className="circulo7" onClick={()=>this.seleccionar(7)}/>
                                    <div id="circulo8" className="circulo8" onClick={()=>this.seleccionar(8)}/>
                                </div>
                            </div>
                        </div>
                    </ModalBody>
                    <ModalFooter>
                        <button className="btn btn-success" onClick={()=>this.asignarColor()}>Guardar</button>
                        <button className="btn btn-danger" onClick={()=>this.cambiarModal()}>Cancelar</button>
                    </ModalFooter>
                </Modal>
            </React.Fragment>
        )
    }
}

export default IndexDragdrop;