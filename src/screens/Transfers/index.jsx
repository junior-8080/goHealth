import { notification, Pagination, Select } from 'antd';
import moment from 'moment';
import React from 'react';
import { axius, func } from '../../utils';

const limit = 12;

class Transfers extends React.Component {

    state = {
        loading: true,
        data: [], riders: [], row: { id: 0 }, filter: { status: 0, }, formType: '',
        step: 0, currentStep: 1, total: 0, edited: '', type: this.props.type,
    };

    componentDidMount() {
        this.getData();
    }

    componentWillUpdate(prevProps, props) {
        if (prevProps.type !== props.type) {
            this.getData();
        }
    }

    getData = () => {
        const { step, filter } = this.state;
        this.setState({ loading: true });
        axius.get('transfers', { ...filter, limit: `${step},${limit}` }).then(res => {
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

    appReject = (e, s) => {
        var status = { 1: 'Approve', 2: 'Reject' };
        func.alert({
            title: `${status[s]} transfer?`,
            // content: `Remove ${e.name} from ${this.props.comp.name}?`,
            okText: `Yes, ${status[s]}`,
            okButtonProps: { type: 'dangers' },
            cancelText: 'Cancel',
            cancelButtonProps: { className: 'show', type: 'clear' },
            onOk: () => {
                func.loading('please wait...').then(loading => {
                    axius.put(`transfers/${e.uuid}`, { status: s }).then(res => {
                        loading.destroy();
                        if (res.status === 200) {
                            this.setState({ data: this.state.data.filter(row => row.uuid !== e.uuid) });
                            notification.success({ message: `Transfer ${status[s]}d` });
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
        const { loading, total, currentStep, data, filter } = this.state;

        return (
            <React.Fragment>
                <div className="card shadow mb-4">
                    <div className="card-body">
                        <div className="row">
                            <div className="col-lg-1">
                                <Select
                                    value={filter.status}
                                    onChange={status => this.setState({ filter: { ...this.state.filter, status } }, () => {
                                        this.getData();
                                    })
                                    }>
                                    <Select.Option value="">All status</Select.Option>
                                    <Select.Option value={0}>Pending</Select.Option>
                                    <Select.Option value={1}>Approved</Select.Option>
                                    <Select.Option value={2}>Rejected</Select.Option>
                                </Select>
                            </div>
                            <div className="col-lg-9 text-right">

                            </div>
                        </div>
                    </div>
                </div>

                <div className="card shadow mb-4">
                    <div className="card-header py-3">
                        <h6 className="m-0 font-weight-bold text-primary float-left">
                            Bank transfers
                        </h6>
                        <div className="clearfix"></div>
                    </div>

                    <div className="card-body">
                        <div className="table-responsive">
                            <table className="table table-hover table-">
                                <thead>
                                    <tr>
                                        <th>#</th>
                                        <th colSpan={2}>Company</th>
                                        <th>Processed by</th>
                                        <th>Bank Details</th>
                                        <th>Amount</th>
                                        <th>Date</th>
                                        <th>Status</th>
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
                                                <img src={row.company.logo_link} alt={row.company.name} onError={func.imgError} className="img-circle img-thumbnail" width="50" />
                                            </td>
                                            <td>{row.company.name}</td>
                                            <td>{row.user.name}</td>
                                            <td>
                                                <div>- Bank holder name: <b>{row.bank.holder}</b></div>
                                                <div>- Bank name: <b>{row.bank.name}</b></div>
                                                <div>- Bank number: <b>{row.bank.number}</b></div>
                                            </td>
                                            <td>₦{func.numberFormat(row.amount)}</td>
                                            <td>{moment(row.crdate).format('LLL')}</td>
                                            <td>
                                                {row.status === 0 ? 'Pending' : ''}
                                                {row.status === 1 ? 'Approved' : ''}
                                                {row.status === 2 ? 'Rejected' : ''}
                                            </td>
                                            <td align="right">
                                                {row.status === 0 && (
                                                    <div>
                                                        <div className="btn btn-success btn-sm mr-1" onClick={() => this.appReject(row, 1)}>
                                                            Approve
                                                            </div>
                                                        <div className="btn btn-danger btn-sm mr-1" onClick={() => this.appReject(row, 2)}>
                                                            Reject
                                                        </div>
                                                    </div>
                                                )}
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
            </React.Fragment>
        );
    }
}


export default Transfers;