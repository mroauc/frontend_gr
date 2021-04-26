import Axios from 'axios';
import React, { useEffect, useState } from 'react';
import Tree from 'react-tree-graph';
import 'react-tree-graph/dist/style.css';
import Menu from '../Menu/Menu';
import './AnalisisDeImpacto.css'
import 'react-tree-graph/dist/style.css';
import { Link } from 'react-router-dom';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';

let id_req="";
let historialRequerimientos = []

function AnalisisImpacto(props) {

    const [requerimientos, setRequerimientos] = useState({});
    const [requerimiento, setRequerimiento] = useState({});
    const [idproyecto, setIdproyecto] = useState({});

    let data = {
        name: '',
        textProps: {x: -24, y: -10},
        children: []
    };

    const getRequerimiento = async () => {
        const token = localStorage.getItem('token');
        await Axios.get(localStorage.getItem('url')+`/api/impacto_directo/obtener/${props.match.params.id_propuestaCambio}`,{headers: {"Authorization": `Bearer  ${token}`}})
        .then(async response => {
            id_req= response.data[0].id_requerimiento;
            getRelacionados();
        });
    }

    const getRelacionados = async () => {
        const token = localStorage.getItem('token');
        let requerimientoPrincipal;
        let childrenAux = []; 
        await Axios.get(localStorage.getItem('url')+`/api/requerimiento/${id_req}`,{headers: {"Authorization": `Bearer  ${token}`}})
        .then(response => {
            requerimientoPrincipal = response.data;
        })

        if(requerimientoPrincipal!==null){
                data.name = <React.Fragment><tspan alignment-baseline="text-before-edge" x="-23" y="-10">{requerimientoPrincipal.nombre}</tspan> <tspan x="-20" y="14" alignment-baseline="text-before-edge">{requerimientoPrincipal.nombre_descriptivo}</tspan></React.Fragment>;
            historialRequerimientos.push(requerimientoPrincipal.nombre);
            await Axios.get(localStorage.getItem('url')+`/api/relacionrequerimientos/requerimientosAsociados/${id_req}`,{headers: {"Authorization": `Bearer  ${token}`}})
            .then(async response => {
                for (let i = 0; i < response.data.length; i++) {
                    await Axios.get(localStorage.getItem('url')+`/api/relacionrequerimientos/requerimientosAsociados/${response.data[i].id_requerimiento}`,{headers: {"Authorization": `Bearer  ${token}`}})
                    .then(response2 => {
                        console.log(response2.data);
                        for (let i = 0; i < response2.data.length; i++) {
                            if(response2.data[i].nombre !== requerimientoPrincipal.nombre)
                                childrenAux.push({name: <React.Fragment><tspan alignment-baseline="text-before-edge" x="-23" y="-10">{response2.data[i].nombre}</tspan> <tspan x="-20" y="14" alignment-baseline="text-before-edge">{response2.data[i].nombre_descriptivo}</tspan></React.Fragment> ,textProps: {x: -24, y: -10}})
                        }
                    })
                    await data.children.push({name: <React.Fragment><tspan alignment-baseline="text-before-edge" x="-23" y="-10">{response.data[i].nombre}</tspan> <tspan x="-20" y="14" alignment-baseline="text-before-edge">{response.data[i].nombre_descriptivo}</tspan></React.Fragment>,textProps: {x: -24, y: -10 },children: childrenAux});
                    
                    childrenAux = [];
                }
            })
            .catch(() =>{
                console.log("Este requerimiento no tiene requerimientos relacionados")
            })
            setRequerimientos(data);
            setRequerimiento(requerimientoPrincipal);
        }        
    }

    const getttIdProyecto=async()=>{
        const token = localStorage.getItem('token');
        await Axios.get(localStorage.getItem('url')+`/api/propuestacambio/${props.match.params.id_propuestaCambio}`, {headers: {"Authorization": `Bearer  ${token}`}})
        .then(response=>{
            Axios.get(localStorage.getItem('url')+`/api/subProyecto/${response.data.id_subproyecto}`, {headers: {"Authorization": `Bearer  ${token}`}})
            .then(response=>{
                setIdproyecto(response.data.id_proyecto);
            })
        })
    }

    const cargarColor=()=>{
        var divPrincipal = document.getElementById("principal");
        divPrincipal.style.backgroundColor = localStorage.getItem('color_bckgr');
    }

    useEffect(() => {
        getRequerimiento();
        getttIdProyecto();
        cargarColor();
    },[]);

    return (
        <React.Fragment>
            <Menu/>
            <div id="principal" className="contenedorPrincipal">
            <div className="contenedor-propuesta" style={{backgroundColor:"white"}}>
                <label className="titulo-propuesta">
                    <strong>Análisis de Impacto de Propuesta de Cambio:</strong> Modificación de Requerimiento {requerimiento.nombre}
                </label>
                
                <div style={{display:'flex', justifyContent:'center'}}>
                    <Tree
                        data={requerimientos}
                        animated={true}
                        nodeRadius={15}
                        margins={{ top: 20, bottom: 1, left: 15, right: 30 }}
                        height={530}
                        width={700}
                    />
                </div>
            </div>
            <Link to={`/propuestaCambio/${idproyecto}`} style={{position:'absolute', left:'2%', top:'88px'}}><button type="button" className="btn boton"><ArrowBackIcon/></button></Link>
            </div>
        </React.Fragment>
    );
}

export default AnalisisImpacto;