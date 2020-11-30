import React from 'react';

function FiltroUsuario (usuarios, valorBusqueda, cambiarUsuarios) {
    const filtro = usuarios.filter(usuario => {
        const idUsuario = usuario.id;
        const nombreUsuario = usuario.nombre.toLowerCase();
        const emailUsuario = usuario.email.toLowerCase();
        const estadoUsuario = usuario.estado.toLowerCase();
        const tipoUsuario = usuario.tipo.toLowerCase();

        const datos = idUsuario + " " + nombreUsuario + " " + emailUsuario + " " + estadoUsuario + " " + tipoUsuario;
        const busquedaMinuscula = valorBusqueda.toLowerCase();
        
        return  datos.indexOf(busquedaMinuscula) > -1
    })
    cambiarUsuarios(filtro);   
}

export default FiltroUsuario;