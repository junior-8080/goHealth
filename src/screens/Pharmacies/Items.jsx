import React from 'react';
import { notification, Modal, Pagination, Select, Input, Spin } from 'antd';
import { FormattedNumber } from 'react-intl';
import { axius, func, } from '../../utils';

import ItemsForm from './ItemsForm';

const limit = 15;
const rowStatus = [<label className="badge badge-info">Inactive</label>, <label className="badge badge-success">Active</label>,];

class CompaniesItems extends React.Component {

    state = {
        loading: true, data: [], categories: [], row: {}, filter: { status: '', name: '', orderby: 'crdate_desc', category: '', }, useForm: false,
        step: 0, currentStep: 1, total: 0, edited: '', checked: [],
    };

    componentDidMount() {
        this.getData();
        this.getCategories();
    }

    getCategories() {
        axius.get('items-categories', { status: 1 }).then(res => {
            this.setState({ categories: res.status === 200 ? res.data : [] });
        });
    }

    nextPrev = (e) => {
        this.setState({ currentStep: e, step: (e - 1) * limit, edited: 0 }, () => {
            this.getData();
        });
    }

    getData = () => {
        const { step, filter } = this.state;
        this.setState({ loading: true });
        window.scrollTo({ top: 100, behavior: 'smooth' });
        axius.get('items', { ...filter, company: this.props.uuid, limit: `${step},${limit}` }).then(res => {
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

    deleteItem = (e) => {
        Modal.confirm({
            title: 'Delete item?',
            content: `Are you sure youw ant to delete: ${e.name}?`,
            okText: 'Yes, Delete',
            onOk: () => {
                func.loading('deleting item...').then(loading => {
                    axius.delte(`items/${e.uuid}`).then(res => {
                        loading.destroy();
                        if (res.status === 200) {
                            this.setState({ data: this.state.data.filter(row => row.uuid !== e.uuid) });
                            notification.success({ message: res.message });
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
        let { loading, data, useForm, total, currentStep, filter, categories } = this.state;

        return (
            <React.Fragment>
                <div className="card shadow mb-4">
                    <div className="card-body">
                        <div className="row">
                            <div className="col-3">
                                <span className="btn btn-dark btn-sm btn-blocks" onClick={() => this.setState({ useForm: true, row: {} })}>
                                    <i className="fa fa-plus"></i> Add item
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

                <div className="row">
                    <div className="col-12">
                        <div className="card shadow mb-4">
                            <div className="card-header py-3">
                                <h6 className="m-0 font-weight-bold text-primary float-left">Items</h6>
                                <div className="float-right"></div>
                                <div className="clearfix"></div>
                            </div>
                            <div className="card-body">
                                <div className="jumbotron">
                                    <div className="row">
                                        <div className="col-2">
                                            <Select value={filter.status} onChange={status => this.setState({ filter: { ...this.state.filter, status } })}>
                                                <Select.Option value="">All status</Select.Option>
                                                <Select.Option value={1}>Active</Select.Option>
                                                <Select.Option value={0}>Inactive</Select.Option>
                                            </Select>
                                        </div>
                                        <div className="col-2">
                                            <Select value={filter.orderby} onChange={orderby => this.setState({ filter: { ...this.state.filter, orderby } })}>
                                                <Select.Option value="crdate_desc">Date desc</Select.Option>
                                                <Select.Option value="crdate_asc">Date asc</Select.Option>
                                                <Select.Option value="price_desc">Price desc</Select.Option>
                                                <Select.Option value="price_asc">Price asc</Select.Option>
                                                <Select.Option value="quantity_desc">Quantity desc</Select.Option>
                                                <Select.Option value="quantity_asc">Quantity asc</Select.Option>
                                            </Select>
                                        </div>
                                        <div className="col-3">
                                            <Select value={filter.category} showSearch optionFilterProp="children" onChange={category => this.setState({ filter: { ...this.state.filter, category } })}>
                                                <Select.Option value="">All categories</Select.Option>
                                                {categories.map(ctg => (
                                                    <Select.Option key={ctg.uuid} value={ctg.uuid}>{ctg.name}</Select.Option>
                                                ))}
                                            </Select>
                                        </div>
                                        <div className="col-3">
                                            <Input placeholder="Name" value={filter.name} onChange={e => this.setState({ filter: { ...this.state.filter, name: e.target.value } })} />
                                        </div>
                                        <div className="col-2">
                                            <div className="btn btn-primary btn-sm btn-blocks" onClick={() => this.getData()}>
                                                Filter
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="table-responsive">
                                    <Spin spinning={loading && data.length > 0 ? true : false}>
                                        <table className="table table-striped table-">
                                            <thead>
                                                <tr>
                                                    <th colSpan={2}>
                                                        #
                                                        {/* <Checkbox checked={checked.length === data.length}
                                                            onChange={() => {
                                                                if (checked.length === data.length) {
                                                                    this.setState({ checked: [] });
                                                                } else {
                                                                    this.setState({ checked: data.map(m => { return m.uuid; }) });
                                                                }
                                                            }}
                                                        /> */}
                                                    </th>
                                                    <th>Name</th>
                                                    <th>Price</th>
                                                    <th>Quantity</th>
                                                    <th>Status</th>
                                                    <th>#</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {loading && data.length === 0 && (
                                                    <tr>
                                                        <td colSpan="15" align="center">loading...</td>
                                                    </tr>
                                                )}

                                                {!loading && data.length === 0 && (
                                                    <tr>
                                                        <td colSpan="15" align="center">No records found</td>
                                                    </tr>
                                                )}
                                                {(!loading || data.length > 0) && data.map(row => (
                                                    <tr key={row.uuid}>
                                                        <td>
                                                            {/* <Checkbox
                                                                checked={checked.includes(row.uuid)}
                                                                onChange={() => {
                                                                    var c = checked;
                                                                    if (c.includes(row.uuid)) {
                                                                        c = c.filter(cf => cf !== row.uuid);
                                                                    } else {
                                                                        c = c.concat(row.uuid);
                                                                    }
                                                                    c = JSON.parse(JSON.stringify(c));
                                                                    this.setState({ checked: c });
                                                                }}
                                                            /> */}
                                                        </td>
                                                        <td>
                                                            <img src={row.images_links[0]} alt={row.name} onError={func.imgError} className="img-circles img-thumbnail" width="60" />
                                                        </td>
                                                        <td>{i++}. {row.name}</td>
                                                        <td>₦<FormattedNumber value={row.price} /></td>
                                                        <td><FormattedNumber value={row.quantity} /></td>
                                                        <td>{rowStatus[row.status]}</td>
                                                        <td align="right">
                                                            <div className="btn btn-primary btn-sm mr-1" onClick={() => this.setState({ useForm: true, row })}>
                                                                Edit
                                                            </div>
                                                            <div className="btn btn-danger btn-sm" onClick={() => this.deleteItem(row)}>
                                                                Delete
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </Spin>
                                </div>

                                {total > limit && (
                                    <div className="pd-10 mg-b-20">
                                        <Pagination total={total} pageSize={limit} current={currentStep} showSizeChanger={false} onChange={(e) => this.nextPrev(e)} />
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                <ItemsForm
                    {...this.props}
                    row={this.state.row}
                    visible={useForm}
                    onCancel={() => this.setState({ useForm: false, row: {} })}
                    onSuccess={(m, d) => {
                        if (m === 'post') {
                            data.unshift(d);
                            this.setState({ data });
                        } else {
                            let i = data.indexOf(data.filter(row => row.uuid === d.uuid)[0]);
                            data[i] = d;
                            this.setState({ data, edited: d.uuid });
                        }
                    }}
                />
            </React.Fragment>
        );
    }
}


export default CompaniesItems;