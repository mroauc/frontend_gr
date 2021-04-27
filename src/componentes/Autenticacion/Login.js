import Axios from "axios";
import React, { Component } from "react";
import { Alert, Button, Form, FormGroup, Input, Label } from "reactstrap";
import './Login.css';

export default class Login extends Component{

    constructor(props){
        super(props);
        this.state={
            message: this.props.location.state?this.props.location.state.message:'',
        };
    }

    getUsuario = async(token) => {
        await Axios.get(localStorage.getItem('url') + `/api/usuario/${token.email}`,{headers: {"Authorization": `Bearer  ${token.token}`}})
            .then(response=>{
                localStorage.setItem('id',response.data.id);
                localStorage.setItem('nombre',response.data.nombre);
                localStorage.setItem('tipo', response.data.tipo);
                localStorage.setItem('color_bckgr',response.data.color_backgr);
        })
    }

    signIn = () =>{
        const data={email: this.email, password: this.password};

        const requestInfo={
            method: 'POST',
            body: JSON.stringify(data),
            headers: new Headers({
                'Content-Type': 'application/json'
            }),
        };
        fetch(localStorage.getItem('url') + '/auth/login',requestInfo)
        .then(response=>{
            if(response.ok){
                return response.json()
            }
            throw new Error("login invalido");
        })
        .then(async token=>{
            localStorage.setItem('token',token.token);
            localStorage.setItem('email',token.email);
            localStorage.setItem('celda','Home');

            await this.getUsuario(token);
            
            if(token.authorities.length === 1){
                localStorage.setItem('rol',token.authorities[0].authority);
            }
            if(token.authorities.length === 2){
                localStorage.setItem('rol' , 'ROLE_LIDER_SUBPROYECTO')
            }
            if(token.authorities.length === 3){
                localStorage.setItem('rol' , 'ROLE_JEFE_PROYECTO')
            }
            if(token.authorities.length === 5){
                localStorage.setItem('rol' , 'ROLE_ADMIN')
            }
            this.props.history.push("/index");
            return;
        })
        .catch(e=>{
            this.setState({message: e.message});
        });
    }

    render(){
        return(
            <div className="body">
            <div className="login-form">
                <div className="tittle">
                    Bienvenido
                </div>
                <hr className="my-3" />
                {
                    this.state.message !==''?(
                        <Alert color="danger" className="text-center">{this.state.message}</Alert>
                    ): ''
                }
               
                <div className="text-boxes">
                <Form>
                    <div className="text-box">
                    <FormGroup>
                        <Input className="input-login" type="email" id="email" onChange={e=>this.email=e.target.value} placeholder="Email" />
                    </FormGroup>
                    </div>
                    <div className="text-box">
                    <FormGroup>
                        <Input className="input-login" type="password" id="password" onChange={e=>this.password=e.target.value} placeholder="Password" />
                    </FormGroup>
                    </div>
                    <div className="button">
                        <Button className="button-input" color="primary" block onClick={this.signIn}>Entrar</Button>
                    </div>
                </Form>
                </div>
            </div>
            </div>
        )
    }
}