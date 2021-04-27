import { cloneElement } from "react";

function filtroDragdrop (busqueda,id_columna,datos,datosPrincipio,requerimientos,cambiarEstadoColumna,principio) {
    
    let copiaDatos = Object.assign({},datosPrincipio[id_columna]);

    const filtro = requerimientos.filter(requerimiento=>{
        const idRequerimiento = requerimiento.id_requerimiento;
        const nombreRequerimiento = requerimiento.nombre.toLowerCase();
        const estadoRequerimiento = requerimiento.estado.toLowerCase();
        const categoriaRequerimiento = requerimiento.categoria.toLowerCase();
        const nombreDescriptivo = requerimiento.nombre_descriptivo.toLowerCase();

        const datos = idRequerimiento + " " + nombreRequerimiento + " " + estadoRequerimiento + " " + categoriaRequerimiento + " " + nombreDescriptivo;
        const busquedaMinuscula = busqueda.toLowerCase();

        return datos.indexOf(busquedaMinuscula) > -1
    });

    var datosFiltrados = copiaDatos.items.filter(item => {
        var aux = filtro.find(req => {
            return req.nombre === item.content;
        });
        return aux !== undefined;
    });

    copiaDatos.items = datosFiltrados;

    cambiarEstadoColumna(id_columna,copiaDatos.items,datosPrincipio[id_columna]);

    if(busqueda === ""){
        principio();
    }
    
}
export default filtroDragdrop;