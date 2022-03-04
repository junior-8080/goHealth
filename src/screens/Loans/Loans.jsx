import { notification, Pagination, Select } from 'antd';
import moment from 'moment';
import React from 'react';
import { axius, func } from '../../utils';

const limit = 12;

class Loans extends React.Component {

    state = {
        loading: true,
        data: [], riders: [], row: { id: 0 }, filter: { status: 0 }, formType: '',
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
        axius.get('loans', { ...filter, limit: `${step},${limit}` }).then(res => {
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
            title: `${status[s]} loan?`,
            // content: `Remove ${e.name} from ${this.props.comp.name}?`,
            okText: `Yes, ${status[s]}`,
            okButtonProps: { type: 'dangers' },
            cancelText: 'Cancel',
            cancelButtonProps: { className: 'show', type: 'clear' },
            onOk: () => {
                func.loading('please wait...').then(loading => {
                    axius.put(`loans/${e.uuid}`, { status: s }).then(res => {
                        loading.destroy();
                        if (res.status === 200) {
                            this.setState({ data: this.state.data.filter(row => row.uuid !== e.uuid) });
                            notification.success({ message: `Loan ${status[s]}d` });
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
                                    })}
                                >
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
                            Loans
                        </h6>
                        <div className="clearfix"></div>
                    </div>

                    <div className="card-body">
                        <div className="table-responsive">
                            <table className="table table-hover table-">
                                <thead>
                                    <tr>
                                        <th>#</th>
                                        <th colSpan={2}>User</th>
                                        <th>Pharmacy</th>
                                        <th>NOK</th>
                                        <th>Bank Details</th>
                                        <th>Sales Details</th>
                                        <th>Amount / Period</th>
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
                                                <img src={row.user.avatar_link} alt={row.user.name} onError={func.imgError} className="img-circle img-thumbnail" width="50" />
                                            </td>
                                            <td>{row.user.name}</td>
                                            <td>{row.company.name}</td>
                                            <td>
                                                <div>- Name: <b>{row.nok.name}</b></div>
                                                <div>- Phone no: <b>{row.nok.phone}</b></div>
                                                <div>- Address: <b>{row.nok.address}</b></div>
                                            </td>
                                            <td>
                                                <div>- Bank acount no.: <b>{row.bank.number}</b></div>
                                                <div>- BVN number: <b>{row.bank.bvn}</b></div>
                                                <div>- NIN number: <b>{row.bank.nin}</b></div>
                                            </td>
                                            <td>
                                                <div>- Average monthly sales: <b>₦{func.numberFormat(row.sales.sales)}</b></div>
                                                <div>- Average monthly profit: <b>₦{func.numberFormat(row.sales.profit)}</b></div>
                                                <div>- Average monthly drug purchase: <b>₦{func.numberFormat(row.sales.purchase)}</b></div>
                                                <div>- Number of staff: <b>{row.sales.staff}</b></div>
                                            </td>
                                            <td>₦{func.numberFormat(row.amount)} / {row.period} month{row.period > 1 ? 's' : ''}</td>
                                            <td>{moment(row.crdate).format('LLL')}</td>
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


export default Loans;