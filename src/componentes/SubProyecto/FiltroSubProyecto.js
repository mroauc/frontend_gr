function FiltroSubProyecto (subProyectos, valorBusqueda, cambiarSubProyectos) {
   
    const filtro = subProyectos.filter(subProyecto => {
        console.log(subProyecto)
        const idSubProyectos = subProyecto.id_sub_proyecto;
        const fechaFin = subProyecto.fecha_fin;
        const fechaInicio = subProyecto.fecha_inicio;
        const idProyecto = subProyecto.id_proyecto;
        const idUsuario = subProyecto.id_usuario;
        const nombreSubProyecto = subProyecto.nombre_subProyecto.toString().toLowerCase(); // cambiar a string
        
        const datos = idSubProyectos + " " + fechaFin + " " + fechaInicio + " " + idProyecto + " " + idUsuario + " " + nombreSubProyecto;
        const busquedaMinuscula = valorBusqueda.toLowerCase();
        
        return  datos.indexOf(busquedaMinuscula) > -1
    })
    cambiarSubProyectos(filtro);
    
}
export default FiltroSubProyecto;
