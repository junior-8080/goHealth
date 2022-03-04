import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Route, Switch, Redirect } from 'react-router-dom';
import { ConnectedRouter } from 'connected-react-router';
import { history } from './store/_store';
import { func } from './utils';

import * as authAct from './store/auth/_authActions';
import * as utilsAct from './store/utils/_utilsActions';
import * as dataAct from './store/data/_dataActions';

// import NotFound from './partials/NotFound';

const Header = React.lazy(() => import('./partials/Header'));
const Navigation = React.lazy(() => import('./partials/Navigation'));
// const Footer = React.lazy(() => import('./partials/Footer'));


const Users = React.lazy(() => import('./screens/Users'));
const Loans = React.lazy(() => import('./screens/Loans'));
const Orders = React.lazy(() => import('./screens/Orders'));
const Doctor = React.lazy(() => import('./screens/Doctor'));
const FoodVendors = React.lazy(() => import('./screens/FoodVendors'));
const Groceries = React.lazy(() => import('./screens/Groceries'));
const Pharmacies = React.lazy(() => import('./screens/Pharmacies'));
const Settings = React.lazy(() => import('./screens/Settings'));
const Transfers = React.lazy(() => import('./screens/Transfers'));




let routes = [
    { code: 'pha', path: '/pharmacies', component: Pharmacies, props: { params: { type: 'pharmacies', }, path: 'pharmacies' } },
    { code: 'man', path: '/manufacturers', component: Pharmacies, props: { params: { type: 'manufacturers', }, path: 'manufacturers' } },
    { code: 'doc', path: '/doctors', component: Doctor, props: { params: { type: 'doctors', }, path: 'doctors' }},
    { code: 'usr', path: '/users', component: Users, props: { title: 'User', type: 'users' } },
    { code: 'lon', path: '/loans', component: Loans, },
    { code: 'ord', path: '/orders', component: Orders, },
    { code: 'trs', path: '/transfers', component: Transfers, },
    { code: 'set', path: '/settings', component: Settings, },
    { code: 'fdven', path: '/foodvendors', component: FoodVendors, props: { params: { type: 'restaurant', }, path: 'foodvendors' }},
    { code: 'gro', path: '/groceries', component: Groceries, props: { params: { type: 'restaurants' , }, path: 'groceries' }},


];

class Main extends Component {

    render() {
        // const { _utils: { pageTitle }, } = this.props;
         routes = routes.filter(rt => func.hasR(rt.code));

        const LoadingHTML = () => (
            <div className="loader-demo-box" style={{ height: '100vh' }}>
                <div className="dot-opacity-loader">
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
            </div>
        );

        return (
            <React.Fragment>
                <ConnectedRouter history={history}>
                    <div id="page-top">
                        <div id="wrapper">
                            <Navigation {...this.props} />
                            <div id="content-wrapper" className="d-flex flex-column">
                                <div id="content">
                                    <Header {...this.props} />
                                    <div className="container-fluid">
                                        <div className="d-sm-flex align-items-center justify-content-between mb-4">
                                            {/* <h1 className="h3 mb-0 text-gray-800">{pageTitle}</h1> */}
                                            {/* <span className="d-none d-sm-inline-block btn btn-sm btn-primary shadow-sm pointer"><i
                                                className="fas fa-download fa-sm text-white-50"></i> Generate Report</span> */}
                                        </div>
                                        <React.Suspense fallback={<LoadingHTML />}>
                                            <Switch>
                                                {routes.map(row => (
                                                    <Route key={row.path} path={row.path} exact={row.exact} render={p => (
                                                        <row.component {...this.props} {...p} {...row.props} />
                                                    )} />
                                                ))}
                                                <Redirect to={routes[0].path} />
                                            </Switch>
                                        </React.Suspense>
                                    </div>
                                </div>

                                <footer className="sticky-footer bg-white">
                                    <div className="container my-auto">
                                        <div className="copyright text-center my-auto">
                                            <span>Copyright &copy; Your Website 2020</span>
                                        </div>
                                    </div>
                                </footer>
                            </div>
                        </div>
                        <a className="scroll-to-top rounded" href="#page-top">
                            <i className="fas fa-angle-up"></i>
                        </a>
                    </div>
                </ConnectedRouter>
            </React.Fragment>
        );
    }
}

const mapStateToProps = (state) => ({
    _auth: state.auth,
    _utils: state.utils,
    _data: state.data,
    router: state.router
});

const mapDispatchToProps = (dispatch) => ({
    signOutSuccess: () => {
        dispatch(authAct.signOutSuccess());
    },
    setPageTitle: (title) => {
        dispatch(utilsAct.setPageTitle(title));
    },
    setSetSettings: (key, value) => {
        dispatch(dataAct.setSetSettings(key, value));
    }
});

export default connect(mapStateToProps, mapDispatchToProps)(Main);