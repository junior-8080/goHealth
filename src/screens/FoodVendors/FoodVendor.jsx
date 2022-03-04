import { Input, Pagination, Select } from 'antd';
import moment from 'moment';
import React from 'react';
import { Link } from 'react-router-dom';
import { axius, func } from '../../utils';

import FoodVendorForm from './FoodVendorForm';

const limit = 25;
const rowStatus = [<label className="badge badge-info">Pending</label>, <label className="badge badge-success">Active</label>,];

class Companies extends React.Component {

    state = {
        loading: true, data: [], useForm: false, filter: { status: '', name: '' },
        step: 0, currentStep: 1, total: 0, edited: '',
    };

    componentDidMount() {
        this.getData();
    }

    getData = () => {
        const { step, filter } = this.state;
        this.setState({ loading: true });
        axius.get('users', { ...this.props.params, ...filter, limit: `${step},${limit}` }).then(res => {
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
        const { loading, total, currentStep, data, useForm, filter } = this.state;

        return (
            <React.Fragment>
                <div className="card shadow mb-4">
                    <div className="card-header py-3">
                        <h6 className="m-0 font-weight-bold text-primary float-left text-capitalize">{this.props.path}</h6>
                        <div className="float-right">
                            <span className="btn btn-primary btn-sm btn-blocks" onClick={() => this.setState({ useForm: true })}>
                                <i className="fa fa-plus"></i> Add Vendor
                            </span>
                        </div>
                        <div className="clearfix"></div>
                    </div>

                    <div className="card-body">
                        <div className="jumbotron">
                            <div className="row">
                                <div className="col-2">
                                    <Select value={filter.status} onChange={status => this.setState({ filter: { ...this.state.filter, status } })}>
                                        <Select.Option value="">All status</Select.Option>
                                        <Select.Option value={1}>Active</Select.Option>
                                        <Select.Option value={0}>Pending</Select.Option>
                                    </Select>
                                </div>
                                <div className="col-2">
                                    <Input placeholder="Name" value={filter.name} onChange={e => this.setState({ filter: { ...this.state.filter, name: e.target.value } })} />
                                </div>
                                <div className="col-2">
                                    <span className="btn btn-primary btn-sm btn-blocks" onClick={() => this.getData()}>
                                        Filter
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className="table-responsive">
                            <table className="table table-striped table-">
                                <thead>
                                    <tr>
                                        <th colSpan="2">#</th>
                                        <th>Vendor Name</th>
                                        <th>Contact details</th>
                                        <th>Status</th>
                                        <th>Date</th>
                                        <th>#</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {loading && (
                                        <tr>
                                            <td colSpan="15" align="center">loading...</td>
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
                                                <img src={row.logo_link} alt={row.name} onError={func.imgError} className="img-circles img-thumbnail" width="80" />
                                            </td>
                                            <td>{row.name}</td>
                                            <td>
                                                Email: {row.email} <br />
                                                Phone No.: {row.phone} <br />
                                            </td>
                                            <td>{rowStatus[row.status]}</td>
                                            <td>{moment(row.crdate).format('LLL')}</td>
                                            <td>
                                                <Link to={`${this.props.path}/${row.uuid}`} className="btn btn-primary btn-sm btn-blocks">
                                                    Manage
                                                </Link>
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

                    <FoodVendorForm
                        {...this.props}
                        row={{}}
                        visible={useForm}
                        onCancel={() => this.setState({ useForm: false })}
                        onSuccess={(m, d) => {
                            data.unshift(d);
                            this.setState({ data });
                        }}
                    />
                </div>
            </React.Fragment>
        );
    }
}


export default Companies;