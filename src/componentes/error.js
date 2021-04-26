import React, { Component } from 'react';

import equis from './error.png'
import Menu from './Menu/Menu';

export default class error extends Component{
    render(){
        return(
            <React.Fragment>
                <Menu/>
                <div style={{height: "85vh", display: "flex", alignItems: "center", justifyContent: "center"}}>
                    <div style={{fontSize : '50px'}}> 
                        <div style={{textAlign: "center", marginBottom:"30px"}} id="imagen_div"><img src={equis}/></div>
                        NO TIENES PERMISOS
                    </div>
                    
                    
                </div>
                
                
            </React.Fragment>
        );
    }
}