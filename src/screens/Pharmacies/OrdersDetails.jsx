import { Modal } from 'antd';
import React from 'react';
import { func } from '../../utils';


class OrdersDetails extends React.Component {

    state = {
        loading: true, data: [], row: {}, filter: { status: '' },
        step: 0, currentStep: 1, total: 0, edited: '',
    };

    render() {
        const { _data: { settings } } = this.props;
        const { company, row } = this.props;

        return (
            <React.Fragment>

                <Modal
                    visible={row.id ? true : false} title={`Order #${row.id}`}
                    width={900} centered footer={null} maskClosable={false}
                    onCancel={() => this.props.onCancel()}
                >
                    {row.id && (
                        <div>
                            <p><b>Buyer info</b></p>
                            <table className="table table-striped">
                                <tbody>
                                    <tr>
                                        <td>Name</td>
                                        <td>{row.buyer.name}</td>
                                    </tr>
                                    <tr>
                                        <td>Phone no.</td>
                                        <td>{row.buyer.phone}</td>
                                    </tr>
                                    <tr>
                                        <td>Email address</td>
                                        <td>{row.buyer.email}</td>
                                    </tr>
                                    <tr>
                                        <td>Address</td>
                                        <td>{row.schedule.address.name}</td>
                                    </tr>
                                </tbody>
                            </table>

                            <p><b>Status</b>: <span className="text-uppercase">{settings.order_status.find(sta => sta.id === row.status).name}</span></p>

                            <p><b>Items</b></p>
                            <table className="table table-striped">
                                <tbody>
                                    {(row.cart[company || 'total'].items || []).map((item, i) => (
                                        <tr key={item.name}>
                                            <td>{i + 1}. {item.name} x{item.quantity}</td>
                                            <td>₦{func.numberFormat(item.quantity * item.price, 2)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>

                            <p><b>Riders</b></p>
                            <table className="table table-striped">
                                <tbody>
                                    {row.rider.pickup && (
                                        <tr>
                                            <td>Pickup</td>
                                            <td>{row.rider.pickup.name}</td>
                                        </tr>
                                    )}
                                    {row.rider.delivery && (
                                        <tr>
                                            <td>Delivery</td>
                                            <td>{row.rider.delivery.name}</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}
                </Modal>
            </React.Fragment>
        );
    }
}


export default OrdersDetails;