import React from 'react';

function FiltroTemplate (templates, valorBusqueda, cambiarTemplates){
    const filtro = templates.filter(template=>{
        const idTemplate = template.id_template;
        const prefijoTemplate = template.prefijo.toLowerCase();
        const nombreTemplate = template.nombre.toLowerCase();
        const tipoTemplate = template.tipo.toLowerCase();

        const datos = idTemplate + " " + prefijoTemplate + " " + nombreTemplate + " " + tipoTemplate;
        const busquedaMinuscula = valorBusqueda.toLowerCase();

        return datos.indexOf(busquedaMinuscula) > -1
    })
    cambiarTemplates(filtro);
}

export default FiltroTemplate;