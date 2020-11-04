import React from 'react';
import PrivateRoute from './componentes/Autenticacion/auth';
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom';
import Login from './componentes/Autenticacion/Login';
import Logout from './componentes/Autenticacion/Logout';
import Template from './componentes/Template/Template';
import Errores from './componentes/Errores/Errores';
import Cliente from './componentes/Cliente/Cliente';
import Comentario from './componentes/Comentario/Comentario';
import Empresa from './componentes/Empresa/Empresa';
import Glosario from './componentes/Glosario/Glosario';
import unGlosario from './componentes/Glosario/unGlosario/unGlosario'
import Palabra from './componentes/Palabra/Palabra';
import PropuestaCambio from './componentes/PropuestaCambio/PropuestaCambio';
import Proyecto from './componentes/Proyecto/Proyecto';
import RelacionRequerimientos from './componentes/RelacionRequerimientos/RelacionRequerimientos';
import Requerimiento from './componentes/Requerimiento/Requerimiento';
import SubProyecto from './componentes/SubProyecto/SubProyecto';
import Usuario from './componentes/Usuario/Usuario';
import Dashboard from './componentes/Dashboard/Dashboard';
import error from './componentes/error';
import Navigation from './componentes/Menu/Navigation';
import Manager from './componentes/Manager/Manager';


const Routes=()=>(
    <Router>
        <Switch>
            <Route exact path="/" component={Login} />
            <PrivateRoute path="/index" component={Dashboard} />
            <PrivateRoute path="/templates" component={Template} />
            <PrivateRoute path="/errores" component={Errores} />
            <PrivateRoute path="/cliente" component={Cliente} />
            <PrivateRoute path="/comentario" component={Comentario} />
            <PrivateRoute path="/empresa" component={Empresa} />
            <PrivateRoute path="/glosario" component={Glosario} />
            <PrivateRoute path="/palabra/:id_proyecto" component={Palabra} />
            <PrivateRoute path="/cambio" component={PropuestaCambio} />
            <PrivateRoute path="/proyecto" component={Proyecto} />
            <PrivateRoute path="/relacion_requerimiento" component={RelacionRequerimientos} />
            <PrivateRoute path="/requerimiento/:id_subproyecto" component={Requerimiento} />
            <PrivateRoute path="/subProyecto/:id_proyecto" component={SubProyecto} />
            <PrivateRoute path="/template" component={Template} />
            <PrivateRoute path="/usuario" component={Usuario} />
            <PrivateRoute path="/propuestaCambio/:id_proyecto" component={PropuestaCambio} />
            <PrivateRoute path="/noAutorizado" component={error} />
            <PrivateRoute path="/manager" component={Manager} />

            <Route exact path="/logout" component={Logout} />
        </Switch>
    </Router>
);

export default Routes;