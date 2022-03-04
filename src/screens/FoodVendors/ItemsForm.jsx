import { Modal, Form, Input, Select, Button, InputNumber,Space, Switch } from 'antd';
import React, { useEffect, useState } from 'react';
import { GalleryContent } from '../../components';
import { axius, func, } from '../../utils';


const ItemsForm = props => {
    const { row } = props;

    const [form] = Form.useForm();
    const [title, setTitle] = useState('');
    const [images, setImages] = useState({ names: [], links: [], });
    const [method, setMethod] = useState('');
    const [categories, setCategories] = useState([]);

    const [uploading, setUploading] = useState(false);
    const [submitting, setSubmitting] = useState(false);


    useEffect(() => {
        axius.get('items-categories', { status: 1 }).then(res => {
            setCategories(res.status === 200 ? res.data : []);
        });
    }, []);

    useEffect(() => {
        if (row.uuid) {
            setTitle(`Edit item`);
            setMethod('put');
            form.setFieldsValue({ ...row, category: row.category.uuid });
            setImages({
                names: row.images ? row.images.split(',') : [],
                links: row.images ? row.images_links : [],
            });
        } else {
            setTitle(`Add Food`);
            setMethod('post');
            form.resetFields();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [row]);

    const uploadSuccess = (data) => {
        images.names.push(data.name);
        images.links.push(data.link);

        setImages({ names: [], links: [], });
        setImages(images);
    }
    const removeImage = (image) => {
        let i = images.names.indexOf(image);
        images.names.splice(i, 1);
        images.links.splice(i, 1);

        setImages({ names: [], links: [], });
        setImages(images);
        if (row.uuid) {
            axius[method](`items${row.uuid ? `/${row.uuid}` : ''}`, { images: images.names.join(',') });
        }
    }

    const submit = (v) => {
        setSubmitting(true);
        v['images'] = images.names.join(',');
        v['company'] = props.uuid;
        axius[method](`items${row.uuid ? `/${row.uuid}` : ''}`, v).then(res => {
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

    const close = () => {
        setTitle('');
        setMethod('');
        setSubmitting(false);
        form.resetFields();
        props.onCancel();
    }

    return (
        <React.Fragment>
            <Modal visible={props.visible} title={title} onCancel={close} width={1000} footer={[]}>
                <Form form={form} layout="vertical" onFinish={submit}>
                    <div className="row">
                        <div className="col-8">
                            <div className="row">
                                <div className="col-12 col-lg-6">
                                    <Form.Item colon={false} label="Name" name="name" rules={[{ required: true, message: 'This field is required' }]}>
                                        <Input autoComplete="off" size="large" placeholder="Food Name" disabled={submitting} />
                                    </Form.Item>
                                </div>
                                <div className="col-12 col-lg-6">
                                    <Form.Item colon={false} label="Category" name="category" rules={[{ required: true, message: 'This field is required' }]}>
                                        <Select size="large" placeholder="Food Category">
                                            {categories.map(ctg => (
                                                <Select.Option key={ctg.uuid} value={ctg.uuid}>{ctg.name}</Select.Option>
                                            ))}
                                        </Select>
                                    </Form.Item>
                                </div>
                                <div className="col-12 col-lg-6">
                                    <Form.Item colon={false} label="Discount (NGN)" name="discount" rules={[{ required: false, message: 'This field is required' }]}>
                                        <InputNumber type="number" autoComplete="off" size="large" placeholder="Discount On Food Price" disabled={submitting} />
                                    </Form.Item>
                                </div>
                                <div className="col-12 col-lg-6">
                                    <Form.Item colon={false} label="Price (NGN)" name="price" rules={[{ required: true, message: 'This field is required' }]}>
                                        <InputNumber type="number" autoComplete="off" size="large" placeholder="Food Price" disabled={submitting} />
                                    </Form.Item>
                                </div>
                                <div className="col-12 col-lg-12">
                                    <Form.Item colon={false} label="Description" name="description" rules={[{ required: true, message: 'This field is required' }]}>
                                        <Input.TextArea rows={5} autoComplete="off" size="large" placeholder="Food Description" disabled={submitting} />
                                    </Form.Item>
                                </div>
                                <div className="col-12 col-lg-12">
                                <p>Ingredients</p>
                                <Form.List name="ingredients">
                                 {(fields, { add, remove }) => (
                                        <>
                                        {fields.map(({ key, name, fieldKey, ...restField }) => (
                                            <Space key={key} style={{ marginBottom: 8 }} align="baseline" className="col-12 col-lg-6">
                                            <Form.Item
                                                {...restField}
                                                name={[name, 'name']}
                                                fieldKey={[fieldKey, 'name']}
                                                rules={[{ required: true, message: 'Field is Required' }]}
                                            >
                                                <Input placeholder="Ingredient Name" />
                                            </Form.Item>
                                                <i  className="fas fa-trash" onClick={() => remove(name)} style={{cursor:"pointer"}}></i>
                                            </Space>
                                        ))}
                                        <Form.Item>
                                            <Button type="dashed" onClick={() => add()} block >
                                            Add Ingredient
                                            </Button>
                                        </Form.Item>
                                        </>
                                    )}
                                    </Form.List>
                                    </div>
                                <div className="col-12 col-lg-6">
                                    <Form.Item colon={false} label="Status" name="status" initialValue={1} rules={[{ required: true, message: 'This field is required' }]}>
                                        {/* <Select size="large">
                                            <Select.Option value={1}>Active</Select.Option>
                                            <Select.Option value={0}>Inactive</Select.Option>
                                        </Select> */}
                                        <Switch  checkedChildren={"Active"} unCheckedChildren={"InActive"}/>
                                    </Form.Item>
                                </div>
                            </div>
                        </div>
                        <div className="col-4 text-center">
                            <GalleryContent
                                folder="items"
                                listType="picture"
                                images={images}
                                multiple={true} showUploadList={false}
                                removeImage={removeImage}
                                uploadProgress={value => setUploading(value)}
                                uploadSuccess={uploadSuccess}
                                uploadData={{ name: form.getFieldValue('name') || 'item' }}
                            />
                        </div>
                    </div>

                    <div className="text-right">
                        <Button type="primary" htmlType="submit" disabled={submitting || uploading}>
                            {submitting || uploading ? 'Saving...' : 'Save'}
                        </Button>
                    </div>
                </Form>
            </Modal>
        </React.Fragment>
    );
}


export default ItemsForm;