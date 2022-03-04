import React, { Component } from 'react';
import { Button, Input, Select, Pagination, Modal, notification, Dropdown, Menu } from 'antd';
import moment from 'moment';

import AccessForm from './AccessForm';
import { axius, func } from '../../utils';

const limit = 12;
const rowStatus = [['warning', 'Not active'], ['success', 'Active'], ['danger', 'Deleted']];

class UsersAccess extends Component {

    state = {
        loading: false, formModal: false,
        data: [], row: {}, pathname: '', edited: 0,
        filter: { status: '', name: '' },
        step: 0, currentStep: 1, total: 0,
    }

    componentDidMount() {
        this.setPage();
    }

    setPage() {
        this.props.setPageTitle('Admin permissions');
        this.getData();
    }

    filter = () => {
        this.setState({ step: 0, currentStep: 1, edited: 0 }, () => {
            this.getData();
        });
    }
    getData = () => {
        this.setState({ loading: true, total: 0 });
        const { filter, step } = this.state;
        axius.get('users-access', { ...filter, name: `%${filter.name}%`, limit: `${step},${limit}`, }).then(res => {
            this.setState({ loading: false });
            if (res.status === 200) {
                this.setState({ data: res.data, total: res.count });
            } else {
                this.setState({ data: [] });
            }
        });
    }

    formChange = (e, name) => {
        name = name || e.target.name;
        let value = e.target ? e.target.value : e;
        this.setState({ [name]: value });
    }
    nextPrev = (e) => {
        this.setState({ currentStep: e, step: (e - 1) * limit, edited: 0 }, () => {
            this.getData();
        });
    }

    delete = (row) => {
        const { uuid } = row;
        Modal.confirm({
            centered: true,
            title: 'Are you sure?',
            content: 'Action is not reversible. Continue?',
            okText: `Yes, Delete`,
            okButtonProps: { type: 'danger' },
            onOk: () => {
                func.loading('please wait...').then(loading => {
                    axius.delte(`users-access/${row.uuid}`).then((res) => {
                        loading.destroy();
                        if (res.status === 200) {
                            this.setState({ data: this.state.data.filter(row => row.uuid !== uuid) });
                            notification.success({ message: res.message });
                        } else {
                            notification.error({ message: res.message });
                        }
                    });
                });
            }
        });
    }

    render() {
        let i = this.state.step + 1;
        const { loading, data, total, currentStep, edited, filter } = this.state;

        return (
            <React.Fragment>
                <div className="card" style={{ marginBottom: 20 }}>
                    <div className="card-body">
                        <div className="row row-xs">
                            <div className="col-2">
                                <Select
                                    style={{ width: '100%' }} placeholder="Status" value={filter.status} disabled={loading}
                                    onChange={status => this.setState({ filter: { ...filter, status } })}
                                >
                                    <Select.Option value="">All status</Select.Option>
                                    <Select.Option value={1}>Active</Select.Option>
                                    <Select.Option value={0}>Inactive</Select.Option>
                                </Select>
                            </div>
                            <div className="col-3">
                                <Input
                                    placeholder="Search by name" disabled={loading} onPressEnter={this.filter}
                                    onChange={e => this.setState({ filter: { ...filter, name: e.target.value } })}
                                />
                            </div>
                            <div className="col-2">
                                <Button type="primary" size="middle" onClick={() => this.getData()}>
                                    <i className="fa fa-check"></i>
                                </Button> &nbsp;
                                <Button
                                    type="warning" size="middle"
                                    onClick={() => this.setState({
                                        filter: { name: '', status: '', }, step: 0, currentStep: 1, total: 0, edited: '',
                                    }, () => { this.getData(); })}
                                >
                                    <i className="mdi mdi-sync"></i> &nbsp; Reset
                                </Button>
                            </div>
                            <div className="col-5 text-right">
                                {func.hasR('usr_acc_add') && (
                                    <span className="btn btn-primary btn-sm pointer hover-scales" onClick={() => this.setState({ row: {}, formModal: true })}>
                                        <i className="fa fa-plus"></i> &nbsp; Add new
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="card">
                    <div className="card-body">
                        <div className="table-responsive">
                            <table className="table card-table table-stripeds table-hover mb-0">
                                <thead className="thead-light">
                                    <tr>
                                        <th>#</th>
                                        <th>Name</th>
                                        <th>Status</th>
                                        <th>Created</th>
                                        <th>#</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {loading === true && (<tr><td align="center" colSpan="15"><i className="fa fa-spin fa-spinner"></i> loading...</td></tr>)}
                                    {loading === false && data.length === 0 && (<tr><td align="center" colSpan="15">No records found</td></tr>)}

                                    {loading === false && (
                                        data.map((row) => (
                                            <tr key={row.uuid} className={edited === row.uuid ? 'animated shake bg-gray-100' : ''}>
                                                <td>{i++}</td>
                                                <td>{row.name}</td>
                                                <td><label className={`badge badge-${rowStatus[row.status][0]}`}>{rowStatus[row.status][1]}</label></td>
                                                <td>{moment(row.crdate).format('LLL')}</td>
                                                <td align="right">
                                                    {row.uuid !== 'super' && (
                                                        <Dropdown trigger={['click']} placement="bottomCenter" arrow
                                                            overlay={
                                                                <Menu>
                                                                    {(row.status !== 2 && func.hasR('usr_acc_upd')) && (
                                                                        <Menu.Item onClick={() => this.setState({ row, formModal: true })}>
                                                                            <div className="row">
                                                                                <div className="col-2">
                                                                                    <i className="fa fa-edit text-muted" />
                                                                                </div>
                                                                                <div className="col-8">
                                                                                    Edit
                                                                                </div>
                                                                            </div>
                                                                        </Menu.Item>
                                                                    )}
                                                                    {func.hasR('usr_acc_del') && (
                                                                        <Menu.Item onClick={() => this.delete(row)}>
                                                                            <div className="row">
                                                                                <div className="col-2">
                                                                                    <i className="fa fa-times text-muted" />
                                                                                </div>
                                                                                <div className="col-8">
                                                                                    Delete
                                                                                </div>
                                                                            </div>
                                                                        </Menu.Item>
                                                                    )}
                                                                </Menu>
                                                            }>
                                                            <Button type="ghost" shape="circle" icon={<i className="fas fa-ellipsis-h" />} />
                                                        </Dropdown>
                                                    )}
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                            {!loading && total > limit && (<Pagination total={total} pageSize={limit} current={currentStep} onChange={(e) => this.nextPrev(e)} />)}
                        </div>
                    </div>
                </div>

                <AccessForm
                    {...this.props}
                    row={this.state.row}
                    visible={this.state.formModal}
                    onCancel={() => this.setState({ row: {}, formModal: false })}
                    onOK={(a, e) => {
                        this.setState({ edited: 0 });
                        setTimeout(() => {
                            if (a === 'put') {
                                let i = data.indexOf(data.filter(row => row.uuid === e.uuid)[0]);
                                data[i] = e;
                                this.setState({ data, edited: e.uuid });
                            } else {
                                data.unshift(e);
                                this.setState({ data, edited: e.uuid });
                            }
                        }, 200);
                    }}
                />
            </React.Fragment>
        );
    }
}

export default UsersAccess;