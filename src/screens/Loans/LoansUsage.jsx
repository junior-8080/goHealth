import { notification, Pagination, Select } from 'antd';
import React from 'react';
import { axius, func } from '../../utils';

import OrdersDetails from '../Pharmacies/OrdersDetails';

const limit = 12;
const rowStatus = [<label className="badge badge-info">Unpaid</label>, <label className="badge badge-success">Paid</label>,];

class LoansUsage extends React.Component {

    state = {
        loading: true,
        data: [], riders: [], order: { id: 0 }, company: '', filter: { status: 0 }, formType: '',
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
        axius.get('loans/orders', { ...filter, limit: `${step},${limit}` }).then(res => {
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
        func.alert({
            title: `Mark as paid?`,
            // content: `Remove ${e.name} from ${this.props.comp.name}?`,
            okText: `Yes, Continue`,
            okButtonProps: { type: 'primary' },
            cancelText: 'Cancel',
            cancelButtonProps: { className: 'show', type: 'clear' },
            onOk: () => {
                func.loading('please wait...').then(loading => {
                    axius.put(`loans/orders/${e.uuid}`, { status: s }).then(res => {
                        loading.destroy();
                        if (res.status === 200) {
                            this.setState({ data: this.state.data.filter(row => row.uuid !== e.uuid) });
                            notification.success({ message: `Loan marked as paid` });
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
        const { loading, total, currentStep, data, filter, order } = this.state;

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
                                    {/* <Select.Option value="">All status</Select.Option> */}
                                    <Select.Option value={0}>Unpaid</Select.Option>
                                    <Select.Option value={1}>Paid</Select.Option>
                                </Select>
                            </div>
                            <div className="col-lg-9 text-right">

                            </div>
                        </div>
                    </div>
                </div>

                <div className="card shadow mb-4">
                    <div className="card-header py-3">
                        <h6 className="m-0 font-weight-bold text-primary float-left">Loans Usage</h6>
                        <div className="clearfix"></div>
                    </div>

                    <div className="card-body">
                        <div className="table-responsive">
                            <table className="table table-hover table-">
                                <thead>
                                    <tr>
                                        <th>#</th>
                                        <th colSpan={2}>Company</th>
                                        <th>Loan taken</th>
                                        <th>Amount used</th>
                                        <th>Amount left</th>
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
                                                <img src={row.loan.company.logo_link} alt={row.loan.company.name} onError={func.imgError} className="img-circle img-thumbnail" width="50" />
                                            </td>
                                            <td>{row.loan.company.name}</td>
                                            <td>₦{func.numberFormat(row.loan.amount)}</td>
                                            <td><label className="badge badge-warning" style={{ fontSize: 16 }}>₦{func.numberFormat(row.amount)}</label></td>
                                            <td>₦{func.numberFormat(row.loan.amount_refund)}</td>
                                            <td>{rowStatus[row.status]}</td>
                                            <td align="right">
                                                {row.status === 0 && (
                                                    <div>
                                                        <div className="btn btn-primary btn-sm mr-1" onClick={() => this.setState({ order: row.order, company: row.loan.company.uuid })}>
                                                            View order
                                                        </div>
                                                        <div className="btn btn-primary btn-sm mr-1" onClick={() => this.appReject(row, 1)}>
                                                            Market as paid
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

                    <OrdersDetails
                        {...this.props}
                        row={order}
                        company={'total'}
                        onCancel={() => {
                            this.setState({ order: {} });
                        }}
                    />
                </div>
            </React.Fragment>
        );
    }
}


export default LoansUsage;