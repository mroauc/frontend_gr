import React from 'react';

function FiltroErrores (errores, valorBusqueda, CambiarErrores){
    const filtro = errores.filter(unerror =>{
        const idError = unerror.id_error;
        const contenidoError = unerror.contenido.toLowerCase();

        const datos = idError + " " + contenidoError;
        const busquedaMin = valorBusqueda.toLowerCase();

        return datos.indexOf(busquedaMin) > -1
    })
    CambiarErrores(filtro);
}

export default FiltroErrores;