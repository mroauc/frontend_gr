import Axios from 'axios';
import React, {useEffect, useState } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import uuid from 'uuid/dist/v4';
import './DragDrop.css';
import ModalReq from './ModalReq';
import ModalReqSelected from './ModalReqSelected';

function Dragdrop(id_subproyecto) {

  const [modalInsertar, setModalIsertar] = useState(false);

  const [requerimientoSeleccionado, setRequerimiento] = useState({
    id_requerimiento: 0,
    nombre: '',
    nombre_descriptivo: '',
    descripcion: '',
    id_usuario: '',
    id_subProyecto: id_subproyecto.id_subproyecto,
    fecha_creacion: '',
    prioridad: '',
    estado: '',
    categoria: '',
    id_template: ''
  });
  const [modalEditar, setModalEditar] = useState(false);

  var requeri = {
    id_requerimiento: 0,
    nombre: '',
    nombre_descriptivo: '',
    descripcion: '',
    id_usuario: '',
    id_subProyecto: id_subproyecto.id_subproyecto,
    fecha_creacion: '',
    prioridad: '',
    estado: '',
    categoria: '',
    id_template: ''
}

  //valores que se traen del backend y se mostraran en pantalla
  var itemsPropuesto = [];
  var itemsRedactado = [];
  var itemsAprobado = [];
  var itemsPorHacer = [];
  var itemsEnProceso = [];
  var itemsHecho = [];
  const [columns, setColumns] = useState([]);
  const [requerimientos, setRequerimientos] = useState([]);

  const columnsFromBackend =
    {
      ["1"]:{
        name: 'Propuesto',
        items: itemsPropuesto
      },
      ["2"]:{
        name: 'Redactado',
        items: itemsRedactado
      },
      ["3"]:{
        name: 'Aprobado',
        items: itemsAprobado
      },
      ["4"]: {
        name: 'Por Hacer',
        items: itemsPorHacer
      },
      ["5"]: {
        name: 'En Proceso',
        items: itemsEnProceso
      },
      ["6"]: {
        name: 'Hecho',
        items: itemsHecho
      }
    };

  useEffect(() => {
    principio();
  },[])

  const cambioModalInsertar=()=>{
    setModalIsertar(!modalInsertar);
  }

  const cambioModalEditar=()=>{
    setModalEditar(!modalEditar);
  }

  const mostrarRequerimiento=async(nombre)=>{
    const token = localStorage.getItem('token');
    await Axios.get(`http://localhost:8080/api/requerimiento/nombre/${nombre}`, {headers: {"Authorization": `Bearer  ${token}`}})
    .then(async response=>{
      await setRequerimiento(response.data);
      mostrar();
    });
  }

  const mostrar=()=>{
    setModalEditar(!modalEditar);
  }

  const principio = async () => {
    const token = localStorage.getItem('token');
    var respuesta = [];

    await Axios.get(`http://localhost:8080/api/requerimiento/obtener/${id_subproyecto.id_subproyecto}`, {headers: {"Authorization": `Bearer  ${token}`}})
    .then(async response => {
      respuesta = response.data; 
      await setRequerimientos(response.data);
    });

    if(localStorage.getItem("tipo") === "analista"){
      let usuarioActividad = [];
        await Axios.get(`http://localhost:8080/api/usuarioactividad/`, {headers: {"Authorization": `Bearer  ${token}`}})
        .then(async response => {
            usuarioActividad = response.data
        })
        let ReqsDeAnalista = usuarioActividad.filter(item => item.id_usuario.toString() === localStorage.getItem("id"));
        const nuevoArreglo = respuesta.filter(item => {
            return ReqsDeAnalista.find(item2 => item2.id_requerimiento === item.id_requerimiento) !== undefined
        })
        respuesta = nuevoArreglo;
    }

    respuesta.map(requerimiento => {
      const nuevo = {
        id: uuid(), content: requerimiento.nombre
      }
      console.log(requerimiento)
      if(requerimiento.estado==="Propuesto"){
        itemsPropuesto.push(nuevo);
      }
      if(requerimiento.estado==="Redactado"){
        itemsRedactado.push(nuevo);
      }
      if(requerimiento.estado==="Aprobado"){
        itemsAprobado.push(nuevo);
      }
      if(requerimiento.estado==="Por Hacer"){
        itemsPorHacer.push(nuevo);
      }
      if(requerimiento.estado==="En Proceso"){
        itemsEnProceso.push(nuevo);
      }
      if(requerimiento.estado==="Hecho"){
        itemsHecho.push(nuevo);
      }
    })
    setColumns(columnsFromBackend);
  }

  const buscarNombreDescripcion = (nombre) => {
    var reque = requerimientos.find(item => item.nombre === nombre);
    return reque.nombre_descriptivo; 
  }

  const onDragEnd = async(result, columns, setColumns) => {
    if (!result.destination) return;
    const { source, destination } = result;
    console.log(result)
    console.log(columns)
    
    if(source.droppableId !== destination.droppableId){
      const sourceColumn = columns[source.droppableId];
      const destColumn = columns[destination.droppableId];
      const sourceItems = [...sourceColumn.items];
      const destItems = [...destColumn.items];
      const [removed] = sourceItems.splice(source.index, 1);
      destItems.splice(destination.index, 0, removed);
      setColumns({
        ...columns,
        [source.droppableId]: {
          ...sourceColumn,
          items: sourceItems
        },
        [destination.droppableId]: {
          ...destColumn,
          items: destItems
        }
      })

      const token = localStorage.getItem('token');
      var versionAntigua = '';

      await Axios.get(`http://localhost:8080/api/requerimiento/nombre/${removed.content}`, {headers: {"Authorization": `Bearer  ${token}`}})
      .then(response=>{
        versionAntigua = response.data;
        versionAntigua.estado = destColumn.name;
        Axios.post('http://localhost:8080/api/requerimiento/editar/', versionAntigua, {headers: {"Authorization": `Bearer ${token}`}})
      })

    }
    else{
      const column = columns[source.droppableId];
      const copiedItems = [...column.items];
      const [removed] = copiedItems.splice(source.index, 1);
      copiedItems.splice(destination.index, 0, removed);
      setColumns({
        ...columns,
        [source.droppableId]: {
          ...column,
          items: copiedItems
        }
      })
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', height: '100%' }}>
      <DragDropContext onDragEnd={result => onDragEnd(result, columns, setColumns)}>
        {Object.entries(columns).map(([id, column], index) =>{
          return(
            <React.Fragment>
            {index === 0 ?
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <div style={{fontSize:'18px', fontFamily:'sans-serif', margin:'8'}}>
                    <label><strong></strong>Primera Fase</label> &nbsp;
                    {(column.name === 'Propuesto' && localStorage.getItem("tipo") !== "analista") ?
                      <button className="btn botoncito2" onClick={()=>setModalIsertar(!modalInsertar)}>+</button>
                      :
                      ''
                    }
                    <Droppable droppableId="1" key="1">
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          style={{ 
                            background: snapshot.isDraggingOver ? 'lightblue' : 'lightgrey',
                            height: '166px',
                            width: 250,
                            overflow: 'auto'
                          }}
                          
                          {...provided.droppableProps}
                        >
                          {column.items.map((item, index)=>{
                            
                            return(
                              
                              <Draggable key={item.id} draggableId={item.id} index={index}>
                                {(provided, snapshot)=>{
                                  return(
                                    <div 
                                      ref={provided.innerRef}
                                      {...provided.draggableProps}
                                      {...provided.dragHandleProps}
                                      style={{
                                        userSelect: 'none',
                                        padding: 8,
                                        margin: '0 0 8px 0',
                                        minHeight: '50px',
                                        backgroundColor: snapshot.isDragging ? '#263B4A' : '#456C86',
                                        color: 'white',
                                        ...provided.draggableProps.style
                                      }}
                                      onClick={()=>mostrarRequerimiento(item.content)}
                                    >
                                      <strong>{item.content}</strong>: {buscarNombreDescripcion(item.content)}
                                    </div>
                                  )
                                }}
                              </Draggable>
                            );
                          })}
                        {provided.placeholder}
                        </div>
                      )}
                    </Droppable>

                    <Droppable droppableId="2" key="2">
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          style={{ 
                            background: snapshot.isDraggingOver ? 'lightblue' : 'lightgrey',
                            height: '166px',
                            width: 250,
                            overflow: 'auto'
                          }}
                          
                          {...provided.droppableProps}
                        >
                          {/* {console.log(columns)} */}
                          {Object.entries(columns)[1][1].items.map((item, index)=>{
                            
                            return(
                              
                              <Draggable key={item.id} draggableId={item.id} index={index}>
                                {(provided, snapshot)=>{
                                  return(
                                    <div 
                                      ref={provided.innerRef}
                                      {...provided.draggableProps}
                                      {...provided.dragHandleProps}
                                      style={{
                                        userSelect: 'none',
                                        padding: 8,
                                        margin: '0 0 8px 0',
                                        minHeight: '50px',
                                        backgroundColor: snapshot.isDragging ? '#263B4A' : '#456C86',
                                        color: 'white',
                                        ...provided.draggableProps.style
                                      }}
                                      onClick={()=>mostrarRequerimiento(item.content)}
                                    >
                                      <strong>{item.content}</strong>: {buscarNombreDescripcion(item.content)}
                                    </div>
                                  )
                                }}
                              </Draggable>
                            );
                          })}
                        {provided.placeholder}
                        </div>
                      )}
                    </Droppable>

                    <Droppable droppableId="3" key="3">
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          style={{ 
                            background: snapshot.isDraggingOver ? 'lightblue' : 'lightgrey',
                            height: '166px',
                            width: 250,
                            overflow: 'auto'
                          }}
                          
                          {...provided.droppableProps}
                        >
                          {console.log(Object.entries(columns)[1][1])}
                          {Object.entries(columns)[2][1].items.map((item, index)=>{
                            
                            return(
                              
                              <Draggable key={item.id} draggableId={item.id} index={index}>
                                {(provided, snapshot)=>{
                                  return(
                                    <div 
                                      ref={provided.innerRef}
                                      {...provided.draggableProps}
                                      {...provided.dragHandleProps}
                                      style={{
                                        userSelect: 'none',
                                        padding: 8,
                                        margin: '0 0 8px 0',
                                        minHeight: '50px',
                                        backgroundColor: snapshot.isDragging ? '#263B4A' : '#456C86',
                                        color: 'white',
                                        ...provided.draggableProps.style
                                      }}
                                      onClick={()=>mostrarRequerimiento(item.content)}
                                    >
                                      <strong>{item.content}</strong>: {buscarNombreDescripcion(item.content)}
                                    </div>
                                  )
                                }}
                              </Draggable>
                            );
                          })}
                        {provided.placeholder}
                        </div>
                      )}
                    </Droppable>
                  </div>

                </div>
              :""

            }
            {index > 2 ? 
            
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <label><strong>{column.name}</strong></label> &nbsp;
                  <div style={{ margin: 8}}>

                    <Droppable droppableId={id} key={id}>
                    {(provided, snapshot) => {
                      return(
                        <div
                          {...provided.droppableProps}
                          ref={provided.innerRef}
                          style={{
                            background: snapshot.isDraggingOver ? 'lightblue' : 'lightgrey',
                            padding: 4,
                            width: 250,
                            minHeight: 500
                          }}
                        >
                          {column.items.map((item, index)=>{
                            
                            return(
                              
                              <Draggable key={item.id} draggableId={item.id} index={index}>
                                {(provided, snapshot)=>{
                                  return(
                                    <div 
                                      ref={provided.innerRef}
                                      {...provided.draggableProps}
                                      {...provided.dragHandleProps}
                                      style={{
                                        userSelect: 'none',
                                        padding: 16,
                                        margin: '0 0 8px 0',
                                        minHeight: '50px',
                                        backgroundColor: snapshot.isDragging ? '#263B4A' : '#456C86',
                                        color: 'white',
                                        ...provided.draggableProps.style
                                      }}
                                      onClick={()=>mostrarRequerimiento(item.content)}
                                    >
                                      <strong>{item.content}</strong>: {buscarNombreDescripcion(item.content)}
                                    </div>
                                  )
                                }}
                              </Draggable>
                            );
                          })}
                          {provided.placeholder}
                        </div>
                      )
                    }}
                  </Droppable>
                </div>
              </div> 
            : ""
          }
            
          </React.Fragment>
          )
        })}
      </DragDropContext>

      <ModalReq
        id_subProyecto = {id_subproyecto.id_subproyecto}
        estadoModalInsertar = {modalInsertar}
        modalInsertar = {cambioModalInsertar}
        begin = {principio}
        requerimiento = {requeri}
      />

      <ModalReqSelected
        id_subProyecto = {id_subproyecto.id_subproyecto}
        estadoModalEditar = {modalEditar}
        modalEditar = {cambioModalEditar}
        begin = {principio}
        requerimiento = {requerimientoSeleccionado}
      />
      
    </div>
    
  );
}

export default Dragdrop;