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

function AnalisisImpacto(props) {

    const [requerimientos, setRequerimientos] = useState({});
    const [requerimiento, setRequerimiento] = useState({});
    const [idproyecto, setIdproyecto] = useState({});

    let data = {
        name: '',
        textProps: {x: -25, y: 25},
        children: []
    };

    const getRequerimiento = async () => {
        const token = localStorage.getItem('token');
        await Axios.get(`http://localhost:8080/api/impacto_directo/obtener/${props.match.params.id_propuestaCambio}`,{headers: {"Authorization": `Bearer  ${token}`}})
        .then(async response => {
            id_req= response.data[0].id_requerimiento;
            getRelacionados();
        });
    }

    const getRelacionados = async () => {
        //console.log(id_req);
        const token = localStorage.getItem('token');
        let requerimientoPrincipal; 
        await Axios.get(`http://localhost:8080/api/requerimiento/${id_req}`,{headers: {"Authorization": `Bearer  ${token}`}})
        .then(response => {
            requerimientoPrincipal = response.data;
        })

        if(requerimientoPrincipal!==null){
            data.name = await requerimientoPrincipal.nombre;
            await Axios.get(`http://localhost:8080/api/relacionrequerimientos/requerimientosAsociados/${id_req}`,{headers: {"Authorization": `Bearer  ${token}`}})
            .then(async response => {
                for (let i = 0; i < response.data.length; i++) {
                    await data.children.push({name: response.data[i].nombre,textProps: {x: -25, y: 25}});
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
        await Axios.get(`http://localhost:8080/api/propuestacambio/${props.match.params.id_propuestaCambio}`, {headers: {"Authorization": `Bearer  ${token}`}})
        .then(response=>{
            Axios.get(`http://localhost:8080/api/subProyecto/${response.data.id_subproyecto}`, {headers: {"Authorization": `Bearer  ${token}`}})
            .then(response=>{
                setIdproyecto(response.data.id_proyecto);
            })
        })
    }

    useEffect(() => {
        getRequerimiento();
        getttIdProyecto();
    },[]);

    return (
        <React.Fragment>
            <Menu/>
            <div className="contenedor-propuesta">
                <label className="titulo-propuesta">
                    <strong>Análisis de Impacto de Propuesta de Cambio:</strong> Modificación de Requerimiento {requerimiento.nombre}
                </label>
                
                <div style={{display:'flex', justifyContent:'center'}}>
                    <Tree
                        data={requerimientos}
                        animated={true}
                        nodeRadius={10}
                        margins={{ top: 20, bottom: 10, left: 15, right: 30 }}
                        height={500}
                        width={600}
                    />
                </div>
            </div>
            <Link to={`/propuestaCambio/${idproyecto}`} style={{position:'absolute', left:'2%', top:'88px'}}><button type="button" className="btn boton"><ArrowBackIcon/></button></Link>
        </React.Fragment>
    );
}

export default AnalisisImpacto;