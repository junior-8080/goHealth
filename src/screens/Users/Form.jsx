import { Modal, Form, Input, Select, Button } from 'antd';
import React, { useEffect, useState } from 'react';
import { axius, func, } from '../../utils';


const UsersForm = props => {
    const { row, type, formType } = props;

    const [form] = Form.useForm();
    const [file, setFile] = useState(null);
    const [image, setImage] = useState('');
    const [title, setTitle] = useState('');
    const [method, setMethod] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [permissions, setPermissions] = useState([]);

    useEffect(() => {
        axius.get('users-access', {}).then(res => {
            setPermissions(res.status === 200 ? res.data : []);
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (row.uuid) {
            setTitle(`Edit user`);
            setMethod('put');
            form.setFieldsValue({ ...row, access: row.access.uuid });
            setImage(row.avatar_link);
        } else {
            setTitle(`Create user`);
            setMethod('post');
            form.resetFields();
            setImage('https://el-assets.campuspunch.com/users/default.jpg');
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [row]);

    const close = () => {
        setTitle('');
        setMethod('');
        setSubmitting(false);
        form.resetFields();
        props.onCancel();
    }

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

    const submit = (v) => {
        setSubmitting(true);
        if (file) {
            axius.postFile(`upload`, { file, folder: 'users', name: row.name }).then(res => {
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

    const submitGo = (v, avatar) => {
        v['type'] = type;
        v['avatar'] = avatar;
        setSubmitting(true);
        axius[method](`users${row.uuid ? `/${row.uuid}` : ''}`, v).then(res => {
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
            <Modal visible={props.visible} title={title} onCancel={close} width={formType === 'reset' ? 400 : 900} footer={[]}>
                <Form form={form} layout="vertical" onFinish={submit}>
                    {formType === '' && (
                        <div className="row">
                            <div className="col-4 text-center">
                                <input id="usr-logo" type="file" className="hide" accept="image/*" onChange={readImage} />
                                <img src={image} alt={row.name} onError={func.imgError} className="img-thumbnail" />
                                <span className="btn btn-clear btn-sm pointer hover-scales" onClick={() => window['$']('#usr-logo').click()}>
                                    Change avatar
                                </span>
                            </div>
                            <div className="col-8">
                                <div className="row">
                                    <div className="col-12 col-lg-6">
                                        <Form.Item colon={false} label="Name" name="name" rules={[{ required: true, message: 'This field is required' }]}>
                                            <Input autoComplete="off" size="large" disabled={submitting} />
                                        </Form.Item>
                                    </div>
                                    <div className="col-12 col-lg-6">
                                        <Form.Item colon={false} label="Email address" name="email" rules={[{ required: true, message: 'This field is required' }]}>
                                            <Input autoComplete="off" size="large" disabled={submitting} />
                                        </Form.Item>
                                    </div>
                                    <div className="col-12 col-lg-6">
                                        <Form.Item colon={false} label="Phone no." name="phone" rules={[{ required: true, message: 'This field is required' }]}>
                                            <Input autoComplete="off" size="large" disabled={submitting} />
                                        </Form.Item>
                                    </div>
                                    {type === 4 && (
                                        <div className="col-12 col-lg-6">
                                            <Form.Item colon={false} label="Permission" name="access" rules={[{ required: true, message: 'This field is required' }]}>
                                                <Select size="large" showSearch optionFilterProp="children" disabled={submitting}>
                                                    {permissions.map(perm => (
                                                        <Select.Option key={perm.uuid} value={perm.uuid}>{perm.name}</Select.Option>
                                                    ))}
                                                </Select>
                                            </Form.Item>
                                        </div>
                                    )}
                                    <div className="col-12 col-lg-6">
                                        <Form.Item colon={false} label="Status" name="status" initialValue={1} rules={[{ required: true, message: 'This field is required' }]}>
                                            <Select size="large" disabled={submitting}>
                                                <Select.Option value={1}>Active</Select.Option>
                                                <Select.Option value={0}>Inactive</Select.Option>
                                            </Select>
                                        </Form.Item>
                                    </div>
                                    {method === 'post' && (
                                        <div className="col-12 col-lg-6">
                                            <Form.Item colon={false} label="Password" name="password" help="Password must be at least 8 characters long and contain both letters (a-Z) and numbers (0-9)" rules={[{ required: true, message: 'This field is required' }]}>
                                                <Input autoComplete="off" size="large" disabled={submitting} />
                                            </Form.Item>
                                        </div>
                                    )}
                                    {/* <div className="col-12 col-lg-12">
                                    <Form.Item colon={false} label="Address" name="address" rules={[{ required: true, message: 'This field is required' }]}>
                                        <Input.TextArea rows={5} autoComplete="off" size="large" placeholder="Company address" disabled={submitting} />
                                    </Form.Item>
                                </div> */}
                                </div>
                            </div>
                        </div>
                    )}

                    {formType === 'reset' && (
                        <div className="row">
                            <div className="col-12">
                                <div className="row">
                                    <div className="col-12 col-lg-12">
                                        <Form.Item colon={false} label="Password" name="password" rules={[{ required: true, message: 'This field is required' }]}>
                                            <Input autoComplete="off" size="large" disabled={submitting} />
                                        </Form.Item>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="text-right">
                        <Button type="primary" htmlType="submit" disabled={submitting}>
                            {submitting ? 'Saving...' : 'Save'}
                        </Button>
                    </div>
                </Form>
            </Modal>
        </React.Fragment >
    );
}


export default UsersForm;