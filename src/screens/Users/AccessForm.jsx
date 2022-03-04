/* eslint-disable array-callback-return */
import React, { useState, useEffect } from 'react';
import { Modal, Form, Button, Input, Select, notification, Tree } from 'antd';
import { axius, func } from '../../utils';

const UsersAccessForm = props => {
    const { row, visible, _data: { navigation } } = props;

    const [form] = Form.useForm();
    const [method, setMethod] = useState('');
    const [errMessage, setErrMessage] = useState('');
    const [modalTitle, setModalTitle] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const [checkedKeys, setCheckedKeys] = useState([]);

    useEffect(() => {
        if (row.uuid) {
            setModalTitle('Edit permission');
            setMethod('put');
            setCheckedKeys(row.permissions.split(','));
            form.setFieldsValue(row);
        } else {
            setModalTitle('Add permission');
            setMethod('post');
            setCheckedKeys([]);
            form.resetFields();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [row]);

    const addModule = (checkedKeys, inf) => {
        setCheckedKeys(checkedKeys.checked);
    }

    const submit = v => {
        setErrMessage('');
        setSubmitting(true);
        v['permissions'] = checkedKeys.join(',');
        axius[method](`users-access${method === 'put' ? `/${row.uuid}` : ''}`, v).then((res) => {
            setSubmitting(false);
            if (res.status === 200) {
                props.onOK(method, res.data);
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
        props.onCancel();
        setCheckedKeys([]);
        form.resetFields();
    }

    const mapTree = (data = []) => {
        return data.map(row => {
            return {
                key: row.code,
                title: row.name,
                children: mapTree(row.subs),
            };
        });
    }

    return (
        <Modal visible={visible} title={modalTitle} onCancel={() => close()} destroyOnClose={true} centered={true} width={1000} maskClosable={false}
            footer={null}
            style={{ top: 20 }} className={`${errMessage ? 'animated shake' : ''}`}
        >
            {visible && (
                <Form form={form} layout="vertical" hideRequiredMark={false} onFinish={submit}>
                    {errMessage && (<div className="alert alert-danger" dangerouslySetInnerHTML={{ __html: errMessage }} />)}
                    <div className="row">
                        <div className="col-12 col-lg-4">
                            <div className="row row-xs">
                                <div className="col-12 col-lg-12">
                                    <Form.Item colon={false} label="Name" name="name" rules={[{ required: true, message: 'This field is required' }]}>
                                        <Input
                                            autoComplete="off" size="large" maxLength={11} placeholder="Permission name" disabled={submitting}
                                        />
                                    </Form.Item>
                                </div>
                                <div className="col-12 col-lg-12">
                                    <Form.Item colon={false} label="Status" name="status" initialValue={1} rules={[{ required: true, message: 'This field is required' }]}>
                                        <Select optionFilterProp="children" size="large" disabled={submitting}>
                                            <Select.Option value={1}>Active</Select.Option>
                                            <Select.Option value={0}>Not active</Select.Option>
                                        </Select>
                                    </Form.Item>
                                </div>
                            </div>
                        </div>
                        <div className="col-12 col-lg-8">
                            <div className="bg-gray-100 pd-10">
                                <div className="row">
                                    {func.chunk(navigation, 5).map((navig, n) => {
                                        return (
                                            <div key={n} className="col-6">
                                                <Tree
                                                    checkable={true} defaultExpandAll={true} checkStrictly={true} selectable={false}
                                                    defaultCheckedKeys={checkedKeys}
                                                    defaultExpandedKeys={checkedKeys}
                                                    defaultSelectedKeys={checkedKeys}
                                                    onCheck={addModule}
                                                    treeData={mapTree(navig)}
                                                />
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="m-t-20">
                        <Button type="danger" className="pull-left" disabled={submitting} onClick={() => close()}>
                            Close
                        </Button> &nbsp;
                        <Button type="dark" className="pull-right" htmlType="submit" loading={submitting}>
                            Save
                        </Button>
                        <div className="clearfix"></div>
                    </div>
                </Form>
            )}
        </Modal>
    );

};

export default UsersAccessForm;