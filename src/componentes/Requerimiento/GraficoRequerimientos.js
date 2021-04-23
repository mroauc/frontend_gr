import Axios from 'axios';
import React, {Component} from 'react';
import { PieChart, Pie, Cell, Tooltip} from 'recharts';
import Menu from '../Menu/Menu';
import {Link} from 'react-router-dom';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import './GraficoRequerimientos.css';
import '../vistaCrud.css';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#B542FF', '#ff0000'];

const RADIAN = Math.PI / 180;

const renderCustomizedLabel = ({cx, cy, midAngle, innerRadius, outerRadius, percent, index,})=>{
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
        <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
            {`${(percent * 100).toFixed(0)}%`}
        </text>
    );
};

let frecuencias = [];

class GraficoRequerimiento extends Component{

    state={
        data : [],
        proyecto : ""
    }

    componentDidMount(){
        this.index();
        this.getProyecto();
        this.cargarColor();
    }

    cargarColor=()=>{
        var divPrincipal = document.getElementById("principal");
        divPrincipal.style.backgroundColor = localStorage.getItem('color_bckgr');
    }

    index=async()=>{
        const token = localStorage.getItem('token');
        const id_proy = this.props.match.params.id_proyecto;
        var subProyectos;
        await Axios.get(localStorage.getItem('url') + `/api/subProyecto/pertenecientes/${id_proy}`,{headers: {"Authorization": `Bearer ${token}`}})
        .then(response=>{
            subProyectos = response.data;
        })
        this.obtenerRequerimientos(subProyectos);
    }

    getProyecto = async () => {
        const token = localStorage.getItem('token');
        await Axios.get(localStorage.getItem('url') + `/api/proyecto/${this.props.match.params.id_proyecto}`,{headers: {"Authorization": `Bearer ${token}`}})
        .then(response=>{
            this.setState({
                proyecto : response.data
            })
        })
    }

    obtenerRequerimientos=async(subProyectos)=>{
        const token = localStorage.getItem('token');
        var requerimientos = [];
        for (let index = 0; index < subProyectos.length; index++) {
            await Axios.get(localStorage.getItem('url') + `/api/requerimiento/obtener/${subProyectos[index].id_subProyecto}`,{headers: {"Authorization": `Bearer ${token}`}})
            .then(response=>{
                for (let index = 0; index < response.data.length; index++) {
                    requerimientos.push(response.data[index]);                    
                }
            })
        }
        this.cargarData(requerimientos);
    }

    cargarData=async(requerimientos)=>{
        var dataFinal = [];

        //tupla estado Propuesto
        var propuesto = requerimientos.filter(req => req.estado === "Propuesto");
        var tupla1 = {name: 'Propuesto', value: propuesto.length};
        dataFinal.push(tupla1);
        frecuencias.push(propuesto.length);

        //tupla estado Redactado
        var redactado = requerimientos.filter(req => req.estado === "Redactado");
        var tupla2 = {name: 'Redactado', value: redactado.length};
        dataFinal.push(tupla2);
        frecuencias.push(redactado.length);


        //tupla estado Aprobado
        var aprobado = requerimientos.filter(req => req.estado === "Aprobado");
        var tupla3 = {name: 'Aprobado', value: aprobado.length};
        dataFinal.push(tupla3);
        frecuencias.push(aprobado.length);

        //tupla estado Por Hacer
        var por_hacer = requerimientos.filter(req => req.estado === "Por Hacer");
        var tupla4 = {name: 'Por Hacer', value: por_hacer.length};
        dataFinal.push(tupla4);
        frecuencias.push(por_hacer.length);

        //tupla estado En Proceso
        var en_proceso = requerimientos.filter(req => req.estado === "En Proceso");
        var tupla5 = {name: 'En Proceso', value: en_proceso.length};
        dataFinal.push(tupla5);
        frecuencias.push(en_proceso.length);

        //tupla estado Hecho
        var hecho = requerimientos.filter(req => req.estado === "Hecho");
        var tupla5 = {name: 'Hecho', value: hecho.length};
        dataFinal.push(tupla5);
        frecuencias.push(hecho.length);


        await this.setState({
            data : dataFinal
        });
    }

    render(){
        return(
            <React.Fragment>
                <Menu/>
                <div id="principal" className="contenedorPrincipal">
                <div className="contenedor-grafico" style={{backgroundColor:"white"}}>
                    <div className="titulo-grafico">
                        <label>Requerimientos registrados para el proyecto {this.state.proyecto.nombre}</label>
                    </div>
                    <div className="contenedor-dos-graficos" >
                    <PieChart width={700} height={310}>
                        <Pie
                            data={this.state.data}
                            cx={350}
                            cy={160}
                            labelLine={false}
                            label={renderCustomizedLabel}
                            outerRadius={146}
                            fill="#8884d8"
                            dataKey="value"
                        >
                            {
                                this.state.data.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)
                            }
                        </Pie>
                        <Tooltip />
                    </PieChart>
                    </div>

                    <div style={{textAlign:'left', marginLeft:'20px'}}>
                        - <div className="cuadroColor" style={{backgroundColor:"#0088FE"}}></div> <label>Requerimiento Propuesto</label>{" : "+frecuencias[0]}<br/>
                        - <div className="cuadroColor" style={{backgroundColor:"#00C49F"}}></div> <label>Requerimiento Redactado</label>{" : "+frecuencias[1]}<br/>
                        - <div className="cuadroColor" style={{backgroundColor:"#FFBB28"}}></div> <label>Requerimiento Aprobado</label>{" : "+frecuencias[2]}<br/>
                        - <div className="cuadroColor" style={{backgroundColor:"#FF8042"}}></div> <label>Requerimiento Por Hacer</label>{" : "+frecuencias[3]}<br/>
                        - <div className="cuadroColor" style={{backgroundColor:"#B542FF"}}></div> <label>Requerimiento En Proceso</label>{" : "+frecuencias[4]}<br/>
                        - <div className="cuadroColor" style={{backgroundColor:"#ff0000"}}></div> <label>Requerimiento En Hecho</label>{" : "+frecuencias[5]}
                    </div>
                </div>
                {localStorage.getItem("tipo") === "cliente" ? 
                    <div style={{marginLeft: '110px'}}>
                        <br/>
                        <Link to={"/proyecto/"}><button type="button" className="btn boton"><ArrowBackIcon/> Volver</button></Link>
                    </div>
                    :
                    <div style={{marginLeft: '7.5%' , marginTop: '5px'}}>
                        <Link to={"/subProyecto/"+this.props.match.params.id_proyecto}><button type="button" className="btn boton"><ArrowBackIcon/> Volver</button></Link>
                    </div>        
                }
                </div>
            </React.Fragment>
        );
    }
}

export default GraficoRequerimiento;