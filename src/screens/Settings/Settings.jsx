import React, { useState } from 'react';
import { Button, Input, Form, notification } from 'antd';
import { axius } from '../../utils';


const Settings = (props) => {

    const [form] = Form.useForm();
    const { _data: { settings }, } = props;

    const [submitting, setSubmitting] = useState(false);

    const submit = v => {
        var data = settings;
        Object.keys(v).forEach(k => {
            var kk = k.split('.');
            data[kk[0]][kk[1]] = v[k];
        });
        setSubmitting(true);
        axius.put('settings', data).then(res => {
            setSubmitting(false);
            if (res.status === 200) {
                notification.success(res);
            } else {
                notification.error(res);
            }
        });
    }

    const keys = { gh: 'Ghana', ng: 'Nigeria', global: 'Global' };
    const setForms = {
        'ng': [
            { label: 'Pay with', name: 'pay_with' },
            // { label: 'Price per Km', name: 'per_km' },
            { label: 'Loan interest (%)', name: 'loan_interest' },
            // { label: 'Delivery fee (₦)', name: 'delivery_fee' },
        ],
        'global': [
            { label: 'APK version', name: 'apk_version' },
            { label: 'iOS version', name: 'ios_version' },
            { label: '', name: 'break' },
            { label: 'APK Whats new', name: 'apk_whatsnew', input: <Input.TextArea rows={5} disabled={submitting} /> },
            { label: 'iOS Whats new', name: 'ios_whatsnew', input: <Input.TextArea rows={5} disabled={submitting} /> },
        ],
    };


    return (
        <React.Fragment>
            <Form form={form} layout="vertical" onFinish={submit}>
                {Object.keys(setForms).map(key => (
                    <div key={key} className="card mg-b-25">
                        <div className="card-header">
                            <b className="card-title"><span className="text-muteds">{keys[key]}</span></b>
                        </div>
                        <div className="card-body">
                            <div className="row">
                                {setForms[key].map(row => (
                                    row.name !== 'break' ? (
                                        <div key={row.name} className="col-12 col-lg-3">
                                            <Form.Item
                                                colon={false} label={row.label} name={`${key}.${row.name}`}
                                                initialValue={settings[key][row.name]}
                                                rules={[{ required: true, message: 'This field is required' }]}
                                            >
                                                <Input autoComplete="off" size="large" placeholder="" disabled={submitting} />
                                            </Form.Item>
                                        </div>
                                    ) : (
                                        <div key={row.name} className="col-12 col-lg-12">
                                            <hr />
                                        </div>
                                    )
                                ))}
                            </div>
                        </div>
                    </div>
                ))}
                <div className="card mg-b-25">
                    <div className="card-header">
                        <Button type="primary" htmlType="submit" loading={submitting}>&nbsp; &nbsp; Save changes &nbsp; &nbsp;</Button>
                    </div>
                </div>
            </Form>
        </React.Fragment>
    );
}

export default Settings;