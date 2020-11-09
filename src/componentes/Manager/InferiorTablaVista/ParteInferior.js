import React, { Component } from 'react';
import TabsEstaticos from './TabsEstaticos/TabsEstaticos';
import Comentario from './Comentario'

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
                        <h1>Propiedades</h1>
                    </div>
                    <div label="Permisos">
                        <h1>Permisos</h1>
                    </div>
                    <div label="Propuesta de cambio">
                        <h1>Propuesta de cambio</h1>
                    </div>
                </TabsEstaticos>
                
            </React.Fragment>
        );
    }
}