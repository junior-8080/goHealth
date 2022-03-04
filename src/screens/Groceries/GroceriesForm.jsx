import { Modal, Form, Input, Select, Button } from 'antd';
import React, { useEffect, useState } from 'react';
import { axius, func, } from '../../utils';


const GroceriesForm = props => {
    const { row } = props;

    const [form] = Form.useForm();
    const [file, setFile] = useState(null);
    const [image, setImage] = useState('');
    const [title, setTitle] = useState('');
    const [method, setMethod] = useState('');
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        if (row.uuid) {
            setTitle(`Edit company`);
            setMethod('put');
            form.setFieldsValue(row);
            setImage(row.logo_link);
        } else {
            setTitle(`Create company`);
            setMethod('post');
            form.resetFields();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [row]);

    const readImage = (e) => {
        let fale = e.target.files[0];
        if (fale) {
            let reader = new FileReader();
            reader.onload = (r) => {
                setImage(reader.result);
                setFile(fale);
            }
            reader.readAsDataURL(fale);
        }
    }

    const close = () => {
        setTitle('');
        setMethod('');
        setSubmitting(false);
        form.resetFields();
        props.onCancel();
    }

    const submit = (v) => {
        setSubmitting(true);
        if (file) {
            axius.postFile(`upload`, { file, folder: 'companies', name: row.name }).then(res => {
                setSubmitting(false);
                if (res.status === 200) {
                    submitGo(v, res.data[0]);
                } else {
                    if (res.status === 412) {
                        func.alert({ title: 'Failed', content: res.data.join('<br />') });
                    } else {
                        func.alert({ title: 'Failed', content: res.message, });
                    }
                }
            });
        } else {
            submitGo(v, row.logo);
        }
    }

    const submitGo = (v, logo) => {
        setSubmitting(true);
        v['logo'] = logo;
        v['phone'] = `+234${v.phone.split(' ').join('').split('+234').join('').replace(/^0/, '')}`;
        axius[method](`companies${row.uuid ? `/${row.uuid}` : ''}`, { ...props.params, ...v }).then(res => {
            setSubmitting(false);
            if (res.status === 200) {
                close();
                props.onSuccess(method, res.data);
            } else {
                if (res.status === 412) {
                    func.alert({ title: 'Failed', content: res.data.join('<br />') });
                } else {
                    func.alert({ title: 'Failed', content: res.message, });
                }
            }
        });
    }

    return (
        <React.Fragment>
            <Modal visible={props.visible} title={title} onCancel={close} width={1000} footer={[]}>
                <Form form={form} layout="vertical" onFinish={submit}>
                    <div className="row">
                        <div className="col-4 text-center">
                            <input id="comp-logo" type="file" className="hide" accept="image/*" onChange={readImage} />
                            <div>
                                <img src={image} alt={row.name} className="img-thumbnail" />
                            </div>
                            <div className="btn btn-clear btn-sm pointer hover-scales" onClick={() => window['$']('#comp-logo').click()}>
                                Change logo
                            </div>
                        </div>
                        <div className="col-8">
                            <div className="row">
                                <div className="col-12 col-lg-6">
                                    <Form.Item colon={false} label="Name" name="name" rules={[{ required: true, message: 'This field is required' }]}>
                                        <Input autoComplete="off" size="large" placeholder="Company name" disabled={submitting} />
                                    </Form.Item>
                                </div>
                                <div className="col-12 col-lg-6">
                                    <Form.Item colon={false} label="Email address" name="email" rules={[{ required: true, message: 'This field is required' }]}>
                                        <Input autoComplete="off" size="large" placeholder="Company email" disabled={submitting} />
                                    </Form.Item>
                                </div>
                                <div className="col-12 col-lg-6">
                                    <Form.Item colon={false} label="Phone no." name="phone" rules={[{ required: true, message: 'This field is required' }]}>
                                        <Input autoComplete="off" size="large" placeholder="Company phone" disabled={submitting} />
                                    </Form.Item>
                                </div>
                                <div className="col-12 col-lg-6">
                                    <Form.Item colon={false} label="Status" name="status" initialValue={1} rules={[{ required: true, message: 'This field is required' }]}>
                                        <Select size="large" disabled={submitting}>
                                            <Select.Option value={1}>Active</Select.Option>
                                            <Select.Option value={0}>Inactive</Select.Option>
                                        </Select>
                                    </Form.Item>
                                </div>
                                {/* <div className="col-12 col-lg-12">
                                    <Form.Item colon={false} label="Address" name="address" rules={[{ required: true, message: 'This field is required' }]}>
                                        <Input.TextArea rows={5} autoComplete="off" size="large" placeholder="Company address" disabled={submitting} />
                                    </Form.Item>
                                </div> */}
                            </div>
                        </div>
                    </div>

                    <div className="text-right">
                        <Button type="primary" htmlType="submit" disabled={submitting}>
                            {submitting ? 'Saving...' : 'Save'}
                        </Button>
                    </div>
                </Form>
            </Modal>
        </React.Fragment>
    );
}


export default GroceriesForm;