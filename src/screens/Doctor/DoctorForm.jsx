import { Modal, Form, Input, Select, Button,Space,Checkbox } from 'antd';
import React, { useEffect, useState } from 'react';
import { axius, func, } from '../../utils';
import {time} from '../../utils/timer'


const DoctorForm = props => {
    const { row } = props;
    const [form] = Form.useForm();
    const [file, setFile] = useState(null);
    const [image, setImage] = useState('');
    const [title, setTitle] = useState('');
    const [method, setMethod] = useState('');
    const [submitting, setSubmitting] = useState(false);
    let initialValueSchedule =[{available:false,day:"Sunday"},{available:false,day:"Monday"},{available:false,day:"Tuesday"},{available:false,day:"Wednesday"},{available:false,day:"Thursday"},{available:false,day:"Friday"},{available:false,day:"Saturday"}]


    useEffect(() => {
        if (row.uuid) {
            console.log(row)
            setTitle(`Edit Doctor`);
            setMethod('put');
            if(!row.hospital  || row.hospital.schedule.length === 0){
                row.schedule = initialValueSchedule
            }else{
                row.schedule = row.hospital.schedule
            }
            form.setFieldsValue(row);
            console.log(row)
            setImage(row.logo_link);
        } else {
            setTitle(`Create Doctor`);
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
        props.params.type = 'hospital';
        if(v.schedule){
            v.schedule = v.schedule.map((sched) => {
                if(!sched.start_time){
                    sched.start_time = "00:00"
                }
                if(!sched.end_time){
                    sched.end_time = "00:00"
                }
                return sched
            })
        }
        v.status = v.status === true ? 1 : 0
        v['phone'] = `+234${v.phone.split(' ').join('').split('+234').join('').replace(/^0/, '')}`;
        axius[method](`users${row.uuid ? `/${row.uuid}` : ''}`, { ...props.params, ...v }).then(res => {
            console.log(res)
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
            <Modal visible={props.visible} title={title} onCancel={close} width={1000} footer={[]} >
                <Form form={form} layout="vertical" onFinish={submit} >
                    <div className="row">
                        <div className="col-4 text-center">
                            <input id="comp-logo" type="file" className="hide" accept="image/*" onChange={readImage} />
                            <div>
                                <img src={image || `${window.location.origin}/user.svg`} alt={row.name} className="img-thumbnail" />
                            </div>
                            <div className="btn btn-clear btn-sm pointer hover-scales" onClick={() => window['$']('#comp-logo').click()}>
                                Change logo
                            </div>
                        </div>
                        <div className="col-8">
                            <div className="row">
                                <div className="col-12 col-lg-6">
                                    <Form.Item colon={false} label="Name" name="name" rules={[{ required: true, message: 'This field is required' }]}>
                                        <Input autoComplete="off" size="medium" placeholder="Doctor Name" disabled={submitting} />
                                    </Form.Item>
                                </div>
                                <div className="col-12 col-lg-6">
                                    <Form.Item colon={false} label="Email Address" name="email" rules={[{ required: true, message: 'This field is required' }]}>
                                        <Input autoComplete="off" size="medium" placeholder="Doctor Email" disabled={submitting} />
                                    </Form.Item>
                                </div>
                                <div className="col-12 col-lg-6">
                                    <Form.Item colon={false} label="Phone No." name="phone" rules={[{ required: true, message: 'This field is required' }]}>
                                        <Input autoComplete="off" size="medium" placeholder="Doctor Phone number" disabled={submitting} />
                                    </Form.Item>
                                </div>

                                {row.uuid ? <div className="col-12 col-lg-12 schedules" style={{backgroundColor:"#EBECF0",borderRadius:"2px",marginBottom:'5px'}}  >
                                    <label>Time Available</label>
                                    <Form.List name="schedule">
                                         {(fields, { add, remove }) => (
                                            <>
                                            {fields.map(({ key, name, ...restField }) => (
                                                <Space key={key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                                                 <Form.Item
                                                    {...restField}
                                                    name={[name, 'available']}                
                                                    valuePropName="checked"
                                                >
                                                  <Checkbox />
                                                </Form.Item> 
                                                <Form.Item
                                                    {...restField}
                                                    name={[name, 'day']}
                                                >
                                                  <Input   disabled={true}  />
                                                </Form.Item> 
                                                <Form.Item
                                                    {...restField}
                                                    name={[name, 'start_time']}
                                        
                                                >
                                                  {/* <DatePicker.TimePicker placeholder="Open Time"  getPopupContainer={trigger => trigger.parentElement} /> */}
                                                  <Select placeholder="Opening Time" >
                                                        {time.map((tm) => (
                                                            <Select.Option value={tm}>{tm}</Select.Option>
                                                        ))}
                                                    </Select>
                                                </Form.Item>
                                                <span>to</span>
                                                <Form.Item
                                                    {...restField}
                                                    name={[name, 'end_time']}>                                      
                                                    <Select placeholder="Closing Time" >
                                                        {time.map((tm) => (
                                                            <Select.Option value={tm}>{tm}</Select.Option>
                                                        ))}
                                                    </Select>
                                                </Form.Item>
                                             </Space>
                                                ))}
                                                </>
                                                )}
                                            </Form.List>
                                </div> 
                                : ''}
                                <div className="col-12 col-lg-6">
                                    <Form.Item colon={false} label="Status" name="status" initialValue={1} rules={[{ required: true, message: 'This field is required' }]}>
                                        <Select size="medium" disabled={submitting}>
                                            <Select.Option value={1}>Active</Select.Option>
                                            <Select.Option value={0}>Inactive</Select.Option>
                                        </Select>
                                    </Form.Item>
                                </div>
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


export default DoctorForm;