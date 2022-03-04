import { Popconfirm } from 'antd';
import React, { useState } from 'react';
import { axius, func } from '../utils';

const GalleryImageCard = props => {
    const { img, imgLink, folder, onRemove } = props;

    const [submitting, setSubmitting] = useState(false);

    const remove = (image) => {
        setSubmitting(true);
        axius.delte(`upload/${folder}/${image}`).then(res => {
            setSubmitting(false);
            if (res.status === 200) {
                onRemove(image);
            }
        });
    }

    return (
        <React.Fragment>
            {img && (
                <div className="pd-8 mg-b-4" style={{ border: '1px solid #d9d9d9', borderRadius: 4, marginTop: 8 }}>
                    <div className="row">
                        <div className="col-4">
                            <img className="img-thumbnail" src={imgLink} onError={func.imgError} alt="N/A" />
                        </div>
                        {/* <div className="col-7 flex-middle small">{img}</div> */}
                        <div className="col-6 flex-middle small"></div>
                        <div className="col-2 flex-middles">
                            {!submitting && (
                                <Popconfirm title="Delete image?" okText="Delete" okButtonProps={{ danger: true }} onConfirm={() => remove(img)}>
                                    <i className="fa fa-trash pointer pd-5 text-danger"></i>
                                </Popconfirm>
                            )}
                            {submitting && (
                                <i className="fa fa-spin fa-spinner"></i>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </React.Fragment>
    );
};

export default GalleryImageCard;