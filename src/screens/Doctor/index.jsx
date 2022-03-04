import React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';

import Doctor from './Doctor';
import DoctorManage from './Manage';

const CompaniesIndex = props => {
    return (
        <React.Fragment>
            <Switch>
                <Route path={`/${props.path}`} exact={true} render={p => (
                    <Doctor {...props} {...p} />
                )} />

                <Route path={`/${props.path}/:uuid`} exact={true} render={p => (
                    <DoctorManage {...props} {...p} />
                )} />

                <Redirect to={`/${props.path}`} />
            </Switch>
        </React.Fragment>
    );
}


export default CompaniesIndex;