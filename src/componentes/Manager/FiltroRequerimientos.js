import React from 'react';

function FiltroUsuario (requerimientos, valorBusqueda, cambiarRequerimientos) {
    
    
    const filtro = requerimientos.filter(requerimiento => {
        const idRequerimiento = requerimiento.id_requerimiento;
        const categoria = requerimiento.categoria.toLowerCase();
        const estado = requerimiento.estado.toLowerCase();
        const nombre = requerimiento.nombre.toLowerCase();
        const prioridad = requerimiento.prioridad.toLowerCase();
        const fecha_creacion = requerimiento.fecha_creacion;

        const datos = idRequerimiento + " " + categoria + " " + estado + " " + nombre + " " + prioridad + " " + fecha_creacion;
        console.log(datos);
        const busquedaMinuscula = valorBusqueda.toLowerCase();
        
        return  datos.indexOf(busquedaMinuscula) > -1
    })
    console.log(filtro);

    cambiarRequerimientos(filtro);
    
}
export default FiltroUsuario;

// 0: {id: 63, nombre: "admin", email: "admin@u.u", estado: "Activo", tipo: "admin", …}
