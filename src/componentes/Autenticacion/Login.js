import React, { Component } from "react";
import { Alert, Button, Form, FormGroup, Input, Label } from "reactstrap";

export default class Login extends Component{

    constructor(props){
        super(props);
        this.state={
            message: this.props.location.state?this.props.location.state.message:'',
        };
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
        fetch('http://localhost:8080/auth/login',requestInfo)
        .then(response=>{
            if(response.ok){
                return response.json()
            }
            throw new Error("login invalido");
        })
        .then(token=>{
            localStorage.setItem('token',token.token);
            localStorage.setItem('rol',token.authorities[token.authorities.length-1].authority);
            localStorage.setItem('email',token.email);
            if(localStorage.getItem('rol')==="ROLE_CLIENTE"){
                this.props.history.push("/indexCliente");
                return;
            }else{
                this.props.history.push("/index");
                return;
            }  
        })
        .catch(e=>{
            this.setState({message: e.message});
        });
    }

    render(){
        return(
            <div className="col-md-6" style={{width: '800px', margin: '0 auto'}}>
                <header>
                    <h1 className="text-center font-weight-bold">Bienvenido</h1>
                </header>
                <hr className="my-3" />
                {
                    this.state.message !==''?(
                        <Alert color="danger" className="text-center">{this.state.message}</Alert>
                    ): ''
                }
                <Form>
                    <FormGroup>
                        <Label for="email">Email</Label>
                        <Input type="email" id="email" onChange={e=>this.email=e.target.value} placeholder="Ingrese su correo" />
                    </FormGroup>
                    <FormGroup>
                        <Label for="password">Contraseña</Label>
                        <Input type="password" id="password" onChange={e=>this.password=e.target.value} placeholder="Ingrese su contraseña" />
                    </FormGroup>
                    <Button color="primary" block onClick={this.signIn}>Entrar</Button>
                </Form>
            </div>
        )
    }
}