import { Spin } from 'antd';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { axius, func } from '../../utils';

import CompaniesForm from './CompaniesForm';
import CompaniesAddress from './Address';

import CompaniesItems from './Items';
import CompaniesOrders from './Orders';
import CompaniesRiders from './Riders';
import CompaniesSchedule from './Schedule';
import CompaniesUsers from './Users';

const rowStatus = [<label className="badge badge-info">Inactive</label>, <label className="badge badge-success">Active</label>,];
const cards = [
    { name: 'Edit', route: 'update', icon: 'edit', },
    { name: 'Orders', route: 'orders', icon: 'tachometer-alt', },
    { name: 'Users', route: 'users', icon: 'users', },
    // { name: 'Riders', route: 'riders', icon: 'bicycle', },
    { name: 'Drugs', route: 'items', icon: 'tablets', },
    // { name: 'Schedule', route: 'schedule', icon: 'calendar', },
    { name: 'Address', route: 'address', icon: 'map', },
];

const CompaniesManage = props => {

    const [uuid, setUuid] = useState('');
    const [row, setRow] = useState({});
    const [page, setPage] = useState('index');
    const [useForm, setUseForm] = useState({});
    const [useAddress, setUseAddress] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setUuid(props.location.pathname.split('/')[2]);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (uuid) {
            getData();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [uuid]);

    const getData = () => {
        setLoading(true);
        axius.get(`companies/${uuid}`, {}).then(res => {
            setLoading(false);
            if (res.status === 200) {
                setRow(res.data);
            } else {
                props.history.replace(`/${props.path}`);
            }
        });
    }


    return (
        <React.Fragment>
            <Spin spinning={loading} indicator={func.fspinner_xs}>
                <div className="row">
                    <div className="col-4">
                        <div className="card shadow mb-4">
                            <div className="card-header py-3">
                                <h6 className="m-0 font-weight-bold text-primary">{row.name}</h6>
                            </div>
                            <div className="card-body">
                                <div className="text-center">
                                    <img src={row.logo_link} alt={row.name} onError={func.imgError} className="img-circles img-thumbnail" width="150" />
                                </div>
                                <div>&nbsp;</div>
                                <div className="table-responsive">
                                    <table className="table table-striped">
                                        <tbody>
                                            <tr>
                                                <td><b>Code</b></td>
                                                <td>{row.code || '-'}</td>
                                            </tr>
                                            <tr>
                                                <td><b>Name</b></td>
                                                <td>{row.name || '-'}</td>
                                            </tr>
                                            <tr>
                                                <td><b>Email</b></td>
                                                <td>{row.email || '-'}</td>
                                            </tr>
                                            <tr>
                                                <td><b>Phone No.</b></td>
                                                <td>{row.phone || '-'}</td>
                                            </tr>
                                            <tr>
                                                <td><b>Address</b></td>
                                                <td>{(row.address || {}).name || '-'}</td>
                                            </tr>
                                            <tr>
                                                <td><b>Country</b></td>
                                                <td>{(row.country || {}).name || '-'}</td>
                                            </tr>
                                            <tr>
                                                <td><b>Status</b></td>
                                                <td>{rowStatus[row.status] || '-'}</td>
                                            </tr>
                                            <tr>
                                                <td><b>Date</b></td>
                                                <td>{moment(row.crdate).format('LLL')}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-8">
                        {page === 'index' && (
                            <div>
                                <div className="card shadow mb-4">
                                    <div className="card-body">
                                        <div className="text-right">
                                            <span className="btn btn-clear btn-sm pointer hover-scales" onClick={() => props.history.goBack()}>
                                                <i className="fa fa-chevron-left"></i> Go back
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div className="row">
                                    {cards.map(card => (
                                        <div className="col-3">
                                            <div key={card.name} className="card shadow mb-4 pointer" onClick={() => {
                                                if (card.route === 'update') {
                                                    setUseForm(row);
                                                } else if (card.route === 'address') {
                                                    setUseAddress(row);
                                                } else {
                                                    setPage(card.route);
                                                }
                                            }}>
                                                <div className="card-body text-center flex-middle flex-center hover-scale" style={{ padding: '50px 10px' }}>
                                                    <div>
                                                        <i className={`fas fa-fw fa-${card.icon} fa-2x primary`} />
                                                        <div></div>
                                                        <p className="mt-2 mb-0">
                                                            <span className="text-muted">{card.name}</span>
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {page === 'orders' && row.uuid && (
                            <CompaniesOrders {...props} uuid={uuid} comp={row} setPage={page => setPage(page)} />
                        )}

                        {page === 'users' && row.uuid && (
                            <CompaniesUsers {...props} uuid={uuid} comp={row} setPage={page => setPage(page)} />
                        )}

                        {page === 'riders' && row.uuid && (
                            <CompaniesRiders {...props} uuid={uuid} comp={row} setPage={page => setPage(page)} />
                        )}

                        {page === 'schedule' && row.uuid && (
                            <CompaniesSchedule {...props} uuid={uuid} comp={row} setPage={page => setPage(page)} />
                        )}

                        {page === 'items' && row.uuid && (
                            <CompaniesItems {...props} uuid={uuid} comp={row} setPage={page => setPage(page)} />
                        )}

                        {row.uuid && (
                            <CompaniesForm
                                {...props}
                                row={useForm}
                                visible={useForm.id ? true : false}
                                onCancel={() => setUseForm({})}
                                onSuccess={(m, d) => {
                                    setRow(d);
                                }}
                            />
                        )}

                        {row.uuid && (
                            <CompaniesAddress
                                {...props}
                                row={useAddress}
                                visible={useAddress.id ? true : false}
                                onCancel={() => setUseAddress({})}
                                onSuccess={(m, d) => {
                                    setRow(d);
                                }}
                            />
                        )}
                    </div>
                </div>
            </Spin>
        </React.Fragment>
    );
}


export default CompaniesManage;