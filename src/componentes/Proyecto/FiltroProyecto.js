import React from 'react';

function FiltroProyecto (proyectos, valorBusqueda, cambiarProyectos){
    const filtro = proyectos.filter(proyecto =>{
        const idProyecto =  proyecto.id_proyecto;
        const nombreProyecto = proyecto.nombre.toLowerCase();

        const datos = idProyecto + " " + nombreProyecto;
        const busquedaMinuscula = valorBusqueda.toLowerCase();

        return datos.indexOf(busquedaMinuscula) > -1
    })
    cambiarProyectos(filtro);
}

export default FiltroProyecto;