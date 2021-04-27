import React from 'react';

function FiltroEmpresa (empresas, valorBusqueda, cambiarEmpresas) {
    
    const filtro = empresas.filter(empresa => {
        const idEmpresa = empresa.id_empresa;
        const razonSocialEmpresa = empresa.razon_social.toLowerCase();
        const representateEmpresa = empresa.representante.toLowerCase();
        const rutEmpresa = empresa.rut_empresa.toLowerCase();

        const datos = idEmpresa + " " + razonSocialEmpresa + " " + representateEmpresa + " " + rutEmpresa;
        const busquedaMinuscula = valorBusqueda.toLowerCase();
        
        return  datos.indexOf(busquedaMinuscula) > -1
    })
    cambiarEmpresas(filtro);
    
}
export default FiltroEmpresa;