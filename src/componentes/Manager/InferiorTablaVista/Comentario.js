import Axios from 'axios';
import React, { Component } from 'react'
import'./Comentario.css'

export default class Comentario extends Component{

    state = {
        comentarios: [],
        usuarios: [],
        nuevo_comentario: '',
        errorComentario : ''
    }

    componentDidMount(){
        this.getComentarios();
        this.getUsuarios();
    }

    validar = () => {
        let salida = true;
        if(this.state.nuevo_comentario === ''){
            this.setState({errorComentario : "Debe ingresar un comentario"})
        } 
    }

    getComentarios = async () => {
        const token = localStorage.getItem("token");
        const id_requerimiento = this.props.requerimiento.id_requerimiento;
        await Axios.get(`http://localhost:8080/api/comentario/requerimiento/${id_requerimiento}`,{headers: {"Authorization": `Bearer  ${token}`}})
        .then(response => {
            this.setState({
                comentarios: response.data
            });
        })
    } 

    getUsuarios = async () => {
        const token = localStorage.getItem("token");
        await Axios.get('http://localhost:8080/api/usuario/',{headers: {"Authorization": `Bearer  ${token}`}})
        .then(response => {
            this.setState({
                usuarios: response.data
            })
        })
    }

    guardarComentario = async () => {
        const token = localStorage.getItem("token");
        if(this.validar()){
            await Axios.post('http://localhost:8080/api/comentario/guardar',{
                texto: this.state.nuevo_comentario,
                id_requerimiento: this.props.requerimiento.id_requerimiento,
                fecha_ingreso: new Date().toLocaleString(),
                id_usuario: localStorage.getItem("id")
            },{headers: {"Authorization": `Bearer  ${token}`}})
            .then( () => {  
                this.setState({nuevo_comentario: '', errorComentario: ''});
                this.getComentarios();
            }
            );
        }
    }
    
    changeHandler = async (e) => {
        await this.setState({
            nuevo_comentario : e.target.value
          });
    }


    render(){
        return(
            <div style={{height:'98%'}}>
                <div className="areaCrear">
                    <div className="col-9" style={{paddingLeft: '0'}}>
                        <textarea className={(this.state.errorComentario)? "textComentario invalid" : "textComentario"} placeholder="Ingresar Comentario&#10;(Máx. 255 carácteres)" rows="3" maxLength="255" onChange={this.changeHandler} value={this.state.nuevo_comentario} onClick={() => {this.setState({errorComentario : ''})}}></textarea>
                    </div>

                    <div className="col-3 cont-boton">
                        <div style={{width: '100%'}}>
                            <button className="btn btn-success btn-block" onClick={this.guardarComentario}>Comentar</button>
                            <div class="invalid-feedback" style={{display: 'block'}}>
                                {this.state.errorComentario}
                            </div>
                        </div>
                    </div> 
                </div>

                <div className="muestraComentarios">
                    {this.state.comentarios.reverse().map(comentario => {
                        const usuarioEncontrado = this.state.usuarios.filter(usuario => usuario.id === comentario.id_usuario);
                        
                        if(usuarioEncontrado.length === 1){
                            return(
                                <div className="cuadroComentario">
                                    <i style={{marginRight:'10px'}}>{comentario.fecha_ingreso + " | "}</i>{comentario.texto}
                                    <label className="nombreUsuario"><b>{usuarioEncontrado[0].nombre}&nbsp;&nbsp;</b>{usuarioEncontrado[0].tipo}</label> 
                                </div>
                            );
                        }
                        
                    })}
                </div>

            </div>

            
        );
    }
} 