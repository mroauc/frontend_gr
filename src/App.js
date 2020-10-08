import React from 'react';
import logo from './logo.svg';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap';
import {BrowserRouter as Router, Route} from 'react-router-dom';
import Navigation from './Navigation'
import Palabra from './componentes/Palabra/Palabra'
import Empresa from './componentes/Empresa/Empresa'
import Cliente from './componentes/Cliente/Cliente'
import Glosario from './componentes/Glosario/Glosario'
import unGlosario from './componentes/Glosario/unGlosario/unGlosario'
import Comentario from './componentes/Comentario/Comentario'
import Comentario2 from './componentes/Comentario/Comentario2'
import subProyecto from './componentes/SubProyecto/SubProyecto'


function App() {
  return (
    <Router>
      <Route path="/" component={Navigation}></Route>
      <Route path="/comentarios" component={Comentario} ></Route>
      <Route path="/comentarios2" component={Comentario2} ></Route>
      <Route path="/subProyectos" component={subProyecto} ></Route>
      <Route path="/glosarios" component={Glosario} ></Route>
      <Route path="/glosario/:id_glosario" component={unGlosario} ></Route>
      <Route path="/palabras" component={Palabra} ></Route>
      <Route path="/empresas" component={Empresa} ></Route>
      <Route path="/clientes" component={Cliente} ></Route>
      
      
    </Router>
  );
}

export default App;
