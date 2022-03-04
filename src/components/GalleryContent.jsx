import React, { useState } from 'react';
import { message, Upload } from 'antd';
import { func } from '../utils';

import GalleryImageCard from './GalleryImageCard';

const GalleryContent = (props) => {
    const { folder, images, accept, uploadData, multiple, listType, showUploadList, uploadSuccess, uploadProgress } = props;
    const [uploading, setUploading] = useState(false);

    const upProps = {
        multiple,
        listType,
        showUploadList,
        accept: accept || 'image/*',
        name: 'file',
        action: `${func.api.apiURL}upload`,
        data: { folder, ...uploadData },
        headers: func.api.headersFile,
        onChange(e) {
            if (e.file.status === 'uploading') {
                setUploading(true);
                uploadProgress && uploadProgress(true);
            } else if (e.file.status === 'done') {
                setUploading(false);
                uploadProgress && uploadProgress(false);
                if (e.file.response.status === 200) {
                    uploadSuccess && uploadSuccess({
                        name: e.file.response.data[0],
                        link: e.file.response.links[0],
                    });
                }
            } else if (e.file.status === 'error') {
                setUploading(false);
                uploadProgress && uploadProgress(false);
                message.error(e.file.response.message)
            }
        },
        onRemove(e) {
            if (e.response.data) {
                func.delte(`upload/${folder}/${e.response.data[0]}`);
            }
        }
    }

    return (
        <React.Fragment>
            <div style={{ height: '200px', marginBottom: 20 }}>
                <Upload.Dragger {...upProps}>
                    <div>&nbsp;</div>
                    <p className="ant-upload-drag-icon">
                        {!uploading && (
                            <i className="fa fa-upload fa-2x text-primary"></i>
                        )}
                        {uploading && (
                            <i className="fa fa-spin fa-spinner fa-2x text-primary"></i>
                        )}
                    </p>
                    <p className="ant-upload-text">Click or drag file to this area to upload</p>
                    <div>&nbsp;</div>
                </Upload.Dragger>
            </div>
            <div className="clearfix" />
            <div className="row">
                {images.links.map((link, i) => (
                    <div key={link} className="col-12">
                        <GalleryImageCard imgLink={link} img={images.names[i]} onRemove={e => props.removeImage(e)} folder={folder} />
                    </div>
                ))}
            </div>
        </React.Fragment>
    )
};

export default GalleryContent;