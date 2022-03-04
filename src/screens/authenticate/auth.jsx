import { message } from 'antd';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as authAct from '../../store/auth/_authActions';
import * as utilsAct from '../../store/data/_dataActions';
import { axius, func } from '../../utils';

class Authenticate extends Component {

    state = {
        v: {
            type: 'admin',
            username: window.location.hostname === 'localhost' ? 'walkingkode' : '',
            password: window.location.hostname === 'localhost' ? 'space123' : '',
        },
        submitting: false,
    };

    submit = () => {
        const { v } = this.state;
        this.setState({ submitting: true }, () => {
            axius.post('authenticate', v).then(res => {
                if (res.status === 200) {
                    func.setStorage('token', res.token);
                    func.setStorageJson('user', res.data);
                    func.redirect('/');
                } else {
                    this.setState({ submitting: false });
                    if (res.status === 412) {
                        // func.alert('Failed', res.data.join('<br />'));
                    } else {
                        message.error(res.message);
                    }
                }
            });
        });
    }

    render() {
        const { v, submitting } = this.state;

        return (
            <React.Fragment>
                <div className="bg-gradient-primary">
                    <div className="container" style={{ height: '100vh' }}>
                        <div className="row justify-content-center">
                            <div className="col-xl-10 col-lg-12 col-md-9">
                                <div className="card o-hidden border-0 shadow-lg my-5">
                                    <div className="card-body p-0">
                                        <div className="row">
                                            <div className="col-lg-6 d-none d-lg-block bg-login-image"></div>
                                            <div className="col-lg-6">
                                                <div className="p-5">
                                                    <div className="text-center">
                                                        <h1 className="h4 text-gray-900 mb-4">Welcome Back!</h1>
                                                    </div>
                                                    <form className="user">
                                                        <div className="form-group">
                                                            <input type="email" className="form-control form-control-user" value={v.username} disabled={submitting}
                                                                placeholder="Enter Email Address..." onChange={e => this.setState({ v: { ...this.state.v, username: e.target.value } })} />
                                                        </div>
                                                        <div className="form-group">
                                                            <input type="password" className="form-control form-control-user" value={v.password} disabled={submitting}
                                                                placeholder="Password" onChange={e => this.setState({ v: { ...this.state.v, password: e.target.value } })} />
                                                        </div>
                                                        <span className="btn btn-primary btn-user btn-block" disabled={submitting} onClick={this.submit}>
                                                            {submitting ? <i className="fa fa-spin fa-spinner"></i> : ''} Login
                                                        </span>
                                                    </form>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </React.Fragment>
        );
    }

}

const mapStateToProps = (state) => ({
    auth: state.auth,
    utils: state.utils,
    router: state.router
});

const mapDispatchToProps = (dispatch) => ({
    signInSuccess: (token, data) => {
        dispatch(authAct.signInSuccess(token, data));
    },
    setSetSettings: (key, value) => {
        dispatch(utilsAct.setSetSettings(key, value));
    }
});

export default connect(mapStateToProps, mapDispatchToProps)(Authenticate);