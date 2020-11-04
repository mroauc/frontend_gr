import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import Menu from '../Menu/Menu';
import ImagenUCM from '../../imgs/fotoUCM.PNG'
import '../../App.css'
 
class DashboardAdmin extends Component{

    render(){
        return(
            <div>
                <Menu/>
                <img style={{height: '94vh', width: '100%'}} src={ImagenUCM}></img>
            </div>
        );
    }
}

export default DashboardAdmin;