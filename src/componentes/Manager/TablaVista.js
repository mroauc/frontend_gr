import Axios from 'axios';
import React, { Component } from 'react'
import TemplateTextEditor from '../Template/TemplateTextEditor';
import ParteInferior from './InferiorTablaVista/ParteInferior';
import Tabs from './Tabs/Tabs';
import './Tabs/Tabs.css';
import '../vistaCrud.css';
import './Manager.css';
import PaginaPrincipal from './PaginaPrincipal';
import swal from 'sweetalert';
import SaveOutlinedIcon from '@material-ui/icons/SaveOutlined';
import DeleteIcon from '@material-ui/icons/Delete';
import { Modal, ModalBody, ModalFooter} from 'reactstrap';

var filtrado;

export default class TablaVista extends Component {

    state={
        dataRequerimiento : '',
        modalEliminar: false,
        req: '',
        eliminado: 0
    }

    obtener=async(e)=>{
        await this.setState({
            dataRequerimiento: e
        });
    }

    mostrarAlerta = () => {
        swal({
            title: "Guardado Correctamente",
            icon: "success",
            buttons: "Aceptar"
        })
    }

    modalEliminar=()=>{
        this.setState({modalEliminar: !this.state.modalEliminar});
    }

    eliminar=async()=>{
        const token = localStorage.getItem('token');
        Axios.delete(`http://localhost:8080/api/usuarioactividad/eliminar/id_requerimiento/${filtrado[0].id_requerimiento}`, {headers: {"Authorization": `Bearer ${token}`}})

        await Axios.delete(`http://localhost:8080/api/requerimiento/eliminar/${filtrado[0].id_requerimiento}`, {headers: {"Authorization": `Bearer ${token}`}})
        .then(response=>{
            this.setState({modalEliminar: false});
            this.props.eliminarReqDeTab(filtrado[0].nombre);
            this.props.funcionGetRequerimientos();
            this.setState({eliminado: 1});
            //this.volver();
            //window.location.href = window.location.href;
        })
    }

    volver=()=>{
        this.setState({eliminado:0});
    }

    insertar=(requerimiento)=>{
        var act = requerimiento;
        act.descripcion = this.state.dataRequerimiento;
        const token = localStorage.getItem('token');
        Axios.post('http://localhost:8080/api/requerimiento/editar/',act, {headers: {"Authorization": `Bearer ${token}`}})
        .then(
            this.mostrarAlerta()
        )
    }
    
    generarTabs = () => {
        return(
            <React.Fragment>
                {
                    this.props.tabs.map((reqID) => {
                        filtrado = this.props.requerimientos.filter(requerimiento => requerimiento.nombre === reqID);
                        return(
                            <div label={reqID}>
                                <div style={{marginBottom:'10px'}}>
                                    <button className="btn boton" onClick={()=>this.insertar(filtrado[0])}><SaveOutlinedIcon/></button> &nbsp;
                                    <button className="btn boton" onClick={()=>this.modalEliminar()}><DeleteIcon/></button>
                                </div>
                                <div className="editReq">
                                    <TemplateTextEditor
                                        template = {filtrado[0].descripcion}
                                        obtenerTemplate = {this.obtener}
                                    />       
                                </div>
                                <div className="barraDivisora"></div>
                                <ParteInferior
                                    requerimiento = {filtrado[0]}
                                />

                                <Modal isOpen={this.state.modalEliminar}>
                                    <ModalBody>
                                        ¿Seguro que desea eliminar el requerimiento?
                                    </ModalBody>
                                    <ModalFooter>
                                        <button className="btn btn-danger" onClick={()=>this.eliminar()}>Si</button>
                                        <button className="btn btn-secundary" onClick={()=>this.modalEliminar()}>No</button>
                                    </ModalFooter>
                                </Modal>
                            </div>
                        )
                    })
                }
            </React.Fragment>
        );
    }

    render(){
        return(
            <div className="col-9" style={{height:'100%', display:'inline-block', padding: '0 0 0 5px', overflow:'hidden'}}>
                <div className="tabla-vista">
                    <Tabs eliminarReqDeTab={this.props.eliminarReqDeTab} consultaTabActivo={this.props.clickTab} eliminado={this.state.eliminado}>
                        <div label="Página Principal"> 
                            <PaginaPrincipal
                                requerimientos = {this.props.requerimientos}
                                id_subproyecto = {this.props.id_subproyecto}
                                funcionGetRequerimientos = {this.props.funcionGetRequerimientos}
                            /> 
                        </div>

                        {this.generarTabs()}
                    </Tabs>
                </div>
            </div>
        );
    }
}