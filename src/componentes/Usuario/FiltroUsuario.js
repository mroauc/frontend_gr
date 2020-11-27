import React from 'react';

function FiltroUsuario (usuarios, valorBusqueda, cambiarUsuarios) {
    console.log(usuarios);
    console.log(valorBusqueda.toLowerCase());

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
    console.log(filtro);

    cambiarUsuarios(filtro);
    
}
export default FiltroUsuario;

// 0: {id: 63, nombre: "admin", email: "admin@u.u", estado: "Activo", tipo: "admin", …}
