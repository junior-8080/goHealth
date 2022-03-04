import React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';

import Loans from './Loans';
import LoansUsage from './LoansUsage';

const routes = [
    { path: '/loans', component: Loans, props: {} },
    { path: '/loans/usage', component: LoansUsage, props: {} },
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