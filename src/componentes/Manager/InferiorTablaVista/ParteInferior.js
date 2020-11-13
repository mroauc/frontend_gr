import React, { Component } from 'react';
import TabsEstaticos from './TabsEstaticos/TabsEstaticos';
import Comentario from './Comentario'
import Propiedades from './Propiedades';
import PropuestaCambio from './PropuestaCambio';
import Permisos from './Permisos';

export default class ParteInferior extends Component {
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
                    <div label="Permisos">
                        <Permisos
                            requerimiento = {this.props.requerimiento}
                        />
                    </div>
                    <div label="Propuesta de cambio">
                        <PropuestaCambio
                            requerimiento = {this.props.requerimiento}
                        />
                    </div>
                </TabsEstaticos>
                
            </React.Fragment>
        );
    }
}