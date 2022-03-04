import React from 'react';
import { connect } from 'react-redux';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { IntlProvider } from 'react-intl';
import localeIntl from './assets/intl/data.json';
import * as authAct from './store/auth/_authActions';
import * as dataAct from './store/data/_dataActions';
import * as func from './utils/functions';
import { axius } from './utils';

const Main = React.lazy(() => import('./Main'));
const Authenticate = React.lazy(() => import('./screens/authenticate/auth'));

const LoadingHTML = () => (
  <div className="loader-demo-box" style={{ height: '100vh' }}>
    <div className="dot-opacity-loader">
      <span></span>
      <span></span>
      <span></span>
    </div>
  </div>
);

class App extends React.Component {

  state = {
    loadingApp: false,
  }

  componentDidMount() {
    this.initApp();
  }

  initApp = () => {
    // ::: run some things before loadingApp the MainApp
    if (this.props.auth.authenticated) {
      this.setState({ loadingApp: true });
      axius.get(`users/${this.props.auth.logg.uuid}`).then((res) => {
        this.setState({ loadingApp: false });
        if (res.status === 200) {
          this.props.signInSuccess(this.props.auth.token, res.data);
          func.setStorageJson('user', res.data);
        } else {
          this.props.signOutSuccess();
        }
      });
    }
    
    axius.get('settings').then((res) => {
      if (res.status === 200) {
        this.props.setSetSettings('settings', res.data);
      }
    });
  }

  render() {
    const { loadingApp } = this.state;
    const { auth: { authenticated }, utils: { lang } } = this.props;

    return (
      <React.Fragment>
        <React.Suspense fallback={<LoadingHTML />}>
          <IntlProvider locale={lang} defaultLocale="en" messages={localeIntl[lang]}>
            <Router>
              {loadingApp ? (<LoadingHTML />) : (authenticated ? (<Route render={() => <Main />} />) : (<Authenticate />))}
            </Router>
          </IntlProvider>
        </React.Suspense>
      </React.Fragment>
    );
  }

}

const mapStateToProps = (state) => ({
  auth: state.auth,
  utils: state.utils
});

const mapDispatchToProps = (dispatch) => ({
  signInSuccess: (token, data) => {
    dispatch(authAct.signInSuccess(token, data));
  },
  setSetSettings: (key, value) => {
    dispatch(dataAct.setSetSettings(key, value));
  },
  signOutSuccess: () => {
    dispatch(authAct.signOutSuccess());
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(App);