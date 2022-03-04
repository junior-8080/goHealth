import React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';

import FoodVendors from './FoodVendor';
import FoodVendorsManage from './Manage';

const CompaniesIndex = props => {
    console.log(props)
    return (
        <React.Fragment>
            <Switch>
                <Route path={`/${props.path}`} exact={true} render={p => (
                    <FoodVendors {...props} {...p} />
                )} />

                <Route path={`/${props.path}/:uuid`} exact={true} render={p => (
                    <FoodVendorsManage {...props} {...p} />
                )} />

                <Redirect to={`/${props.path}`} />
            </Switch>
        </React.Fragment>
    );
}


export default CompaniesIndex;