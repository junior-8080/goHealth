import React, { Component } from 'react';
import { Select, Pagination, Modal, notification, Button } from 'antd';
import moment from 'moment';
import { axius, func } from '../../utils';
import NotificationsForm from './NotificationsForm';

const limit = 12;
const rowStatus = [['warning', 'Pending'], ['success', 'Processed']];

class UsersNotifications extends Component {

    state = {
        loading: false,
        data: [], row: {}, pathname: '', edited: 0,
        filter: { status: '', },
        step: 0, currentStep: 1, total: 0,
    }

    componentDidMount() {
        this.setPage();
    }

    setPage() {
        this.props.setPageTitle('User notifications');
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
        axius.get('notifications', { ...filter, limit: `${step},${limit}`, }).then(res => {
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

    deleteRow = (row) => {
        const { uuid } = row;
        Modal.confirm({
            centered: true,
            title: 'Are you sure?',
            content: 'Action is not reversible. Continue?',
            okText: `Yes, Delete`,
            okButtonProps: { type: 'danger' },
            onOk: () => {
                func.loading('please wait...').then(loading => {
                    axius.delte(`notifications/${row.uuid}`).then((res) => {
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
                <div className="row">
                    <div className="col-lg-4">
                        <div className="card">
                            <div className="card-body">
                                <NotificationsForm
                                    {...this.props}
                                    onOK={() => {
                                        this.getData();
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-8">
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
                                                <th>Message</th>
                                                <th>Preferences</th>
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
                                                        <td>[{row.subject}]: {row.message}</td>
                                                        <td>
                                                            <div>Users: {row.preferences.users.join(', ')}</div>
                                                            <div>Channels: {row.preferences.channels.join(', ')}</div>
                                                        </td>
                                                        <td><label className={`badge badge-${rowStatus[row.status][0]}`}>{rowStatus[row.status][1]}</label></td>
                                                        <td>{moment(row.crdate).format('LLL')}</td>
                                                        <td align="right">
                                                            <Button type="danger" size="small" onClick={() => this.deleteRow(row)}><i className="fa fa-trash"></i></Button>
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
                    </div>
                </div>
            </React.Fragment>
        );
    }
}

export default UsersNotifications;