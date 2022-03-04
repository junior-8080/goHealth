import React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';

import Companies from './Companies';
import CompaniesManage from './Manage';

const CompaniesIndex = props => {

    return (
        <React.Fragment>
            <Switch>
                <Route path={`/${props.path}`} exact={true} render={p => (
                    <Companies {...props} {...p} />
                )} />

                <Route path={`/${props.path}/:uuid`} exact={true} render={p => (
                    <CompaniesManage {...props} {...p} />
                )} />

                <Redirect to={`/${props.path}`} />
            </Switch>
        </React.Fragment>
    );
}


export default CompaniesIndex;