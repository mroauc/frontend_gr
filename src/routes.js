import React from 'react';
import PrivateRoute from './componentes/Autenticacion/auth';
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom';
import Login from './componentes/Autenticacion/Login';
import Logout from './componentes/Autenticacion/Logout';
import Template from './componentes/Template/Template';
import Errores from './componentes/Errores/Errores';
<<<<<<< HEAD
import DashboardCliente from './componentes/Dashboard/Cliente/DashboardCliente';
import Proyecto from './componentes/Proyecto/Proyecto';
=======
import Cliente from './componentes/Cliente/Cliente';
import Comentario from './componentes/Comentario/Comentario';
import Empresa from './componentes/Empresa/Empresa';
import Glosario from './componentes/Glosario/Glosario'
import Palabra from './componentes/Palabra/Palabra';
import PropuestaCambio from './componentes/PropuestaCambio/PropuestaCambio';
import Proyecto from './componentes/Proyecto/Proyecto';
import RelacionRequerimientos from './componentes/RelacionRequerimientos/RelacionRequerimientos';
import Requerimiento from './componentes/Requerimiento/Requerimiento';
import SubProyecto from './componentes/SubProyecto/SubProyecto';
import Usuario from './componentes/Usuario/Usuario';
import Dashboard from './componentes/Dashboard/Dashboard';
>>>>>>> d5826602bb59085918b5d1f543feca6f7df682cc

const Routes=()=>(
    <Router>
        <Switch>
            <Route exact path="/" component={Login} />
<<<<<<< HEAD
            <PrivateRoute path="/index" component={DashboardAdmin} />
            <PrivateRoute path="/indexCliente" component={DashboardCliente} />
            <PrivateRoute path="/proyectos" component={Proyecto} />
            <PrivateRoute path="/templates" component={Template} />
            <PrivateRoute path="/errores" component={Errores} />
=======
            <Route path="/index" component={Dashboard} />
            <PrivateRoute path="/templates" component={Template} />
            <PrivateRoute path="/error" component={Errores} />
            <PrivateRoute path="/cliente" component={Cliente} />
            <PrivateRoute path="/comentario" component={Comentario} />
            <PrivateRoute path="/empresa" component={Empresa} />
            <PrivateRoute path="/glosario" component={Glosario} />
            <PrivateRoute path="/palabra" component={Palabra} />
            <PrivateRoute path="/cambio" component={PropuestaCambio} />
            <PrivateRoute path="/proyecto" component={Proyecto} />
            <PrivateRoute path="/relacion_requerimiento" component={RelacionRequerimientos} />
            <PrivateRoute path="/requerimiento" component={Requerimiento} />
            <PrivateRoute path="/subProyecto" component={SubProyecto} />
            <PrivateRoute path="/template" component={Template} />
            <PrivateRoute path="/usuario" component={Usuario} />
        
>>>>>>> d5826602bb59085918b5d1f543feca6f7df682cc
            <Route exact path="/logout" component={Logout} />
        </Switch>
    </Router>
);

export default Routes;