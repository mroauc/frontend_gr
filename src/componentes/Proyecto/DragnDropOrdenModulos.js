import Axios from 'axios';
import React, { Component } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import Menu from '../Menu/Menu';


export default class DragnDropOrden extends Component {

    state={
        modulos : []
    }

    getModulos= async ()=>{
        const token = localStorage.getItem('token');
        var copiaModulos = [];
        await Axios.get(`http://localhost:8080/api/subProyecto/pertenecientes/${this.props.idProyecto}`,{headers: {"Authorization": `Bearer ${token}`}})
        .then(response=>{ 
            copiaModulos = response.data;
        });
        copiaModulos = copiaModulos
            .sort((a,b) => {
                if(a.index_documento === 0) return 1;
                if(b.index_documento === 0) return 0;
                
                return a.index_documento-b.index_documento;
            });

        this.setState({
            modulos: copiaModulos
        });
    }

    cambiarPosicion = async (e) => {
        if (!e.destination) return;
        const token = localStorage.getItem('token');
        let copiaElementos = [...this.state.modulos];

        const [borrado] = copiaElementos.splice(e.source.index, 1);
        copiaElementos.splice(e.destination.index, 0, borrado);
        
        this.setState({modulos : copiaElementos});

        for (let i = 0; i < copiaElementos.length; i++) {
            copiaElementos[i].index_documento = i+1;
            await Axios.post(`http://localhost:8080/api/subProyecto/editar`,copiaElementos[i],{headers: {"Authorization": `Bearer ${token}`}});
        }
    }

    componentDidMount(){
        this.getModulos();
    }

    componentWillReceiveProps(next_props){
        this.getModulos();
    }

    render(){
        return(
            <React.Fragment>
                <DragDropContext onDragEnd={(e) => {this.cambiarPosicion(e)}}>
                    <div style={{backgroundColor:'#ccc', width:'80%', margin:'0 auto', textAlign:'center'}}>
                        <Droppable droppableId="droppable-1">
                        {(provided, snapshot) => (
                            <div
                                ref={provided.innerRef}
                                style={{ backgroundColor: 'white' }}
                                {...provided.droppableProps}
                            >
                            {this.state.modulos.map((modulo, index) => {
                                return(
                                    <div>
                                        <p style={{display:'inline', marginRight:'5px'}}>{index+1}</p>
                                        <Draggable key={modulo.id_subProyecto} draggableId={modulo.id_subProyecto.toString()} index={index}>
                                            {(provided, snapshot)=>{
                                            return(
                                                <div
                                                    key = {modulo.id_subProyecto} 
                                                    ref={provided.innerRef}
                                                    {...provided.draggableProps}
                                                    {...provided.dragHandleProps}
                                                    style={{
                                                        userSelect: 'none',
                                                        padding: 5,
                                                        margin: '0 0 5px 0',
                                                        border : '1px solid black',
                                                        borderRadius: '5px',
                                                        minHeight: '20px',
                                                        backgroundColor: snapshot.isDragging ? 'rgb(150 167 255 / 60%)' : '#dedede',
                                                        display: 'inline-table',
                                                        width: '95%',
                                                        color: 'black',
                                                        ...provided.draggableProps.style
                                                    }}
                                                    >
                                                    {modulo.nombre_subProyecto}
                                                </div>
                                            )
                                            }}
                                        </Draggable>
                                    </div>
                                )
                            
                            })}
                            {provided.placeholder}
                            </div>
                        )}
                        </Droppable>
                    </div>
                </DragDropContext>
            </React.Fragment>

        );
    }
}