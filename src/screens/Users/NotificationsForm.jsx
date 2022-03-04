/* eslint-disable array-callback-return */
import React, { useState, useEffect } from 'react';
import { Form, Button, Input, notification, Checkbox } from 'antd';
import { axius } from '../../utils';

const NotificationsForm = props => {

    const [form] = Form.useForm();
    const [errMessage, setErrMessage] = useState('');
    const [submitting, setSubmitting] = useState(false);


    useEffect(() => {

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const submit = v => {
        setErrMessage('');
        setSubmitting(true);
        axius.post(`notifications`, v).then((res) => {
            setSubmitting(false);
            if (res.status === 200) {
                props.onOK('post', res.data);
                close();
                notification.success({ message: res.message });
            } else {
                if (res.status === 412) {
                    setErrMessage(res.data.join('<br />'));
                } else {
                    setErrMessage(res.message);
                }
            }
        });
    }

    const close = () => {
        // props.onCancel();
        form.resetFields();
    }

    return (
        <React.Fragment>
            <Form form={form} layout="vertical" hideRequiredMark={false} onFinish={submit}>
                {errMessage && (<div className="alert alert-danger" dangerouslySetInnerHTML={{ __html: errMessage }} />)}

                <Form.Item colon={false} label="Subject" name="subject" rules={[{ required: true, subjecy: 'This field is required' }]}>
                    <Input autoComplete="off" size="large" placeholder="Your message here" disabled={submitting} />
                </Form.Item>

                <Form.Item colon={false} label="Message" name="message" rules={[{ required: true, message: 'This field is required' }]}>
                    <Input.TextArea autoComplete="off" size="large" rows={9} placeholder="Your message here" disabled={submitting} />
                </Form.Item>

                <Form.Item colon={false} label="Channels" name={['preferences', 'channels']} rules={[{ required: true, message: 'This field is required' }]}>
                    <Checkbox.Group>
                        <Checkbox value="email">Email</Checkbox>
                        <Checkbox value="push">Push notification</Checkbox>
                    </Checkbox.Group>
                </Form.Item>

                <Form.Item colon={false} label="Users" name={['preferences', 'users']} rules={[{ required: true, message: 'This field is required' }]}>
                    <Checkbox.Group>
                        <Checkbox value="pha">Pharmacies</Checkbox>
                        <Checkbox value="man">Manufacturers</Checkbox>
                    </Checkbox.Group>
                </Form.Item>

                <p>&nbsp;</p>
                <div className="m-t-50">
                    <Button type="danger" className="float-left" disabled={submitting} onClick={() => close()}>
                        Cancel
                    </Button> &nbsp;
                    <Button type="dark" className="float-right" htmlType="submit" loading={submitting}>
                        Submit
                    </Button>
                    <div className="clearfix"></div>
                </div>
            </Form>
        </React.Fragment>
    );

};

export default NotificationsForm;