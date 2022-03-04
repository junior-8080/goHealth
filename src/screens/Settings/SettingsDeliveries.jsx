import React, { useEffect, useState } from 'react';
import { Button, Form, Input, notification, Popconfirm } from 'antd';
import { axius, func } from '../../utils';


const SettingsDeliveries = (props) => {

    const { _data: { settings } } = props;

    const [form] = Form.useForm();
    const [submitting, setSubmitting] = useState(false);
    const [errMessage, setErrMessage] = useState('');

    useEffect(() => {
        console.log(props)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // useEffect(() => {
    //     if (row.name) {
    //         form.setFieldsValue(row);
    //     } else {
    //         form.resetFields();
    //     }
    //     // eslint-disable-next-line react-hooks/exhaustive-deps
    // }, [row]);

    const submit = v => {
        setSubmitting(true);
        setErrMessage('');
        var deliveries = settings.ng.deliveries || [];
        deliveries.unshift(v);
        axius.put(`settings`, { ng: { ...settings.ng, deliveries } }).then(res => {
            setSubmitting(false);
            if (res.status === 200) {
                form.resetFields();
                props.setSetSettings('settings', res.data);
                notification.success({ message: `${v.name} added` });
            } else {
                if (res.status === 412) {
                    setErrMessage(res.data.join('<br />'));
                } else {
                    setErrMessage(res.message);
                }
            }
        });
    }

    const deleteRow = e => {
        func.loading('deleting delivery...').then(loading => {
            var deliveries = (settings.ng.deliveries || []).filter(sd => (sd.name.toLowerCase() !== e.name.toLowerCase()));
            axius.put(`settings`, { ng: { ...settings.ng, deliveries } }).then(res => {
                loading.destroy();
                setSubmitting(false);
                if (res.status === 200) {
                    form.resetFields();
                    props.setSetSettings('settings', res.data);
                    notification.success({ message: `${e.name} deleted` });
                } else {
                    if (res.status === 412) {
                        notification.error(res.data.join('<br />'));
                    } else {
                        notification.error(res.message);
                    }
                }
            });
        })
    }

    return (
        <React.Fragment>
            {errMessage && (
                <div className="alert alert-danger" dangerouslySetInnerHTML={{ __html: errMessage }} />
            )}
            <div className="row">
                <div className="col-12 col-lg-7">
                    <div className="card mg-b-25">
                        <div className="card-body">
                            <div className="table-responsive">
                                <table className="table table-hover">
                                    <thead>
                                        <tr>
                                            <th>#</th>
                                            <th>Name</th>
                                            <th>Service fee</th>
                                            <th>#</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {(settings['ng'].deliveries || []).length === 0 && (
                                            <tr>
                                                <td colSpan="15" align="center">No delivery charges</td>
                                            </tr>
                                        )}

                                        {(settings['ng'].deliveries || []).map((row, i) => (
                                            <tr key={row}>
                                                <td>{i + 1}</td>
                                                <td>{row.name}</td>
                                                <td>₦{func.numberFormat(row.price, 2)}</td>
                                                <td align="right">
                                                    <Popconfirm title="Are you sure?" okText="Yes, Delete" okButtonProps={{ type: 'danger', size: 'small' }} onConfirm={() => deleteRow(row)}>
                                                        <Button type="danger" size="small" loading={submitting}>Delete</Button>
                                                    </Popconfirm>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-12 col-lg-5">
                    <Form form={form} layout="vertical" onFinish={submit}>
                        <div className="card mg-b-25">
                            <div className="card-header">Add new delivery</div>
                            <div className="card-body">
                                <Form.Item colon={false} label="Name" name="name" rules={[{ required: true, message: 'This field is required' }]}>
                                    <Input autoComplete="off" size="large" disabled={submitting} />
                                </Form.Item>
                                <Form.Item colon={false} label="Service fee" name="price" rules={[{ required: true, message: 'This field is required' }]}>
                                    <Input addonBefore="NGN" type="number" autoComplete="off" size="large" disabled={submitting} />
                                </Form.Item>

                                <p>&nbsp;</p>
                                <div className="mt-4">
                                    <Button type="primary" htmlType="submit" loading={submitting}>&nbsp; Submit &nbsp;</Button> {' '}
                                </div>
                            </div>
                        </div>
                    </Form>
                </div>
            </div>
        </React.Fragment>
    );
}

export default SettingsDeliveries;