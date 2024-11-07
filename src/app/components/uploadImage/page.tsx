import React, { useState } from 'react';
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from '../../../config/firebaseConfig';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import { Upload, message } from 'antd';
import type { UploadProps } from 'antd';

type FileType = Parameters<UploadProps['beforeUpload']>[0];

const beforeUpload = (file: FileType) => {
  const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
  if (!isJpgOrPng) {
    message.error('You can only upload JPG/PNG file!');
  }
  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isLt2M) {
    message.error('Image must be smaller than 2MB!');
  }
  return isJpgOrPng && isLt2M;
};

const ImageUploader: React.FC<{ name: string; value?: string; onChange: (e: any) => void }> = ({ name, value, onChange }) => {
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | undefined>(value);

  const handleUpload = async (file: FileType) => {
    setLoading(true);
    const imageRef = ref(storage, `images/${file.name}`);
    await uploadBytes(imageRef, file);
    const url = await getDownloadURL(imageRef);
    onChange({ target: { name, value: url } });
    setImageUrl(url);
    setLoading(false);
    return '';
  };

  const handleChange: UploadProps['onChange'] = (info) => {
    if (info.file.status === 'uploading') {
      setLoading(true);
    } else if (info.file.status === 'done' && info.file.originFileObj) {
      handleUpload(info.file.originFileObj as FileType);
    }
  };

  const uploadButton = (
    <div>
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  );

  return (
    <Upload
      name="avatar"
      listType="picture-card"
      className="avatar-uploader"
      showUploadList={false}
      beforeUpload={beforeUpload}
      customRequest={({ file, onSuccess }) => {
        handleUpload(file as FileType);
        setTimeout(() => onSuccess && onSuccess("ok"), 0);
      }}
      onChange={handleChange}
    >
      {imageUrl ? <img src={imageUrl} alt="avatar" style={{ width: '100%' }} /> : uploadButton}
    </Upload>
  );
};

export default ImageUploader;
