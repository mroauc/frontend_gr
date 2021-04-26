import React from 'react';

function FiltroRequerimiento(requerimientos, valorBusqueda, cambiarRequerimientos){
    const filtro = requerimientos.filter(requerimiento=>{
        const idRequerimiento = requerimiento.id_requerimiento;
        const nombreRequerimiento = requerimiento.nombre.toLowerCase();
        const estadoRequerimiento = requerimiento.estado.toLowerCase();
        const categoriaRequerimiento = requerimiento.categoria.toLowerCase();
        const nombreDescriptivo = requerimiento.nombre_descriptivo.toLowerCase();
        console.log(nombreDescriptivo);

        const datos = idRequerimiento + " " + nombreRequerimiento + " " + estadoRequerimiento + " " + categoriaRequerimiento + " " + nombreDescriptivo;
        const busquedaMinuscula = valorBusqueda.toLowerCase();

        return datos.indexOf(busquedaMinuscula) > -1
    })
    cambiarRequerimientos(filtro);
}

export default FiltroRequerimiento;