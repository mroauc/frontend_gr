import React from 'react'
import Navigation from './Navigation'

function Menu(){
    if(localStorage.getItem('rol') === 'ROLE_ADMIN'){
        return <Navigation
            celdas = {[ 
                {nombre : "Proyectos", url : "/proyecto"},
                {nombre : "Templates", url : "/templates"},
                {nombre : "Empresas", url : "/empresa"},
                {nombre : "Clientes", url : "/cliente"},
                {nombre : "Usuarios", url : "/usuario"},
                {nombre : "Envio de Errores", url : "/seleccionarError"}
            ]}
        />
    }
    if(localStorage.getItem('rol') === 'ROLE_ANALISTA'){
        return <Navigation
            celdas = {[ 
                {nombre : "Proyectos", url : "/proyecto"},
                {nombre : "Envio de Errores", url : "/seleccionarError"}
            ]}
        />
    }
    if(localStorage.getItem('rol') === 'ROLE_CLIENTE'){
        return <Navigation
            celdas = {[ 
                {nombre : "Proyectos", url : "/proyecto"},
                {nombre : "Envio de Errores", url : "/seleccionarError"}
            ]}
        />
    }

    if(localStorage.getItem('rol') === 'ROLE_LIDER_SUBPROYECTO'){
        return <Navigation
            celdas = {[
                {nombre : "Templates", url : "/templates"},
                {nombre : "Clientes", url : "/cliente"},
                {nombre : "Usuarios", url : "/usuario"}
            ]}
        />
    }

    if(localStorage.getItem('rol') === 'ROLE_JEFE_PROYECTO'){
        return <Navigation
            celdas = {[ 
                {nombre : "Proyectos", url : "/proyecto"},
                {nombre : "Templates", url : "/templates"},
                {nombre : "Empresas", url : "/empresa"},
                {nombre : "Clientes", url : "/cliente"},
                {nombre : "Usuarios", url : "/usuario"},
                {nombre : "Envio de Errores", url : "/seleccionarError"}
            ]}
        />
    }

}

export default Menu;