import { Pagination, Select } from 'antd';
import moment from 'moment';
import React from 'react';
import { axius, func } from '../../utils';
import OrdersDetails from './OrdersDetails';

const limit = 12;
// const rowStatus = [<label className="badge badge-info">Inactive</label>, <label className="badge badge-success">Active</label>,];

class CompaniesOrders extends React.Component {

    state = {
        loading: true, data: [], row: {}, filter: { status: '' },
        step: 0, currentStep: 1, total: 0, edited: '',
    };

    componentDidMount() {
        this.getData();
    }

    getData = () => {
        const { step, filter } = this.state;
        this.setState({ loading: true });
        axius.get('orders', { ...filter, company: this.props.uuid, limit: `${step},${limit}` }).then(res => {
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

    render() {
        let i = this.state.step + 1;
        const { _data: { settings } } = this.props;
        const { loading, total, currentStep, data, filter, row } = this.state;

        return (
            <React.Fragment>
                <div className="card shadow mb-4">
                    <div className="card-body">
                        <div className="row">
                            <div className="col-3">
                                <Select size="default" showSearch value={filter.status} onChange={status => this.setState({ filter: { ...filter, status } }, () => { this.getData() })}>
                                    <Select.Option value="">All status</Select.Option>
                                    {this.props.orderStatus.map((s) => (
                                        <Select.Option key={s.name} value={s.name}>{s.label}</Select.Option>
                                    ))}
                                </Select>
                            </div>
                            <div className="col-9 text-right">
                                {this.props.uuid && (
                                    <span className="btn btn-clear btn-sm pointer hover-scales" onClick={() => this.props.setPage('index')}>
                                        <i className="fa fa-chevron-left"></i> Go back
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="card shadow mb-4">
                    <div className="card-header py-3">
                        <h6 className="m-0 font-weight-bold text-primary float-left">Food Orders</h6>
                        <div className="clearfix"></div>
                    </div>

                    <div className="card-body">
                        <div className="table-responsive">
                            <table className="table table-hover table-">
                                <thead>
                                    <tr>
                                        <th>#</th>
                                        <th>Order no.</th>
                                        <th>Customer</th>
                                        <th>Food Item</th>
                                        <th>Amount</th>
                                        <th>Status</th>
                                        <th>Date</th>
                                        <th>Action</th>
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
                                            <td>#{row.id}</td>
                                            <td>{row.buyer.name}</td>
                                            <td>₦{func.numberFormat(row.cart[this.props.uuid || 'total'].total, 2)}</td>
                                            <td><b>{settings.order_status.find(sta => sta.id === row.status).name}</b></td>
                                            <td>{moment(row.crdate).format('LLL')}</td>
                                            <td>
                                                <div className="btn btn-primary btn-sm" onClick={() => this.setState({ row })}>
                                                    Details
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

                    <OrdersDetails
                        {...this.props}
                        row={row}
                        company={this.props.uuid}
                        onCancel={() => {
                            this.setState({ row: {} });
                        }}
                    />
                </div>
            </React.Fragment>
        );
    }
}


export default CompaniesOrders;