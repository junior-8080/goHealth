import React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';

import Users from './Users';
import UsersAccess from './Access';
import Notifications from './Notifications';

const routes = [
    { path: '/users', component: Users, props: { title: 'User', type: 'user' } },
    { path: '/users/admins', component: Users, props: { title: 'Admin user', type: 'admin' } },
    { path: '/users/permissions', component: UsersAccess, props: {} },
    { path: '/riders', component: Users, props: { title: 'Rider', type: 'rider' } },
    { path: '/users/notifications', component: Notifications, props: { title: 'Rider', type: 'rider' } },
];

const CompaniesIndex = props => {

    // console.log(props)

    return (
        <React.Fragment>
            <Switch>
                {routes.map(row => (
                    <Route key={row.path} path={row.path} exact={true} render={p => (
                        <row.component {...props} {...p} {...row.props} />
                    )} />
                ))}

                <Redirect to={routes[0].path} />
            </Switch>
        </React.Fragment>
    );
}


export default CompaniesIndex;