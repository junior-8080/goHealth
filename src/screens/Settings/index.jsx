import React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';

import Settings from './Settings';
import SettingsDeliveries from './SettingsDeliveries';
import SettingsItemsCategories from './SettingsItemsCategories';

const routes = [
    { path: '/settings', component: Settings, },
    { path: '/settings/items-categories', component: SettingsItemsCategories, },
    { path: '/settings/deliveries', component: SettingsDeliveries, },
];

const SettingsIndex = props => {

    return (
        <React.Fragment>
            <Switch>
                {routes.map(row => (
                    <Route key={row.path} path={row.path} exact={true} render={p => (
                        <row.component {...props} {...p} />
                    )} />
                ))}

                <Redirect to={routes[0].path} />
            </Switch>
        </React.Fragment>
    );
}


export default SettingsIndex;