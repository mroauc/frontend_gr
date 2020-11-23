import Axios from 'axios';
import React, {Component} from 'react';
import { PieChart, Pie, Sector, Cell, Tooltip } from 'recharts';
import Menu from '../Menu/Menu';
import {Link} from 'react-router-dom';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import './GraficoRequerimientos.css';
import '../vistaCrud.css';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

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

class GraficoRequerimiento extends Component{

    state={
        data : []
    }

    componentDidMount(){
        this.index();
    }

    index=async()=>{
        const token = localStorage.getItem('token');
        const id_proy = this.props.match.params.id_proyecto;
        var subProyectos;
        await Axios.get(`http://localhost:8080/api/subProyecto/pertenecientes/${id_proy}`,{headers: {"Authorization": `Bearer ${token}`}})
        .then(response=>{
            subProyectos = response.data;
        })
        this.obtenerRequerimientos(subProyectos);
    }

    obtenerRequerimientos=async(subProyectos)=>{
        const token = localStorage.getItem('token');
        var requerimientos = [];
        for (let index = 0; index < subProyectos.length; index++) {
            await Axios.get(`http://localhost:8080/api/requerimiento/obtener/${subProyectos[index].id_subProyecto}`,{headers: {"Authorization": `Bearer ${token}`}})
            .then(response=>{
                for (let index = 0; index < response.data.length; index++) {
                    requerimientos.push(response.data[index]);                    
                }
            })
        }
        console.log(requerimientos);
        this.cargarData(requerimientos);
    }

    cargarData=async(requerimientos)=>{
        var dataFinal = [];

        //tupla estado CREADO
        var creado = requerimientos.filter(req => req.estado === "Creado");
        var tupla1 = {name: 'Creado', value: creado.length};
        dataFinal.push(tupla1);

        //tupla estado EN REDACCION
        var enRedaccion = requerimientos.filter(req => req.estado === "En Redaccion");
        var tupla2 = {name: 'En Redaccion', value: enRedaccion.length};
        dataFinal.push(tupla2);

        //tupla estado Aprobado
        var aprobado = requerimientos.filter(req => req.estado === "Aprobado");
        var tupla3 = {name: 'Aprobado', value: aprobado.length};
        dataFinal.push(tupla3);

        this.setState({
            data : dataFinal
        });
    }

    render(){
        return(
            <React.Fragment>
                <Menu/>
                <div className="contenedor-grafico">
                    <div className="titulo-grafico">
                        <label>Requerimientos Registrados en el Sistema</label>
                    </div>
                    <PieChart width={700} height={300}>
                        <Pie
                            data={this.state.data}
                            cx={600}
                            cy={150}
                            labelLine={false}
                            label={renderCustomizedLabel}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                        >
                            {
                                this.state.data.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)
                            }
                        </Pie>
                        <Tooltip />
                    </PieChart>
                    <div style={{textAlign:'left', marginLeft:'20px'}}>
                        <label>-Requerimiento Creado</label><br/>
                        <label>-Requerimiento En Redaccion</label><br/>
                        <label>-Requerimiento Aprobado</label>
                    </div>
                </div>
                <div style={{marginLeft: '110px'}}>
                    <br/>
                    <Link to={"/subProyecto/"+this.props.match.params.id_proyecto}><button type="button" className="btn boton"><ArrowBackIcon/> Volver</button></Link>
                </div>
            </React.Fragment>
        );
    }
}

export default GraficoRequerimiento;