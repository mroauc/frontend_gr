import React from 'react';

function FiltroPropuestaCambio (propuestas, valorBusqueda, CambiarPropuestas){
    const filtro = propuestas.filter(propuesta => {
        const idPropuesta = propuesta.id_propuestaCambio;
        const nombrePropuesta = propuesta.nombre.toLowerCase();
        const estadoPropuesta = propuesta.estado.toLowerCase();

        const datos = idPropuesta + " " + nombrePropuesta + " " + estadoPropuesta;
        const busquedaMinuscula = valorBusqueda.toLowerCase();

        return datos.indexOf(busquedaMinuscula) > -1
    })
    CambiarPropuestas(filtro);
}

export default FiltroPropuestaCambio;