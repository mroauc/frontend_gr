import Axios from 'axios';
import React, {useEffect, useState } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import uuid from 'uuid/dist/v4';

function Dragdrop(id_subproyecto) {

  //valores que se traen del backend y se mostraran en pantalla
  var itemsFromBackend = [];
  const [columns, setColumns] = useState([]);
  

  const columnsFromBackend =
    {
      [uuid()]:{
        name: 'Creado',
        items: itemsFromBackend
      },
      [uuid()]: {
        name: 'En Redaccion',
        items: []
      },
      [uuid()]: {
        name: 'Aprobado',
        items: []
      }
    };

  useEffect(() => {
    principio();
  },[])

  const principio = async () => {
    const token = localStorage.getItem('token');
    var respuesta = [];
    await Axios.get(`http://localhost:8080/api/requerimiento/obtener/${id_subproyecto.id_subproyecto}`, {headers: {"Authorization": `Bearer  ${token}`}})
    .then(response => {
      respuesta = response.data; 
    });

    respuesta.map(requerimiento => {
      const nuevo = {
        id: uuid(), content: requerimiento.nombre
      }
      itemsFromBackend.push(nuevo);
    })

    setColumns(columnsFromBackend);
  }

  const onDragEnd = (result, columns, setColumns) => {
    if (!result.destination) return;
    const { source, destination } = result;
    
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
        {Object.entries(columns).map(([id, column]) =>{
          return(
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{fontSize:'18px', fontFamily:'sans-serif'}}>
                <label><strong>{column.name}</strong></label>
              </div>
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
                              >
                                {item.content}
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
          )
        })}
      </DragDropContext>
    </div>
  );
}

export default Dragdrop;