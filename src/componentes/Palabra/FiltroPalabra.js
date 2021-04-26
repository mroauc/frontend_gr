function FiltroPalabra (palabras, valorBusqueda, cambiarPalabras) {
   
    const filtro = palabras.filter(palabra => {
        console.log(palabra)
        const idPalabra = palabra.id_palabra;
        const idProyecto = palabra.id_proyecto;
        const palabraPalabra = palabra.palabra.toLowerCase();
        const significadoPalabra = palabra.significado.toLowerCase();

        const datos = idPalabra + " " + idProyecto + " " + palabraPalabra + " " + significadoPalabra;
        const busquedaMinuscula = valorBusqueda.toLowerCase();
        
        return  datos.indexOf(busquedaMinuscula) > -1
    })
    cambiarPalabras(filtro);
    
}
export default FiltroPalabra;
