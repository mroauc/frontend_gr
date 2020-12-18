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
        });
    }

    modalEliminar=async()=>{
        await this.setState({modalEliminar: !this.state.modalEliminar});
    }

    eliminar=async()=>{
        const token = localStorage.getItem('token');

        await Axios.delete(`http://localhost:8080/api/requerimiento/eliminar/${filtrado[0].id_requerimiento}`, {headers: {"Authorization": `Bearer ${token}`}})
        .then(async response=>{
            this.setState({modalEliminar: false});
            this.props.eliminarReqDeTab(filtrado[0].nombre);
            this.props.funcionGetRequerimientos();
            await this.setState({eliminado: 1});
            this.volver();
        })
    }

    volver=()=>{
        this.setState({eliminado:0});
    }

    insertar=(requerimiento)=>{
        let antigua_descripcion = requerimiento.descripcion;
        let act = requerimiento;
        act.descripcion = this.state.dataRequerimiento;
        const token = localStorage.getItem('token');
        Axios.post('http://localhost:8080/api/requerimiento/editar/',act, {headers: {"Authorization": `Bearer ${token}`}})
        .then(response=>{
            this.guardarCambioVersion(requerimiento, antigua_descripcion);
            this.mostrarAlerta();
        });
    }

    guardarCambioVersion=(oldRequerimiento, antigua)=>{
        const token = localStorage.getItem('token');
        Axios.get(`http://localhost:8080/api/template/${oldRequerimiento.id_template}`, {headers: {"Authorization": `Bearer ${token}`}})
        .then(response=>{
            if(response.data.template !== antigua){    //caso en que ya estaba redactado
                Axios.post('http://localhost:8080/api/versionanterior/guardar/',{
                    id_requerimiento: oldRequerimiento.id_requerimiento,
                    nombre_descriptivo: oldRequerimiento.nombre_descriptivo,
                    descripcion: antigua,
                    prioridad: oldRequerimiento.prioridad,
                    estado: oldRequerimiento.estado,
                    id_usuario: oldRequerimiento.id_usuario,
                    fecha: new Date().toLocaleString()
                }, {headers: {"Authorization": `Bearer ${token}`}});
            }
        });
    }
    
    accesoUsuario = () => {
        if(localStorage.getItem("tipo") === "admin" || localStorage.getItem("tipo") === "lider" || localStorage.getItem("tipo") === "jefe")
            return true;
        return false;
    }

    generarTabs = () => {
        return(
            <React.Fragment>
                {
                    this.props.tabs.map((reqID) => {
                        filtrado = this.props.requerimientos.filter(requerimiento => requerimiento.nombre === reqID);
                        return(
                            <div label={reqID}>
                                {(this.accesoUsuario()) ? 
                                    <div style={{marginBottom:'10px'}}>
                                        <button className="btn boton" onClick={()=>this.insertar(filtrado[0])}><SaveOutlinedIcon/></button> &nbsp;
                                        <button className="btn boton" onClick={()=>this.modalEliminar()}><DeleteIcon/></button>
                                    </div>
                                    : <div style={{height:'30px'}}></div>
                                }
                                <div className="editReq">
                                    <TemplateTextEditor
                                        template = {filtrado[0].descripcion}
                                        obtenerTemplate = {this.obtener}
                                        soloLeer = {localStorage.getItem("tipo") === "analista" ? true : false}
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
                                cambiarTabActivo = {this.props.cambiarTabActivo}
                                agregarReqATab = {this.props.agregarReqATab}
                            /> 
                        </div>
                        {this.generarTabs()}
                    </Tabs>
                </div>
            </div>
        );
    }
}