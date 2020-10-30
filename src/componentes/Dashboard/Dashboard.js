import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import Menu from '../Menu/Menu';
import ImagenUCM from '../../imgs/fotoUCM.PNG'
 
class DashboardAdmin extends Component{

    render(){
        return(
            <div>
                <Menu/>
                <img style={{width: '100%', height: '94vh'}} src={ImagenUCM}></img>
            </div>
        );
    }
}

export default DashboardAdmin;