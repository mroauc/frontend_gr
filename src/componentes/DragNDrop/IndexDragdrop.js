import React, {Component} from 'react';
import Menu from '../Menu/Menu';
import Dragdrop from './Dragdrop';
import {Link} from 'react-router-dom';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import './DragDrop.css';

class IndexDragdrop extends Component{
    render(){
        return(
            <React.Fragment>
                <Menu/>
                <div className="contenedor-dnd">
                    <div className="titulo-dnd">
                        <label>Vista Interactiva de Requerimientos</label>
                    </div>
                    <br/>
                    <Dragdrop
                        id_subproyecto = {this.props.match.params.id_subproyecto}
                    />
                </div>
                <div style={{marginLeft: '110px'}}>
                    <Link to={"/requerimiento/"+this.props.match.params.id_subproyecto}><button type="button" className="btn boton"><ArrowBackIcon/> Volver</button> </Link>
                </div>
            </React.Fragment>
        )
    }
}

export default IndexDragdrop;