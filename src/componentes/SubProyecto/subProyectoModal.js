import Axios from 'axios';
import axios from 'axios';
import React, { Component } from 'react'
import { Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import ChipsAnalistas from './ChipsAnalistas';
import ChipsClientes from './ChipsClientes';
import SeleccionAnalistas from './SeleccionAnalistas';
import SeleccionClientes from './SeleccionClientes';
import SeleccionLider from './SeleccionLider/SeleccionLider'

const url="http://localhost:8080/api/subProyecto/";
let nombre_usuario = "";

export default class subProyectoModal extends Component {

    state ={
        subProyecto: {
            id_subProyecto : 0,
            nombre_subProyecto :'',
            fecha_inicio : new Date().toLocaleDateString('fr-CA'),
            fecha_fin : '',
            id_proyecto : '',
            tipo_subProyecto : '',
            id_usuario : ''
        },
        usuarios: [],
        lideres_subProyectos : [],
        clientes: [],
        msj_nombre_subp: "",
        msj_fechaInicio: "",
        msj_tipo_subp: "",
        msj_lider_subp: "",
        msj_cliente: "",
        msj_analista: "",
        modalClientesAsociados: false,
        clientesSeleccionados: [],
        analistasSeleccionados: [],
        modalAnalistasAsociados: false,
        estadoModal: false
    }

    componentDidMount(){
        this.getUsuarios();
        this.getLideres();
        this.getClientes();
        this.setState({analistasSeleccionados: [], clientesSeleccionados: []});
    }

    getUsuarios = async () => {
        const token = localStorage.getItem('token');
        await axios.get("http://localhost:8080/api/usuario/",{headers: {"Authorization": `Bearer  ${token}`}}).then(response=>{
            this.setState({
                usuarios: response.data
            })
        });
    }

    getLideres = async () => {
        const token = localStorage.getItem('token');
        await Axios.get('http://localhost:8080/api/usuario/',{headers: {"Authorization": `Bearer ${token}`}})
        .then(response=>{
            this.setState({
                lideres_subProyectos: response.data.filter(usuario => usuario.tipo === "lider" && usuario.estado === "Activo")
            });
        });
    }

    getClientes = async () => {
        const token = localStorage.getItem('token');
        await Axios.get(`http://localhost:8080/api/cliente/id_proyecto/${this.props.id_proyecto}`,{headers: {"Authorization": `Bearer ${token}`}})
        .then(response=>{
            this.setState({
                clientes : response.data
            });
        });
    }

    componentWillReceiveProps(next_props) {
        this.setState({subProyecto: this.props.subProyecto});
    }

    validar=()=>{
        let salida = true;
        if(this.state.subProyecto.nombre_subProyecto === ""){
            this.setState({
                msj_nombre_subp: "Campo Vacio"
            });
            salida=false;
        }
        if(this.state.subProyecto.fecha_inicio === ""){
            this.setState({
                msj_fechaInicio: "Campo Vacio"
            });
            salida=false;
        }
        if(this.state.subProyecto.id_usuario === 0){
            this.setState({
                msj_lider_subp: "Campo Vacio"
            });
            salida=false;
        }
        if(this.state.clientesSeleccionados.length === 0){
            this.setState({
                msj_cliente: "Campo Vacio"
            });
            salida=false;
        }
        if(this.state.analistasSeleccionados.length === 0){
            this.setState({
                msj_analista: "Campo Vacio"
            });
            salida=false;
        }
        return salida;
    }

    cambiarEstadoAbrir = () => {
        this.setState({estadoModal : !this.state.estadoModal})
    }

    guardarSubproyecto=async(subProyecto)=>{
        if(this.validar()){
            const token = localStorage.getItem('token');
            var urlGuardar = url + 'guardar';
            await axios.post(urlGuardar, subProyecto,{headers: {"Authorization": `Bearer  ${token}`}})
            .then(response => {
                if(this.props.estadoEditar){
                    this.props.cambiarEstadoEditar();
                    this.guardarActualizacion(response.data.id_subProyecto, this.state.clientes);
                }
                else{
                    this.insertar_usuariosSubProyecto(response.data.id_subProyecto);
                    this.props.cambiarEstadoInsertar();
                }
                this.props.getSubProyectos();
                this.setState({
                    msj_nombre_subp: "",
                    msj_fechaInicio: "",
                    msj_tipo_subp: "",
                    msj_lider_subp: "",
                    msj_cliente: "",
                    msj_analista: ""
                });
            })
            .catch(error => {
                console.log(error)
            })
        }
    }

    guardarActualizacion=(id_subProyecto, clientes)=>{
        if(this.state.analistasSeleccionados.length!==0 && this.state.clientesSeleccionados.length!==0){
            var original = [];
            var clientes_string = [];
            var existentesClientes = [];
            var existentesAnalistas = [];
            var originalClientes = [];
            var originalAnalistas = [];
            const token = localStorage.getItem('token');

            for (let index=0; index<clientes.length; index++) {
                clientes_string.push(this.state.clientes[index].id.toString());
            }

            Axios.get(`http://localhost:8080/api/encargadosubproyecto/obtener/${id_subProyecto}`,{headers: {"Authorization": `Bearer ${token}`}})
            .then(response=>{
                original = response.data;
                for (let index=0; index<original.length; index++) {
                    if(clientes_string.includes(response.data[index].id_usuario.toString())){
                        existentesClientes = [...existentesClientes, response.data[index].id_usuario.toString()];
                        originalClientes = [...originalClientes, response.data[index]];
                    }else{
                        existentesAnalistas = [...existentesAnalistas, response.data[index].id_usuario.toString()];
                        originalAnalistas = [...originalAnalistas, response.data[index]];
                    }
                }

                //eliminar
                for (let index = 0; index < existentesClientes.length; index++) {   //cliente
                    if(!this.state.clientesSeleccionados.includes(existentesClientes[index])){
                        Axios.delete(`http://localhost:8080/api/encargadosubproyecto/eliminar/${originalClientes[index].id_encargadoSubProyecto}`,{headers: {"Authorization": `Bearer ${token}`}})
                    }
                }
                for (let index = 0; index < existentesAnalistas.length; index++) {   //analista
                    if(!this.state.analistasSeleccionados.includes(existentesAnalistas[index])){
                        Axios.delete(`http://localhost:8080/api/encargadosubproyecto/eliminar/${originalAnalistas[index].id_encargadoSubProyecto}`,{headers: {"Authorization": `Bearer ${token}`}})
                    }
                }

                //agregar
                for (let index=0; index<this.state.clientesSeleccionados.length; index++) { //cliente
                    if(!existentesClientes.includes(this.state.clientesSeleccionados[index])){
                        Axios.post("http://localhost:8080/api/encargadosubproyecto/guardar",{
                            id_subProyecto: id_subProyecto,
                            id_usuario: this.state.clientesSeleccionados[index],
                        }, {headers: {"Authorization": `Bearer ${token}`}})
                    }
                }
                for (let index=0; index<this.state.analistasSeleccionados.length; index++) { //analista
                    if(!existentesAnalistas.includes(this.state.analistasSeleccionados[index])){
                        Axios.post("http://localhost:8080/api/encargadosubproyecto/guardar",{
                            id_subProyecto: id_subProyecto,
                            id_usuario: this.state.analistasSeleccionados[index],
                        }, {headers: {"Authorization": `Bearer ${token}`}})
                    }
                }

                this.setState({
                    msj_nombre_subp: "",
                    msj_fechaInicio: "",
                    msj_tipo_subp: "",
                    msj_lider_subp: "",
                    msj_cliente: "",
                    msj_analista: "",
                    clientesSeleccionados: [],
                    analistasSeleccionados: []
                });
            })
        }
    }

    insertar_usuariosSubProyecto = async (id_subProyecto) => {
        const token = localStorage.getItem('token');
        for (let i = 0; i < this.state.clientesSeleccionados.length; i++) {
            await axios.post("http://localhost:8080/api/encargadosubproyecto/guardar",{id_subProyecto: id_subProyecto, id_usuario: this.state.clientesSeleccionados[i]},{headers: {"Authorization": `Bearer  ${token}`}})        
        }

        for (let index = 0; index < this.state.analistasSeleccionados.length; index++) { 
            await axios.post("http://localhost:8080/api/encargadosubproyecto/guardar",{id_subProyecto: id_subProyecto, id_usuario: this.state.analistasSeleccionados[index]},{headers: {"Authorization": `Bearer  ${token}`}})                   
        }
        this.setState({clientesSeleccionados: [], analistasSeleccionados: []});
    }

    cerrarModal = () => {
        (this.props.estadoInsertar) ? this.props.cambiarEstadoInsertar() : this.props.cambiarEstadoEditar(); 
        this.setState({
            msj_nombre_subp: "",
            msj_fechaInicio: "",
            msj_tipo_subp: "",
            msj_lider_subp: "",
            msj_cliente: "",
            msj_analista: "",
            analistasSeleccionados: [],
            clientesSeleccionados: []
        });
        nombre_usuario="";
    }

    buscarNombreUsuario = () => {
        if(this.state.subProyecto.id_usuario === 0) {
            nombre_usuario = "Seleccione Lider de Módulo";
        }
        else{
            let usuarioEncontrado = this.state.usuarios.find(usuario => usuario.id === this.state.subProyecto.id_usuario);
            if(usuarioEncontrado !== undefined)
                nombre_usuario = usuarioEncontrado.nombre;
        }
    }

    changeHandler = async (e) => {
        await this.setState({
            subProyecto : {
              ...this.state.subProyecto, [e.target.name]: e.target.value
            }
        });
    }

    modalClientesAsociados=async()=>{
        await this.setState({modalClientesAsociados: !this.state.modalClientesAsociados});
    }

    insertarCliente=(cliente)=>{
        this.setState({
            clientesSeleccionados: [ ...this.state.clientesSeleccionados, cliente],
        });
    }

    cambiarLider = (id_nuevo_lider) => {
        let copiaSubProyecto = {...this.state.subProyecto};
        copiaSubProyecto.id_usuario = id_nuevo_lider;
        this.setState({subProyecto : copiaSubProyecto});
        if(id_nuevo_lider === 0){
            nombre_usuario = "Seleccione Lider de Módulo";
        }
    }

    eliminarCliente=(cliente)=>{
        const filtrado = this.state.clientesSeleccionados.filter(item => item!==cliente);        
        this.setState({
            clientesSeleccionados : filtrado
        });
    }

    insertarClientes=async(nuevos_clientes)=>{
        await this.setState({clientesSeleccionados: nuevos_clientes});
    }

    insertarAnalista=(analista)=>{
        this.setState({
            analistasSeleccionados: [ ...this.state.analistasSeleccionados, analista],
        });
    }

    eliminarAnalista=(analista)=>{
        const filtrado = this.state.analistasSeleccionados.filter(item => item!==analista);        
        this.setState({
            analistasSeleccionados : filtrado
        });
    }

    insertarAnalistas=async(nuevos_analistas)=>{
        await this.setState({analistasSeleccionados: nuevos_analistas});
    }

    modalAnalistasAsociados=async()=>{
        await this.setState({modalAnalistasAsociados: !this.state.modalAnalistasAsociados});
    }
    
    render(){
        this.buscarNombreUsuario();
        return(
            <React.Fragment>
                <Modal isOpen = {this.props.estadoInsertar || this.props.estadoEditar} toggle= {this.cerrarModal} >
                    <ModalHeader style={{display : 'block'}}>
                        <span>{(this.props.estadoInsertar) ? 'Ingresar Módulo' :'Editar Módulo'}</span>
                        <span style={{cursor : 'pointer' , float : 'right'}} onClick={this.cerrarModal}>X</span>
                    </ModalHeader>
                    <ModalBody>
                        <div className="form-group">
                            <label htmlFor="subProyecto">Módulo</label>
                            <input className={ (this.state.msj_nombre_subp)? "form-control is-invalid" : "form-control"} type="text" name="nombre_subProyecto" id="nombre_subProyecto" placeholder="Ingrese el nombre que desea asignar al módulo" onChange={this.changeHandler} value={this.state.subProyecto.nombre_subProyecto} onClick={()=>{this.setState({msj_nombre_subp: ""})}} />
                            <div className="invalid-feedback">
                                {this.state.msj_nombre_subp}
                            </div>
                            <br/>

                            <label htmlFor="id_usuario">Clientes Asociados</label>
                            <div className="areaCrear2">
                                <div className="col-9" style={{display:'flow-root', paddingLeft: '0' , paddingRight: '5px'}}>
                                    <ChipsClientes
                                        id_subproyecto = {this.state.subProyecto.id_subProyecto}
                                        insertarChip = {this.insertarCliente}
                                        eliminarChip = {this.eliminarCliente}
                                        clientes = {this.state.usuarios.filter(usuario => usuario.tipo === "cliente")}
                                        seleccionados = {this.state.clientesSeleccionados}
                                    />
                                </div>
                                <div className="col-3 cont-boton-prop">
                                    <button className="btn btn-primary btn-block" onClick={()=>{this.modalClientesAsociados(); this.setState({msj_cliente:""});}}>Seleccionar</button>
                                </div>

                                <SeleccionClientes
                                    clientes = {this.state.usuarios.filter(usuario => usuario.tipo === "cliente")}
                                    valoresInput = {this.state.clientesSeleccionados}
                                    insertarClientes = {this.insertarClientes}
                                    abrir = {this.state.modalClientesAsociados}
                                    modalClientesAsociados = {this.modalClientesAsociados}
                                    usuarios = {this.state.usuarios}
                                />
                                <div class="invalid-feedback" style={{display: 'block'}}>
                                    {this.state.msj_cliente}
                                </div>
                            </div>
                            <br/>

                            <label htmlFor="id_usuario">Analistas Asociados</label>
                            <div className="areaCrear2">
                                <div className="col-9" style={{display:'flow-root', paddingLeft: '0', paddingRight: '5px'}}>
                                    <ChipsAnalistas
                                        id_subproyecto = {this.state.subProyecto.id_subProyecto}
                                        insertarChip = {this.insertarAnalista}
                                        eliminarChip = {this.eliminarAnalista}
                                        analistas = {this.state.usuarios.filter(usuario => usuario.tipo === "analista")}
                                        seleccionados = {this.state.analistasSeleccionados}
                                    />
                                </div>
                                <div className="col-3 cont-boton-prop">
                                    <button className="btn btn-primary btn-block" onClick={()=>{this.modalAnalistasAsociados(); this.setState({msj_analista:""});}}>Seleccionar</button>
                                </div>
                                <SeleccionAnalistas
                                    analistas = {this.state.usuarios.filter(usuario => usuario.tipo === "analista")}
                                    valoresInput = {this.state.analistasSeleccionados}
                                    insertarAnalistas = {this.insertarAnalistas}
                                    abrir = {this.state.modalAnalistasAsociados}
                                    modalAnalistasAsociados = {this.modalAnalistasAsociados}
                                />
                                <div class="invalid-feedback" style={{display: 'block'}}>
                                    {this.state.msj_analista}
                                </div>
                            </div>
                            <br/>

                            <label htmlFor="fecha_inicio">Fecha Inicio</label>
                            <input className={ (this.state.msj_fechaInicio)? "form-control is-invalid" : "form-control"} type="date" name="fecha_inicio" id="fecha_inicio" onChange={this.changeHandler} value={this.state.subProyecto.fecha_inicio} onClick={()=>{this.setState({msj_fechaInicio: ""})}} />
                            <div className="invalid-feedback">
                                {this.state.msj_fechaInicio}
                            </div>
                            <br/>
                            <label htmlFor="fecha_termino">Fecha Termino</label>
                            <input className="form-control" type="date" name="fecha_fin" id="fecha_fin" onChange={this.changeHandler} value={this.state.subProyecto.fecha_fin}/>
                            <br/>
                            <label htmlFor="id_usuario">Lider de Módulo</label>
                            <div style={{display:'flex', alignItems:'center'}}>
                                <input className="form-control" type="text" style={{width:'75%', display:'inline', marginRight:'5px', backgroundColor:'#fff'}} name="id_usuario" id="id_usuario" value={nombre_usuario} disabled/>
                                <button className="btn btn-primary" style={{width:'25%', display:'inline'}} onClick={() => {this.cambiarEstadoAbrir(); this.setState({msj_lider_subp:""});}}>Elegir Lider</button>
                            </div>
                            <SeleccionLider
                                usuariosLider = {this.state.lideres_subProyectos}
                                abrir = {this.state.estadoModal}
                                cambiarEstadoAbrir = {this.cambiarEstadoAbrir}
                                valorInput = {this.state.subProyecto.id_usuario}
                                cambiarLider = {this.cambiarLider}
                            />
                            <div class="invalid-feedback" style={{display: 'block'}}>
                                {this.state.msj_lider_subp}
                            </div>
                        </div>
                    </ModalBody>
                    <ModalFooter>
                        <button className="btn btn-success" onClick={() => this.guardarSubproyecto(this.state.subProyecto)}> {(this.props.estadoInsertar)? "Insertar" : "Actualizar"} </button>
                        <button className="btn btn-danger" onClick={this.cerrarModal} >Cancelar</button>
                    </ModalFooter>
                </Modal>

            </React.Fragment>
        );
    }
}