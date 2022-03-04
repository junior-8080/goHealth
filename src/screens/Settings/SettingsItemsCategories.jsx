import React, { useEffect, useState } from 'react';
import { Button, Form, Input, notification, Popconfirm, Select } from 'antd';
import { axius, func } from '../../utils';

const rowStatus = [<label className="badge badge-info">Inactive</label>, <label className="badge badge-success">Active</label>,];

const SettingsItems = (props) => {

    const [form] = Form.useForm();
    const [row, setRow] = useState({});
    const [data, setData] = useState([]);
    const [file, setFile] = useState(null);
    const [image, setImage] = useState('');
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [errMessage, setErrMessage] = useState('');

    useEffect(() => {
        getData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (row.uuid) {
            setImage(row.image_link);
            form.setFieldsValue(row);
        } else {
            form.resetFields();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [row]);

    const getData = () => {
        setLoading(true);
        axius.get('items-categories').then(res => {
            setLoading(false);
            if (res.status === 200) {
                setData(res.data);
            }
        });
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
            axius.postFile(`upload`, { file, folder: 'categories', name: v.name }).then(res => {
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
            submitGo(v, row.image);
        }
    }

    const submitGo = (v, image) => {
        setSubmitting(true);
        setErrMessage('');
        v['image'] = image;
        let method = row.uuid ? 'put' : 'post';
        axius[method](`items-categories${row.uuid ? `/${row.uuid}` : ''}`, v).then(res => {
            setSubmitting(false);
            if (res.status === 200) {
                if (method === 'put') {
                    let i = data.indexOf(data.filter(row => row.uuid === res.data.uuid)[0]);
                    data[i] = res.data;
                    setData([]);
                    setData(data);
                } else {
                    data.unshift(res.data);
                    setData([]);
                    setData(data);
                }
                setRow({});
                form.resetFields();
                notification.success(res);
            } else {
                file && axius.delte(`upload/categories/${image}`);
                if (res.status === 412) {
                    setErrMessage(res.data.join('<br />'));
                } else {
                    setErrMessage(res.message);
                }
            }
        });
    }

    const deleteItem = e => {
        func.loading('deleting category...').then(loading => {
            axius.delte(`items-categories/${e.uuid}`).then(res => {
                loading.destroy();
                setSubmitting(false);
                if (res.status === 200) {
                    setData(data.filter(r => r.uuid !== e.uuid));
                    notification.success(res);
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
                                            <th colSpan="2">#</th>
                                            <th>Name</th>
                                            <th>Status</th>
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
                                                <td colSpan="15" align="center">No records</td>
                                            </tr>
                                        )}

                                        {!loading && data.map((row, i) => (
                                            <tr key={row}>
                                                <td>{i + 1}</td>
                                                <td><img src={row.image_link} alt={row.name} height="40px" /></td>
                                                <td>{row.name}</td>
                                                <td>{rowStatus[row.status]}</td>
                                                <td align="right">
                                                    <Button type="dark" size="small" loading={submitting} onClick={() => setRow(row)}>Edit</Button>
                                                    {' '}
                                                    <Popconfirm title="Are you sure?" okText="Yes, Delete" okButtonProps={{ type: 'danger', size: 'small' }} onConfirm={() => deleteItem(row)}>
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
                            <div className="card-header">
                                {row.uuid ? 'Edit' : 'Add new'} category
                            </div>
                            <div className="card-body">
                                <div className="row">
                                    <div className="col-4 text-center">
                                        <input id="category-image" type="file" className="hide" accept="image/*" onChange={readImage} />
                                        <div>
                                            <img src={image} alt={row.name} className="img-thumbnail" />
                                        </div>
                                        <div className="btn btn-clear btn-sm pointer hover-scales" onClick={() => window['$']('#category-image').click()}>
                                            Change image
                                        </div>
                                    </div>
                                    <div className="col-lg-8">
                                        <Form.Item colon={false} label="Category name" name="name" rules={[{ required: true, message: 'This field is required' }]}>
                                            <Input autoComplete="off" size="large" disabled={submitting} />
                                        </Form.Item>
                                        <Form.Item colon={false} label="Status" name="status" initialValue={1} rules={[{ required: true, message: 'This field is required' }]}>
                                            <Select size="large" disabled={submitting}>
                                                <Select.Option value={1}>Active</Select.Option>
                                                <Select.Option value={0}>Inactive</Select.Option>
                                            </Select>
                                        </Form.Item>
                                    </div>
                                </div>
                            </div>
                            <div className="card-footer">
                                <Button type="primary" htmlType="submit" loading={submitting}>&nbsp; Submit &nbsp;</Button> {' '}
                                {row.uuid && (
                                    <Button type="dark" htmlType="button" loading={submitting} onClick={() => setRow({})}>&nbsp; Cancel &nbsp;</Button>
                                )}
                            </div>
                        </div>
                    </Form>
                </div>
            </div>
        </React.Fragment>
    );
}

export default SettingsItems;