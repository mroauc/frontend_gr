import React, { Component } from 'react';
import TabsEstaticos from './TabsEstaticos/TabsEstaticos';
import Comentario from './Comentario'
import Propiedades from './Propiedades';
import PropuestaCambio from './PropuestaCambio';
import Permisos from './Permisos';
import VersionesAnteriores from './VersionesAnteriores';

export default class ParteInferior extends Component {

    accesoUsuario = () => {
        if(localStorage.getItem("tipo") === "admin" || localStorage.getItem("tipo") === "lider" || localStorage.getItem("tipo") === "jefe")
            return true;
        return false;
    }

    render(){
        return(
            <React.Fragment>
                <TabsEstaticos>
                    <div label="Comentarios">
                        <Comentario
                            requerimiento = {this.props.requerimiento}
                        />
                    </div>
                    <div label="Propiedades">
                        <Propiedades
                            requerimiento = {this.props.requerimiento}
                        />
                    </div>
                    {this.accesoUsuario() ? 
                        <div label="Permisos">
                            <Permisos
                                requerimiento = {this.props.requerimiento}
                            />
                        </div>
                        : ""
                    }
                    <div label="Propuesta de cambio">
                        <PropuestaCambio
                            requerimiento = {this.props.requerimiento}
                        />
                    </div>
                    <div label="Versiones Anteriores">
                        <VersionesAnteriores
                        requerimiento = {this.props.requerimiento}
                        />
                    </div>
                </TabsEstaticos>
            </React.Fragment>
        );
    }
}