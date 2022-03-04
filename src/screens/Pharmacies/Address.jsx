import { Modal, Form, Input, Button } from 'antd';
import React, { useEffect, useState } from 'react';
import { axius, func, } from '../../utils';


const CompaniesAddress = props => {
    const { row, _auth: { logg } } = props;

    const [form] = Form.useForm();
    const [title, setTitle] = useState('');
    const [address, setAddress] = useState({});
    const [method, setMethod] = useState('');
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        if (row.uuid) {
            setTitle(`Edit address`);
            setMethod('put');
        } else {
            setTitle(`Create company`);
            setMethod('post');
            form.resetFields();
        }

        var pickupArea = new window.google.maps.places.Autocomplete(document.getElementById('comp_geo_address'), { componentRestrictions: { country: logg.country.code } });
        pickupArea.addListener('place_changed', async () => {
            var plc = pickupArea.getPlace();
            setAddress({
                lat: `${plc.geometry.location.lat()}`,
                lng: `${plc.geometry.location.lng()}`,
                name: `${plc.name}, ${plc.formatted_address}`,
                components: (plc.address_components || []).map(ac => {
                    return { name: ac.long_name, type: ac.types[0] };
                }),
            });
            window['$']('#comp_geo_address').val(`${plc.name}, ${plc.formatted_address}`);
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [row]);

    const close = () => {
        setTitle('');
        setMethod('');
        setAddress({});
        setSubmitting(false);
        form.resetFields();
        props.onCancel();
    }

    const submit = (v) => {
        if (address.name) {
            setSubmitting(true);
            axius[method](`companies${row.uuid ? `/${row.uuid}` : ''}`, { address }).then(res => {
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
        } else {
            func.alert({ title: 'Failed', content: 'Address has not changed' });
        }
    }

    return (
        <React.Fragment>
            <Modal visible={props.visible} title={title} onCancel={close} width={800} footer={[]}>
                <Form form={form} layout="vertical" onFinish={submit}>
                    <div><b>Cuurent address:</b> {(row.address || {}).name || '-'}</div>
                    {address.lat && (
                        <div><b>New address:</b> {(address || {}).name || '-'}</div>
                    )}
                    <p>&nbsp;</p>
                    <Input autoComplete="off" size="large" id="comp_geo_address" placeholder="Search for an exact or nearest location to you" disabled={submitting} />

                    <div className="text-right mt-4">
                        <Button type="primary" htmlType="submit" disabled={submitting}>
                            {submitting ? 'Saving...' : 'Save'}
                        </Button>
                    </div>
                </Form>
            </Modal>
        </React.Fragment>
    );
}


export default CompaniesAddress;