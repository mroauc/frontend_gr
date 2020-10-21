import React from 'react';
import PrivateRoute from './componentes/Autenticacion/auth';
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom';
import Login from './componentes/Autenticacion/Login';
import Logout from './componentes/Autenticacion/Logout';
import DashboardAdmin from './componentes/Dashboard/DashboardAdmin';
import Template from './componentes/Template/Template';
import Errores from './componentes/Errores/Errores';
import Navigation from './Navigation';

const Routes=()=>(
    <Router>
        <Switch>
            <Route exact path="/" component={Login} />
            <PrivateRoute path="/index" component={DashboardAdmin} />
            <PrivateRoute path="/templates" component={Template} />
            <PrivateRoute path="/error" component={Errores} />
            <Route exact path="/logout" component={Logout} />
        </Switch>
    </Router>
);

export default Routes;