function FiltroCliente (clientes, usuarios , valorBusqueda, cambiarClientes) {
    
    const filtro = clientes.filter(cliente => {
        const idCliente = cliente.id_cliente;
        const celularUsuario = cliente.celular;
        const idEmpresa = cliente.id_empresa;
        const idUser = cliente.id_user;
        const usuarioCliente = usuarios.find(usuario => usuario.id === cliente.id_user);
        
        const datos = idCliente + " " + celularUsuario + " " + idEmpresa + " " + idUser + " " + usuarioCliente.nombre.toLowerCase();
        const busquedaMinuscula = valorBusqueda.toLowerCase();
        
        return  datos.indexOf(busquedaMinuscula) > -1
    })

    cambiarClientes(filtro);
    
}
export default FiltroCliente;