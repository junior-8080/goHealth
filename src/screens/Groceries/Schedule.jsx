import { Modal, } from 'antd';
import React from 'react';
import { axius, } from '../../utils';

const limit = 12;
const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

class CompaniesSchedule extends React.Component {

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
        const { row } = this.state;

        return (
            <React.Fragment>
                <div className="card shadow mb-4">
                    <div className="card-body">
                        <div className="row">
                            <div className="col-3">

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
                                <h6 className="m-0 font-weight-bold text-primary float-left">Schedule</h6>
                                <div className="clearfix"></div>
                            </div>
                            <div className="card-body">
                                <div className="table-responsive">
                                    <table className="table table-striped table-">
                                        <tbody>

                                            {this.props.comp.schedule.map(row => (
                                                <tr key={row.day}>
                                                    <td>{i++}</td>
                                                    <td>{days[row.day]}</td>
                                                    <td>
                                                        {row.time.map(time => (
                                                            <div>- {time}</div>
                                                        ))}
                                                    </td>
                                                    {/* <td align="right">
                                                        <div className="btn btn-primary btn-sm" onClick={() => this.setState({ row })}>
                                                            Edit
                                                        </div>
                                                    </td> */}
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <Modal
                    visible={row.id ? true : false} title={`Order #${row.id}`}
                    width={900} centered footer={null} maskClosable={false}
                    onCancel={() => this.setState({ row: {} })}
                >

                </Modal>
            </React.Fragment>
        );
    }
}


export default CompaniesSchedule;