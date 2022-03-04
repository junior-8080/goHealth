import { Input, Modal, notification, Pagination } from 'antd';
import moment from 'moment';
import React from 'react';
import { axius, func } from '../../utils';


import UsersForm from '../Users/Form';

const limit = 12;

class CompaniesUsers extends React.Component {

    state = {
        loading: true, addUser: false, formType: '',
        data: [], row: {}, filter: { status: '' }, v: {},
        step: 0, currentStep: 1, total: 0, edited: '',
    };

    componentDidMount() {
        this.getData();
    }

    getData = () => {
        var types = { 0: 1, 1: 3 };
        const { step, filter } = this.state;
        this.setState({ loading: true });
        axius.get('users', { ...filter, company: this.props.uuid, type: types[this.props.params.type], limit: `${step},${limit}` }).then(res => {
            this.setState({ loading: false });
            if (res.status === 200) {
                this.setState({ data: res.data, total: res.count });
            } else {
                this.setState({ data: [], total: 0 });
            }
        });
    }

    nextPrev = (e) => {
        this.setState({ currentStep: e, step: (e - 1) * limit, edited: 0 }, () => {
            this.getData();
        });
    }

    addUser = () => {
        const { v } = this.state;
        if (v.user) {
            func.loading('please wait...').then(loading => {
                axius.get('users', { email: v.user, limit: 1, type: 0 }).then(res => {
                    if (res.status === 200) {
                        axius.put(`users/${res.data[0].uuid}`, { company: this.props.uuid, type: 1 }).then(res => {
                            loading.destroy();
                            if (res.status === 200) {
                                this.setState({ addUser: false, v: {} });
                                this.getData();
                                notification.success({ message: 'User added' });
                            } else {
                                if (res.status === 412) {
                                    func.alert({ title: 'Failed', content: res.data.join('<br />') });
                                } else {
                                    func.alert({ title: 'Failed', content: res.message, });
                                }
                            }
                        });
                    } else {
                        loading.destroy();
                        func.alert({ title: 'Failed', content: 'User not found or already assigned to a company', });
                    }
                });
            });
        }
    }

    removeRider = (e) => {
        func.alert({
            title: `Remove user?`,
            content: `Remove ${e.name} from ${this.props.comp.name}?`,
            okText: 'Yes, Remove',
            okButtonProps: { type: 'danger' },
            cancelText: 'Cancel',
            cancelButtonProps: { className: 'show', type: 'clear' },
            onOk: () => {
                func.loading('please wait...').then(loading => {
                    axius.put(`users/${e.uuid}`, { company: '', type: 0 }).then(res => {
                        loading.destroy();
                        if (res.status === 200) {
                            this.setState({ data: this.state.data.filter(row => row.uuid !== e.uuid) });
                            notification.success({ message: 'User removed' });
                        } else {
                            if (res.status === 412) {
                                func.alert({ title: 'Failed', content: res.data.join('<br />') });
                            } else {
                                func.alert({ title: 'Failed', content: res.message, });
                            }
                        }
                    });
                });
            }
        });
    }

    render() {
        let i = this.state.step + 1;
        const { _auth: { logg } } = this.props;
        const { loading, total, currentStep, data } = this.state;

        return (
            <React.Fragment>
                <div className="card shadow mb-4">
                    <div className="card-body">
                        <div className="row">
                            <div className="col-3">
                                {/* <Select size="default" showSearch value={filter.status} onChange={status => this.setState({ filter: { ...filter, status } }, () => { this.getData() })}>
                                    <Select.Option value="">All status</Select.Option>
                                    {settings.order_status.map((s, i) => (
                                        <Select.Option key={s} value={i}>{s}</Select.Option>
                                    ))}
                                </Select> */}
                                <span className="btn btn-dark btn-sm pointer hover-scales" onClick={() => this.setState({ addUser: true })}>
                                    <i className="fa fa-plus"></i> Add user
                                </span>
                            </div>
                            <div className="col-9 text-right">
                                <span className="btn btn-clear btn-sm pointer hover-scales" onClick={() => this.props.setPage('index')}>
                                    <i className="fa fa-chevron-left"></i> Go back
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="card shadow mb-4">
                    <div className="card-header py-3">
                        <h6 className="m-0 font-weight-bold text-primary float-left">Users</h6>
                        <div className="clearfix"></div>
                    </div>

                    <div className="card-body">
                        <div className="table-responsive">
                            <table className="table table-hover table-">
                                <thead>
                                    <tr>
                                        <th colSpan={2}>#</th>
                                        <th>Name</th>
                                        <th>Phone no.</th>
                                        <th>Email</th>
                                        {/* <th>Status</th> */}
                                        <th>Date</th>
                                        <th>#</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {loading && (
                                        <tr>
                                            <td colSpan="15" align="center">...loading</td>
                                        </tr>
                                    )}

                                    {!loading && data.length === 0 && (
                                        <tr>
                                            <td colSpan="15" align="center">No records found</td>
                                        </tr>
                                    )}

                                    {!loading && data.map(row => (
                                        <tr key={row.uuid}>
                                            <td>{i++}</td>
                                            <td>
                                                <img src={row.avatar_link} alt={row.name} onError={func.imgError} className="img-circle img-thumbnail" width="50" />
                                            </td>
                                            <td>{row.name}</td>
                                            <td>{row.phone}</td>
                                            <td>{row.email}</td>
                                            {/* <td dangerouslySetInnerHTML={{ __html: row.address.join('<br />') }}></td> */}
                                            <td>{moment(row.crdate).format('LLL')}</td>
                                            <td align="right">
                                                {data.length > 1 && data[0].uuid !== logg.uuid && (
                                                    <div className="btn btn-danger btn-sm" onClick={() => this.removeRider(row)}>
                                                        Remove
                                                    </div>
                                                )}
                                                <div className="btn btn-primary btn-sm mr-1" onClick={() => this.setState({ row })}>
                                                    Edit
                                                </div>
                                                <div className="btn btn-primary btn-sm" onClick={() => this.setState({ row, formType: 'reset' })}>
                                                    Reset
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {!loading && total > limit && (
                        <div className="pd-10 mg-b-20">
                            <Pagination total={total} pageSize={limit} current={currentStep} onChange={(e) => this.nextPrev(e)} />
                        </div>
                    )}
                </div>

                <Modal visible={this.state.addUser} title="Add user" maskClosable={false} centered footer={null} onCancel={() => this.setState({ addUser: false })}>
                    <Input size="large" placeholder="Enter user email address" onChange={e => this.setState({ v: { ...this.state.v, user: e.target.value } })} />
                    <div>&nbsp;</div>
                    <div className="text-right">
                        <span className="btn btn-primary btn-sm pointer hover-scales" onClick={() => this.addUser()}>
                            Save
                        </span>
                    </div>
                </Modal>

                <UsersForm
                    {...this.props}
                    formType={this.state.formType}
                    row={this.state.row}
                    visible={this.state.row.id ? true : false}
                    onCancel={() => this.setState({ row: {} })}
                    onSuccess={(m, d) => {
                        if (m === 'post') {
                            data.unshift(d);
                            this.setState({ data });
                        } else {
                            let i = data.indexOf(data.find(row => row.uuid === d.uuid));
                            data[i] = d;
                            this.setState({ data, edited: d.uuid });
                        }
                    }}
                />
            </React.Fragment>
        );
    }
}


export default CompaniesUsers;